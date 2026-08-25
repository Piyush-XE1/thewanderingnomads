import { defineTool } from "@lovable.dev/mcp-js";

import type { JourneyRecord, TripBatchRecord } from "@/lib/cms/types";
import {
  batchesForTrip,
  formatBatchDates,
  resolveBatches,
  resolveJourneys,
  upcomingBatch,
} from "@/lib/trips";
import { readPublicContent } from "@/lib/cms/public-read";

type JourneySummary = {
  slug: string;
  name: string;
  tag: string;
  duration: string | null;
  season: string | null;
  group: string;
  difficulty: string | null;
  summary: string;
  nextBatch: string | null;
};

function toSummary(journey: JourneyRecord, batches: TripBatchRecord[]): JourneySummary {
  const next = upcomingBatch(batchesForTrip(batches, journey.id));
  return {
    slug: journey.slug,
    name: journey.title,
    tag: journey.destination,
    duration: journey.duration,
    season: journey.best_season,
    group: "8–12",
    difficulty: journey.difficulty,
    summary: (journey.short_description ?? "").replace(/<[^>]*>/g, ""),
    nextBatch: next ? formatBatchDates(next) : null,
  };
}

/**
 * The live trip catalogue — same source of truth as the public website
 * (Supabase CMS when trips are published, built-in fallback otherwise), so
 * the answers this tool gives never drift out of sync with the site.
 */
export async function loadJourneySummaries(): Promise<JourneySummary[]> {
  const content = await readPublicContent();
  const journeys = resolveJourneys(content.journeys);
  const batches = resolveBatches(content.batches, journeys);
  return journeys.map((j) => toSummary(j, batches));
}

export default defineTool({
  name: "list_journeys",
  title: "List journeys",
  description:
    "List the current small-group trips offered by The Wandering Nomads, with destination, duration, difficulty, season and the next confirmed batch dates.",
  inputSchema: {},
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async () => {
    const journeys = await loadJourneySummaries();
    return {
      content: [{ type: "text", text: JSON.stringify(journeys, null, 2) }],
      structuredContent: { journeys },
    };
  },
});
