import { queryOptions, useQuery } from "@tanstack/react-query";

import { getPublicContent } from "./content.functions";
import { EMPTY_CONTENT, findSection, type PageSection, type PublicContent } from "./types";

/**
 * Read the public content straight from Supabase with the anon key (row-level
 * security still applies — published rows only). Same source of truth as the
 * server read; used only when the server function is unavailable or reports
 * failure (ok:false), so a function-environment problem can never freeze the
 * public site on stale default content while the database is healthy.
 */
async function getPublicContentDirect(): Promise<PublicContent> {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    // Generic table-driven reads (same pattern as src/lib/cms/admin.ts); the
    // anon key keeps row-level security in charge of what is returned.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const list = async (table: string, order: string) => {
      const { data, error } = await db.from(table).select("*").order(order, { ascending: true });
      if (error) throw new Error(`${table}: ${error.message}`);
      return (data ?? []) as unknown[];
    };
    const single = async (table: string) => {
      const { data, error } = await db.from(table).select("*").eq("id", "default").maybeSingle();
      if (error) throw new Error(`${table}: ${error.message}`);
      return (data ?? null) as unknown;
    };

    const results = await Promise.allSettled([
      single("site_settings"),
      single("design_settings"),
      list("social_links", "sort_order"),
      list("page_sections", "sort_order"),
      single("about_content"),
      list("milestones", "sort_order"),
      list("journeys", "sort_order"),
      list("gallery_images", "sort_order"),
      list("atlas_regions", "sort_order"),
      list("atlas_destinations", "sort_order"),
      list("atlas_stories", "sort_order"),
      list("testimonials", "sort_order"),
      list("hosts", "sort_order"),
      list("trip_batches", "start_date"),
      list("trip_batch_hosts", "id"),
      list("journey_images", "sort_order"),
    ]);

    // All-or-nothing signal: if the direct read is dead too, return EMPTY so
    // pages use their built-in defaults — never a half-broken hybrid.
    if (results.every((r) => r.status === "rejected")) return EMPTY_CONTENT;

    const value = <T>(index: number, fallback: T): T => {
      const r = results[index];
      return r.status === "fulfilled" ? (r.value as T) : fallback;
    };

    return {
      ok: true,
      settings: value(0, null) as PublicContent["settings"],
      design: value(1, null) as PublicContent["design"],
      social: value(2, []) as PublicContent["social"],
      sections: value(3, []) as PublicContent["sections"],
      about: value(4, null) as PublicContent["about"],
      milestones: value(5, []) as PublicContent["milestones"],
      journeys: value(6, []) as PublicContent["journeys"],
      gallery: value(7, []) as PublicContent["gallery"],
      regions: value(8, []) as PublicContent["regions"],
      destinations: value(9, []) as PublicContent["destinations"],
      stories: value(10, []) as PublicContent["stories"],
      testimonials: value(11, []) as PublicContent["testimonials"],
      hosts: value(12, []) as PublicContent["hosts"],
      batches: value(13, []) as PublicContent["batches"],
      batchHosts: value(14, []) as PublicContent["batchHosts"],
      journeyImages: value(15, []) as PublicContent["journeyImages"],
    };
  } catch (error) {
    console.error("[cms] direct content read failed", error);
    return EMPTY_CONTENT;
  }
}

async function fetchPublicContent(): Promise<PublicContent> {
  try {
    const content = await getPublicContent();
    if (content.ok) return content;
  } catch (error) {
    console.warn("[cms] server content read failed, trying direct read", error);
  }
  return getPublicContentDirect();
}

export const publicContentQuery = queryOptions({
  queryKey: ["cms", "public-content"],
  queryFn: fetchPublicContent,
  staleTime: 30_000,
  gcTime: 10 * 60_000,
  retry: 1,
});

/**
 * Public website content. Never suspends and never throws — components keep
 * their built-in default content until CMS data arrives.
 */
export function useContent(): PublicContent {
  const { data } = useQuery(publicContentQuery);
  return data ?? EMPTY_CONTENT;
}

export function useSection(page: string, key: string): PageSection | undefined {
  const { sections } = useContent();
  return findSection(sections, page, key);
}
