import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

/**
 * Admin-side data access.
 *
 * Every write goes through the authenticated browser client, so authorization
 * is enforced server-side by row-level security (`has_role(auth.uid(),'admin')`)
 * — a client-side flag alone can never grant write access.
 */

export type AdminTable =
  | "site_settings"
  | "design_settings"
  | "about_content"
  | "social_links"
  | "page_sections"
  | "milestones"
  | "journeys"
  | "journey_images"
  | "atlas_regions"
  | "atlas_destinations"
  | "atlas_stories"
  | "gallery_images"
  | "testimonials"
  | "hosts"
  | "trip_batches"
  | "trip_batch_hosts"
  | "media"
  | "audit_log";

type Row = Record<string, unknown>;

/**
 * Loosely-typed handle for generic (table-name-driven) CRUD helpers below.
 * Authorization is still enforced by row-level security on every request.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export function useAdminSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (current: Session | null) => {
    setSession(current);
    if (!current) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    const { data } = await supabase.rpc("has_role", {
      _user_id: current.user.id,
      _role: "admin",
    });
    setIsAdmin(data === true);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) void refresh(data.session);
    });
    supabase.rpc("admin_exists").then(({ data }) => {
      if (active) setAdminExists(data === true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      if (event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") return;
      void refresh(next);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [refresh]);

  return { session, isAdmin, adminExists, loading };
}

export async function signInAdmin(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOutAdmin() {
  await supabase.auth.signOut();
}

export async function logAudit(entry: {
  entity: string;
  entityId?: string | null;
  action: string;
  summary?: string;
}) {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return;
  await db.from("audit_log").insert({
    user_id: user.id,
    actor_email: user.email ?? null,
    entity: entry.entity,
    entity_id: entry.entityId ?? null,
    action: entry.action,
    summary: entry.summary ?? null,
  });
}

export async function listRows(table: AdminTable, orderBy = "sort_order") {
  const query = db.from(table).select("*");
  const { data, error } = await query.order(orderBy, { ascending: true });
  if (error) throw error;
  return (data ?? []) as Row[];
}

export async function getSingleton(table: AdminTable) {
  const { data, error } = await db.from(table).select("*").eq("id", "default").maybeSingle();
  if (error) throw error;
  return (data ?? {}) as Row;
}

/**
 * PostgREST returns success with zero affected rows when row-level security
 * filters the target rows out (or the id no longer exists). Without checking
 * the returned rows the UI would toast "Saved — live on the website" while
 * the database stayed untouched — the exact symptom reported as "CMS changes
 * save but never appear". Every mutation below therefore selects the affected
 * rows and throws when nothing was actually written.
 */
const NOT_PERSISTED =
  "The save did not reach the database (0 rows updated). Sign out and back in with the owner account, then try again.";

export async function saveSingleton(table: AdminTable, values: Row) {
  const { data, error } = await db
    .from(table)
    .upsert({ ...values, id: "default" }, { onConflict: "id" })
    .select("id");
  if (error) throw error;
  if (!Array.isArray(data) || data.length === 0) throw new Error(NOT_PERSISTED);
  await logAudit({ entity: table, entityId: "default", action: "update" });
}

export async function insertRow(table: AdminTable, values: Row) {
  const { data, error } = await db.from(table).insert(values).select("id").single();
  if (error) throw error;
  await logAudit({ entity: table, entityId: (data as { id: string }).id, action: "create" });
  return data as { id: string };
}

export async function updateRow(table: AdminTable, id: string, values: Row) {
  const { data, error } = await db.from(table).update(values).eq("id", id).select("id");
  if (error) throw error;
  if (!Array.isArray(data) || data.length === 0) throw new Error(NOT_PERSISTED);
  await logAudit({ entity: table, entityId: id, action: "update" });
}

export async function deleteRow(table: AdminTable, id: string, summary?: string) {
  const { data, error } = await db.from(table).delete().eq("id", id).select("id");
  if (error) throw error;
  if (!Array.isArray(data) || data.length === 0) throw new Error(NOT_PERSISTED);
  await logAudit({ entity: table, entityId: id, action: "delete", summary });
}

export async function reorderRows(table: AdminTable, orderedIds: string[]) {
  const updates = orderedIds.map((id, index) =>
    db
      .from(table)
      .update({ sort_order: index + 1 })
      .eq("id", id)
      .select("id"),
  );
  const results = await Promise.all(updates);
  const firstError = results.find((r) => r.error)?.error;
  if (firstError) throw firstError;
  if (results.some((r) => !Array.isArray(r.data) || r.data.length === 0)) {
    throw new Error(NOT_PERSISTED);
  }
  await logAudit({ entity: table, entityId: "multiple", action: "reorder" });
}

const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
];
const MAX_BYTES = 20 * 1024 * 1024;

export type MediaRecord = {
  id: string;
  path: string;
  url: string;
  filename: string;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  alt_text: string | null;
  created_at: string;
};

async function imageSize(file: File): Promise<{ width: number | null; height: number | null }> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return { width: null, height: null };
  }
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return { width: null, height: null };
  }
}

function safeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(-80);
}

export async function uploadMedia(file: File, folder = "library"): Promise<MediaRecord> {
  if (!ALLOWED_MIME.includes(file.type)) {
    throw new Error("Unsupported file type. Use JPG, PNG, WebP, AVIF, GIF, SVG or MP4.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("File is larger than 20 MB. Please compress it first.");
  }

  const path = `${folder}/${Date.now()}-${safeName(file.name)}`;
  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, file, { cacheControl: "31536000", contentType: file.type, upsert: false });
  if (uploadError) throw uploadError;

  const { width, height } = await imageSize(file);
  const { data: session } = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from("media")
    .insert({
      bucket: "media",
      path,
      url: `/api/public/media/${path}`,
      filename: file.name,
      mime_type: file.type,
      width,
      height,
      size_bytes: file.size,
      created_by: session.session?.user.id ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;

  await logAudit({
    entity: "media",
    entityId: (data as MediaRecord).id,
    action: "upload",
    summary: file.name,
  });
  return data as MediaRecord;
}

export async function deleteMedia(record: MediaRecord) {
  await supabase.storage.from("media").remove([record.path]);
  const { error } = await db.from("media").delete().eq("id", record.id);
  if (error) throw error;
  await logAudit({
    entity: "media",
    entityId: record.id,
    action: "delete",
    summary: record.filename,
  });
}

/** Counts references to a media URL across content tables. */
export async function mediaUsage(url: string) {
  const checks: { label: string; table: AdminTable; column: string }[] = [
    { label: "Gallery images", table: "gallery_images", column: "url" },
    { label: "Journey hero images", table: "journeys", column: "hero_image_url" },
    { label: "Journey gallery images", table: "journey_images", column: "url" },
    { label: "Atlas covers", table: "atlas_regions", column: "cover_image_url" },
    { label: "Page sections", table: "page_sections", column: "image_url" },
    { label: "Testimonial avatars", table: "testimonials", column: "avatar_url" },
    { label: "Host photos", table: "hosts", column: "photo_url" },
  ];
  const usage: { label: string; count: number }[] = [];
  for (const check of checks) {
    const { count } = await db
      .from(check.table)
      .select("id", { count: "exact", head: true })
      .eq(check.column, url);
    if (count && count > 0) usage.push({ label: check.label, count });
  }
  return usage;
}
