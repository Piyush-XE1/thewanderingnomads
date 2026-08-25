import { createServerFn } from "@tanstack/react-start";

import { readLaunchState, readPublicContent } from "./public-read";
import type { PublicContent } from "./types";

/**
 * Public, read-only CMS reads exposed as server functions.
 *
 * POST is deliberate: GET server-function responses can be cached by hosting
 * CDNs/browsers, which made the public site serve stale CMS content even
 * after a hard refresh. A POST RPC is never cached, so an admin edit is
 * visible on the very next page load.
 */
export const getPublicContent = createServerFn({ method: "POST" }).handler(
  async (): Promise<PublicContent> => readPublicContent(),
);

/**
 * Minimal, cheap read used by the launch gate. Never throws: if the backend is
 * unavailable the site stays on the scheduled (code-level) launch behaviour.
 * POST for the same no-caching reason as above — the launch switch must be
 * honoured the moment the owner flips it.
 */
export const getLaunchState = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ launch_status: "pre_launch" | "live" | null; launch_at: string | null }> =>
    readLaunchState(),
);
