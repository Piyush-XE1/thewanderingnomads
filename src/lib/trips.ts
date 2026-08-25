import type { HostRecord, JourneyRecord, TripBatchHostRecord, TripBatchRecord } from "./cms/types";
import { waLink } from "./site";

/**
 * Small, dependency-free helpers shared by the public trip surfaces
 * (trip cards, the Upcoming Trips listing, and the trip detail page).
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-08-25" → "25 Aug 2026" (date-only, no timezone drift). */
export function formatDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "25 Aug – 31 Aug 2026" (collapses to a single date when end equals start). */
export function formatBatchDates(batch: Pick<TripBatchRecord, "start_date" | "end_date">): string {
  const start = formatDate(batch.start_date);
  const end = batch.end_date ? formatDate(batch.end_date) : "";
  return end && end !== start ? `${start} – ${end}` : start;
}

/** Batches for one trip, oldest first. */
export function batchesForTrip(batches: TripBatchRecord[], tripId: string): TripBatchRecord[] {
  return batches
    .filter((b) => b.trip_id === tripId)
    .sort((a, b) => a.start_date.localeCompare(b.start_date));
}

/** The first batch that starts today or later (the one to show on a card). */
export function upcomingBatch(batches: TripBatchRecord[]): TripBatchRecord | undefined {
  const today = new Date().toISOString().slice(0, 10);
  return batches.find((b) => b.start_date >= today);
}

/** Hosts assigned to a batch, with their role. */
export function hostsForBatch(
  batchId: string,
  batchHosts: TripBatchHostRecord[],
  hosts: HostRecord[],
): { host: HostRecord; role: "lead" | "co_host" }[] {
  const byId = new Map(hosts.map((h) => [h.id, h]));
  return batchHosts
    .filter((l) => l.batch_id === batchId)
    .map((l) => ({ host: byId.get(l.host_id), role: l.role }))
    .filter((x): x is { host: HostRecord; role: "lead" | "co_host" } => Boolean(x.host));
}

/* ----------------------------- WhatsApp ------------------------------ */

export { waLink };

/** Pull a numeric rupee amount out of a free-text price ("₹24,999", "From 18000"). */
export function parsePrice(price?: string | null): number | null {
  if (!price) return null;
  const digits = price.replace(/[^\d]/g, "");
  if (!digits) return null;
  const value = Number(digits);
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function formatRupees(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

/**
 * Built-in catalogue used ONLY when the CMS has no published trips yet
 * (offline preview / first deploy before the admin publishes anything).
 * Once any journey is published, listings switch over to CMS data entirely
 * so draft/demo trips never mix with the real inventory. Keep this list in
 * step with the journeys seeded in supabase/migrations.
 */
export const DEFAULT_JOURNEYS: JourneyRecord[] = [
  {
    id: "default-chandratal",
    slug: "chandratal-manali-kasol",
    destination: "Himachal Pradesh",
    title: "Chandratal · Manali · Kasol",
    short_description:
      "Manali's cedar air, a star-lit night beside the Chandratal moon lake, and slow evenings by the Parvati in Kasol.",
    long_description:
      "A 6-day Himachal loop that doesn't rush: two easy days around Manali's cafés and pine ridges, a night beside Chandratal's still water under a sky full of stars, and a decompression finish in Kasol. Small group, confirmed batch, every day hosted.",
    duration: "6 days",
    price: null,
    difficulty: "Moderate",
    best_season: "Sep — Oct",
    is_available: true,
    highlights: [
      "Chandratal moon lake (4,300 m)",
      "Old Manali & its cafés",
      "Parvati valley evenings in Kasol",
      "Confirmed departure — 10 to 15 Sep",
    ],
    itinerary: [
      { day: 1, title: "Arrive Manali", description: "Meet the host, old-town walk, early night." },
      {
        day: 2,
        title: "Manali, unhurried",
        description: "Jogini falls or a pine-ridge walk, café evening.",
      },
      {
        day: 3,
        title: "The road to Chandratal",
        description: "A long, beautiful drive. Camp beside the lake.",
      },
      {
        day: 4,
        title: "Moon lake morning",
        description: "Sunrise at Chandratal, slow return toward Manali.",
      },
      { day: 5, title: "Kasol", description: "Parvati river, village walk, café time." },
      { day: 6, title: "Depart", description: "Drop at Bhuntar. WhatsApp group stays open." },
    ],
    travel_info:
      "Reach Manali by overnight Volvo from Delhi/Chandigarh or fly into Bhuntar (KUU). We coordinate pickups in Manali on Day 1.",
    notes:
      "Chandratal sits at 4,300 m — Day 4 stays flexible for acclimatisation and road weather.",
    cta_label: null,
    booking_url: null,
    hero_image_url: null,
    sort_order: 0,
  },
  {
    id: "default-valley-of-flowers",
    slug: "valley-of-flowers",
    destination: "Valley of Flowers",
    title: "Valley of Flowers Trek",
    short_description: "An alpine meadow that bursts into colour for only a few weeks a year.",
    long_description:
      "A trek into the Nanda Devi biosphere — Govindghat to Ghangaria, a full day in the valley, and Hemkund Sahib if the group wants the extra climb.",
    duration: "6 days",
    price: null,
    difficulty: "Moderate",
    best_season: "Jul — Sep",
    is_available: true,
    highlights: [
      "Peak bloom window",
      "Ghangaria base",
      "Optional Hemkund Sahib",
      "Launch batch — 25 to 30 Sep",
    ],
    itinerary: [
      { day: 1, title: "Assemble", description: "Haridwar or Govindghat — confirmed on booking." },
      { day: 2, title: "Trek to Ghangaria", description: "The base for the valley. Early night." },
      {
        day: 3,
        title: "Valley of Flowers",
        description: "A full day in the meadow. Peak bloom window.",
      },
      { day: 4, title: "Hemkund optional", description: "The extra climb if the group wants it." },
      { day: 5, title: "Walk out", description: "Back to the road, weather permitting." },
      { day: 6, title: "Depart", description: "Drop at the assembly point." },
    ],
    travel_info: "Assemble at Haridwar or Govindghat — confirmed on booking.",
    notes: "Permits and mountain weather can reshape a day. We plan slack into the itinerary.",
    cta_label: null,
    booking_url: null,
    hero_image_url: null,
    sort_order: 1,
  },
  {
    id: "default-meghalaya",
    slug: "meghalaya",
    destination: "Meghalaya",
    title: "Meghalaya — Cloud Country",
    short_description: "Living-root bridges, waterfalls after rain, and Dawki's glass-clear river.",
    long_description:
      "Five days in the abode of clouds — Shillong's cafés, the root bridges and blue pools of Sohra, and a slow morning on the Umngot at Dawki. A launch batch, hosted personally, kept deliberately small.",
    duration: "5 days",
    price: null,
    difficulty: "Moderate",
    best_season: "Oct — Apr",
    is_available: true,
    highlights: [
      "Double-decker root bridge trek",
      "Dawki (Umngot) river morning",
      "Sohra waterfalls & blue pools",
      "Launch batch — 16 to 20 Oct",
    ],
    itinerary: [
      { day: 1, title: "Shillong", description: "Meet the host, cafés, an easy evening." },
      {
        day: 2,
        title: "Sohra (Cherrapunji)",
        description: "Waterfalls, caves, and the first blue pools.",
      },
      {
        day: 3,
        title: "Root bridge trek",
        description: "The double-decker bridge — steps down, smiles up.",
      },
      { day: 4, title: "Dawki", description: "Glass-clear river, boats, border market." },
      { day: 5, title: "Depart", description: "Return to Shillong / Guwahati." },
    ],
    travel_info: "Fly into Shillong (SHL) or Guwahati (GAU); we coordinate the Shillong pickup.",
    notes: "The root-bridge descent has ~3,500 steps. Take it slow — we do.",
    cta_label: null,
    booking_url: null,
    hero_image_url: null,
    sort_order: 2,
  },
  {
    id: "default-dev-deepawali",
    slug: "dev-deepawali-varanasi",
    destination: "Varanasi",
    title: "Dev Deepawali — Varanasi",
    short_description:
      "A million lamps on the ghats, a boat on the Ganges, and three days inside the oldest living city.",
    long_description:
      "Dev Deepawali is the night the ghats of Varanasi light end to end. Three hosted days — dawn boat rides, the old city's lanes and kitchens, and the festival evening watched from the river itself.",
    duration: "3 days",
    price: null,
    difficulty: "Easy",
    best_season: "Nov",
    is_available: true,
    highlights: [
      "Dev Deepawali evening on the ghats",
      "Sunrise boat ride on the Ganges",
      "Old-city food walk",
      "Confirmed — 23 to 25 Nov",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Varanasi",
        description: "Ghat walk, evening aarti from the river.",
      },
      {
        day: 2,
        title: "Old city",
        description: "Sunrise boat ride, lanes, kachori and chai.",
      },
      {
        day: 3,
        title: "Dev Deepawali",
        description: "The festival of lamps. Evening boat, late checkout next morning.",
      },
    ],
    travel_info:
      "Reach Varanasi by train (BSB) or flight (VNS); we meet you at the ghats on Day 1.",
    notes: "Festival crowds are part of the experience — the group stays together with the host.",
    cta_label: null,
    booking_url: null,
    hero_image_url: null,
    sort_order: 3,
  },
];

/**
 * Departures for the fallback catalogue above. Only used while the site is
 * rendering DEFAULT_JOURNEYS (no published CMS batches yet).
 */
export const DEFAULT_BATCHES: TripBatchRecord[] = [
  {
    id: "default-batch-chandratal",
    trip_id: "default-chandratal",
    start_date: "2026-09-10",
    end_date: "2026-09-15",
    capacity: null,
    seats_remaining: null,
    batch_type: "Confirmed",
    status: "published",
    sort_order: 0,
  },
  {
    id: "default-batch-vof",
    trip_id: "default-valley-of-flowers",
    start_date: "2026-09-25",
    end_date: "2026-09-30",
    capacity: null,
    seats_remaining: null,
    batch_type: "Launch",
    status: "published",
    sort_order: 1,
  },
  {
    id: "default-batch-meghalaya",
    trip_id: "default-meghalaya",
    start_date: "2026-10-16",
    end_date: "2026-10-20",
    capacity: null,
    seats_remaining: null,
    batch_type: "Launch",
    status: "published",
    sort_order: 2,
  },
  {
    id: "default-batch-dev-deepawali",
    trip_id: "default-dev-deepawali",
    start_date: "2026-11-23",
    end_date: "2026-11-25",
    capacity: null,
    seats_remaining: null,
    batch_type: "Confirmed",
    status: "published",
    sort_order: 3,
  },
];

/** CMS trips if any are published; otherwise the built-in catalogue. */
export function resolveJourneys(cms: JourneyRecord[]): JourneyRecord[] {
  return cms.length > 0 ? cms : DEFAULT_JOURNEYS;
}

/**
 * CMS batches normally. Only when listings have fallen back to the built-in
 * catalogue do the built-in departures apply (they only match fallback trips).
 */
export function resolveBatches(
  cms: TripBatchRecord[],
  journeys: JourneyRecord[],
): TripBatchRecord[] {
  if (cms.length > 0) return cms;
  return journeys === DEFAULT_JOURNEYS ? DEFAULT_BATCHES : cms;
}

/** Find a trip by slug, falling back to the built-in catalogue only when CMS is empty. */
export function findJourney(cms: JourneyRecord[], slug: string): JourneyRecord | undefined {
  const published = cms.find((j) => j.slug === slug);
  if (published) return published;
  if (cms.length > 0) return undefined;
  return DEFAULT_JOURNEYS.find((j) => j.slug === slug);
}

/**
 * Pre-filled enquiry message — the visitor never has to type trip details.
 * Batch (when chosen) is inserted dynamically, matching the agreed
 * Book Now → WhatsApp conversion flow.
 */
export function tripEnquiryMessage(
  trip: { title: string },
  batch?: TripBatchRecord | null,
): string {
  const parts = [`Hi The Wandering Nomads! I'm interested in the ${trip.title}.`];
  if (batch) parts.push(`Batch: ${formatBatchDates(batch)}.`);
  parts.push("I'd like to know the next steps for booking.");
  return parts.join(" ");
}
