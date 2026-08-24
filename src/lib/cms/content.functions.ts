import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import { EMPTY_CONTENT, type PublicContent } from "./types";

/**
 * Public, read-only CMS reads.
 *
 * Uses the publishable (anon) key so row-level security applies: only rows
 * marked `published` are ever returned. Every failure degrades to
 * `EMPTY_CONTENT` so the public website falls back to its built-in defaults
 * instead of crashing.
 */
function publicClient() {
  const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const getPublicContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicContent> => {
    const supabase = publicClient();
    if (!supabase) return EMPTY_CONTENT;

    try {
      const [
        settings,
        design,
        social,
        sections,
        about,
        milestones,
        journeys,
        gallery,
        regions,
        destinations,
        stories,
        testimonials,
        hosts,
        batches,
        batchHosts,
        journeyImages,
      ] = await Promise.all([
        supabase.from("site_settings").select("*").eq("id", "default").maybeSingle(),
        supabase.from("design_settings").select("*").eq("id", "default").maybeSingle(),
        supabase.from("social_links").select("*").order("sort_order"),
        supabase.from("page_sections").select("*").order("sort_order"),
        supabase.from("about_content").select("*").eq("id", "default").maybeSingle(),
        supabase.from("milestones").select("*").order("sort_order"),
        supabase.from("journeys").select("*").order("sort_order"),
        supabase.from("gallery_images").select("*").order("sort_order"),
        supabase.from("atlas_regions").select("*").order("sort_order"),
        supabase.from("atlas_destinations").select("*").order("sort_order"),
        supabase.from("atlas_stories").select("*").order("sort_order"),
        supabase.from("testimonials").select("*").order("sort_order"),
        supabase.from("hosts").select("*").order("sort_order"),
        supabase.from("trip_batches").select("*").order("start_date"),
        supabase.from("trip_batch_hosts").select("*"),
        supabase.from("journey_images").select("*").order("sort_order"),
      ]);

      return {
        ok: true,
        settings: (settings.data as PublicContent["settings"]) ?? null,
        design: (design.data as PublicContent["design"]) ?? null,
        social: (social.data ?? []) as PublicContent["social"],
        sections: (sections.data ?? []) as PublicContent["sections"],
        about: (about.data as PublicContent["about"]) ?? null,
        milestones: (milestones.data ?? []) as PublicContent["milestones"],
        journeys: (journeys.data ?? []) as PublicContent["journeys"],
        gallery: (gallery.data ?? []) as PublicContent["gallery"],
        regions: (regions.data ?? []) as PublicContent["regions"],
        destinations: (destinations.data ?? []) as PublicContent["destinations"],
        stories: (stories.data ?? []) as PublicContent["stories"],
        testimonials: (testimonials.data ?? []) as PublicContent["testimonials"],
        hosts: (hosts.data ?? []) as PublicContent["hosts"],
        batches: (batches.data ?? []) as PublicContent["batches"],
        batchHosts: (batchHosts.data ?? []) as PublicContent["batchHosts"],
        journeyImages: (journeyImages.data ?? []) as PublicContent["journeyImages"],
      };
    } catch (error) {
      console.error("[cms] public content read failed", error);
      return EMPTY_CONTENT;
    }
  },
);

/**
 * Minimal, cheap read used by the launch gate. Never throws: if the backend is
 * unavailable the site stays on the scheduled (code-level) launch behaviour.
 */
export const getLaunchState = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ launch_status: "pre_launch" | "live" | null; launch_at: string | null }> => {
    const supabase = publicClient();
    if (!supabase) return { launch_status: null, launch_at: null };
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("launch_status, launch_at")
        .eq("id", "default")
        .maybeSingle();
      return {
        launch_status: (data?.launch_status as "pre_launch" | "live" | undefined) ?? null,
        launch_at: (data?.launch_at as string | undefined) ?? null,
      };
    } catch {
      return { launch_status: null, launch_at: null };
    }
  },
);
