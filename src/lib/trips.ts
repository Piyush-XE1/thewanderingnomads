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
 * Built-in catalogue used when the CMS has no published trips yet.
 * Once any journey is published, listings switch over to CMS data entirely
 * so draft/demo trips never mix with the real inventory.
 */
export const DEFAULT_JOURNEYS: JourneyRecord[] = [
  {
    id: "default-kashmir",
    slug: "kashmir",
    destination: "Kashmir",
    title: "Kashmir Expedition",
    short_description:
      "Shikaras on Dal Lake. Nights inside Kashmiri homes. The valley the way it is actually lived.",
    long_description:
      "A slow week in the Kashmir valley — houseboats and homestays, pine ridges above Gulmarg, and evenings that belong to the people who live here. Small group, confirmed dates, every day hosted.",
    duration: "8 days",
    price: "₹24,999",
    difficulty: "Easy",
    best_season: "Apr — Oct",
    is_available: true,
    highlights: [
      "Dal Lake at first light",
      "Nights with a Kashmiri host family",
      "Gulmarg meadows and pine trails",
      "Wazwan shared, not plated",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Srinagar",
        description: "Houseboat check-in, lake evening, welcome circle.",
      },
      {
        day: 2,
        title: "Old city & gardens",
        description: "Heritage lanes, spice markets, Mughal gardens.",
      },
      { day: 3, title: "Gulmarg day", description: "Meadows, gondola option, pine-ridge walk." },
      {
        day: 4,
        title: "Homestay transfer",
        description: "Village stay, kitchen stories, slow afternoon.",
      },
      { day: 5, title: "Local trails", description: "Ridge walk, picnic, unhurried valley views." },
      { day: 6, title: "Craft & cuisine", description: "Walnut wood, saffron, a proper wazwan." },
      { day: 7, title: "Free morning", description: "Lake, last photographs, optional shikara." },
      { day: 8, title: "Depart", description: "Airport drop. WhatsApp group stays open." },
    ],
    travel_info: "Fly into Srinagar. We pick up from the airport on Day 1.",
    notes: null,
    cta_label: null,
    booking_url: null,
    hero_image_url: null,
    sort_order: 0,
  },
  {
    id: "default-spiti",
    slug: "spiti",
    destination: "Spiti",
    title: "Spiti High-Altitude Expedition",
    short_description:
      "Cold desert monasteries, star-lit villages, and roads that hang from the mountain's edge.",
    long_description:
      "A high-altitude crossing of the Spiti valley — Key, Kaza, Chandratal if the pass is open, and nights thin enough to see the Milky Way without trying.",
    duration: "10 days",
    price: "₹29,999",
    difficulty: "Moderate",
    best_season: "Jun — Sep",
    is_available: true,
    highlights: [
      "Chandratal when the pass allows",
      "Key Monastery at dusk",
      "Homestays in high villages",
      "Acclimatisation built into the route",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Manali / Shimla",
        description: "Meet the host, kit check, early night.",
      },
      {
        day: 2,
        title: "The climb begins",
        description: "Acclimatisation halt. Slow is the point.",
      },
      { day: 3, title: "Into Spiti", description: "High roads, first monastery, village stay." },
      { day: 4, title: "Kaza", description: "Market, river, an afternoon that isn't scheduled." },
      { day: 5, title: "Key & beyond", description: "Key Monastery at dusk if the light holds." },
      {
        day: 6,
        title: "Chandratal window",
        description: "If the pass is open. If not, a quieter lake.",
      },
      { day: 7, title: "High villages", description: "Homestay, kitchen stories, stars." },
      { day: 8, title: "Buffer day", description: "Weather, rest, or a walk we didn't plan." },
      { day: 9, title: "The road out", description: "Long transfer, last photographs." },
      { day: 10, title: "Depart", description: "Drop at the start town. WhatsApp stays open." },
    ],
    travel_info: "Typically starts from Manali or Shimla depending on the season and the pass.",
    notes: "Altitude is real. We move slower than a tourist bus on purpose.",
    cta_label: null,
    booking_url: null,
    hero_image_url: null,
    sort_order: 1,
  },
  {
    id: "default-jibhi",
    slug: "jibhi",
    destination: "Jibhi",
    title: "Jibhi Slow Travel",
    short_description:
      "Wooden houses, misty pine forests, and a small stream that never stops singing.",
    long_description:
      "Five unhurried days in a Himachal hamlet — cafés, pine trails, a waterfall if it has rained, and enough quiet to remember why you left the city.",
    duration: "5 days",
    price: "₹14,999",
    difficulty: "Easy",
    best_season: "Mar — Nov",
    is_available: true,
    highlights: [
      "Riverside wooden stays",
      "Jalori Pass day walk",
      "Village kitchens",
      "No packed itinerary",
    ],
    itinerary: [
      { day: 1, title: "Arrive Jibhi", description: "Wooden stay, stream, welcome walk." },
      {
        day: 2,
        title: "Jalori if the weather holds",
        description: "Pass walk, picnic, slow descent.",
      },
      { day: 3, title: "Village day", description: "Kitchen, river, no packed itinerary." },
      { day: 4, title: "A trail we like", description: "Pine canopy, optional waterfall." },
      { day: 5, title: "Depart", description: "Transfer to Aut / Banjar." },
    ],
    travel_info: "Reach Aut / Banjar; we coordinate the last-mile transfer.",
    notes: null,
    cta_label: null,
    booking_url: null,
    hero_image_url: null,
    sort_order: 2,
  },
  {
    id: "default-valley-of-flowers",
    slug: "valley-of-flowers",
    destination: "Valley of Flowers",
    title: "Valley of Flowers Trek",
    short_description: "An alpine meadow that bursts into colour for only a few weeks a year.",
    long_description:
      "A monsoon trek into the Nanda Devi biosphere — Govindghat to Ghangaria, a full day in the valley, and Hemkund if the group wants the extra climb.",
    duration: "6 days",
    price: "₹18,999",
    difficulty: "Moderate",
    best_season: "Jul — Aug",
    is_available: true,
    highlights: [
      "Peak bloom window",
      "Ghangaria base",
      "Optional Hemkund Sahib",
      "Small group, 6–8",
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
    notes: "Permits and monsoon weather can reshape a day. We plan slack into the itinerary.",
    cta_label: null,
    booking_url: null,
    hero_image_url: null,
    sort_order: 3,
  },
  {
    id: "default-rajasthan",
    slug: "rajasthan",
    destination: "Rajasthan",
    title: "Rajasthan Desert Route",
    short_description:
      "Dunes at dusk, forts at dawn, and the honesty of home-cooked thalis in between.",
    long_description:
      "A week across the desert state — Jaipur as a door, then forts, dunes, and kitchens that still cook for the family first.",
    duration: "7 days",
    price: "₹19,999",
    difficulty: "Easy",
    best_season: "Oct — Mar",
    is_available: true,
    highlights: ["Jaipur start", "Desert camp night", "Living forts", "Home-cooked thalis"],
    itinerary: [
      { day: 1, title: "Jaipur", description: "Meet in the city that started the brand." },
      { day: 2, title: "The road west", description: "Forts, a long lunch, dusk in a new town." },
      { day: 3, title: "Living forts", description: "Not a checklist — one place, properly." },
      { day: 4, title: "Desert camp", description: "Dunes at dusk, a fire, a quieter night." },
      { day: 5, title: "Kitchens", description: "A home-cooked thali and an unhurried morning." },
      {
        day: 6,
        title: "The loop back",
        description: "One last stop we didn't put on the brochure.",
      },
      { day: 7, title: "Depart Jaipur", description: "Trains and flights we can advise." },
    ],
    travel_info: "Trip starts in Jaipur. We can advise trains and flights.",
    notes: null,
    cta_label: null,
    booking_url: null,
    hero_image_url: null,
    sort_order: 4,
  },
  {
    id: "default-rishikesh",
    slug: "rishikesh",
    destination: "Rishikesh",
    title: "Rishikesh River & Ridge",
    short_description:
      "The Ganges at first light, mountain trails at noon, and prayer flags in every breath.",
    long_description:
      "A long weekend on the Ganges — aarti, an optional raft day, a ridge walk, and enough café time to pretend you might stay.",
    duration: "4 days",
    price: "₹9,999",
    difficulty: "Easy",
    best_season: "Year-round",
    is_available: true,
    highlights: ["Ganga aarti", "Optional rafting", "Ridge trail", "Café culture, not a checklist"],
    itinerary: [],
    travel_info: "Reach Rishikesh by train (Haridwar / Yog Nagari) or road from Delhi.",
    notes: null,
    cta_label: null,
    booking_url: null,
    hero_image_url: null,
    sort_order: 5,
  },
];

/** CMS trips if any are published; otherwise the built-in catalogue. */
export function resolveJourneys(cms: JourneyRecord[]): JourneyRecord[] {
  return cms.length > 0 ? cms : DEFAULT_JOURNEYS;
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
