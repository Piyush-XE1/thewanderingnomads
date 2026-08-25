import type { GalleryImageRecord, JourneyImageRecord, JourneyRecord } from "@/lib/cms/types";
import { formatRupees, parsePrice } from "@/lib/trips";

import heroImg from "@/assets/hero-himalaya.jpg";
import jKashmir from "@/assets/journey-kashmir.jpg";
import jSpiti from "@/assets/journey-spiti.jpg";
import jJibhi from "@/assets/journey-jibhi.jpg";
import jVof from "@/assets/journey-vof.jpg";
import jRaj from "@/assets/journey-rajasthan.jpg";
import jRishi from "@/assets/journey-rishikesh.jpg";
import gPines from "@/assets/gallery-pines.jpg";
import gTrail from "@/assets/gallery-trail.jpg";
import gLake from "@/assets/gallery-lake.jpg";

export type Region = "india" | "international";

export type DestinationCategory =
  "mountains" | "adventure" | "spiritual" | "culture" | "island" | "city";

export type Destination = {
  slug: string;
  name: string;
  region: Region;
  tag: string;
  blurb: string;
  overview?: string;
  places?: string[];
  categories?: DestinationCategory[];
  aliases: string[];
  image?: string;
  featured?: boolean;
};

export type DestinationView = Destination & {
  trips: JourneyRecord[];
  startingPrice: string | null;
  startingValue: number | null;
};

export const DESTINATIONS: Destination[] = [
  {
    slug: "kashmir",
    name: "Kashmir",
    region: "india",
    tag: "Most loved",
    blurb: "Houseboats, homestays, and the valley beyond the postcard.",
    overview:
      "Kashmir is a slow valley — Dal Lake at first light, pine ridges above Gulmarg, and kitchens that still cook for the family first. Community batches stay small so the place stays the place.",
    places: ["Dal Lake & houseboats", "Old Srinagar", "Gulmarg meadows", "Village homestays"],
    categories: ["mountains", "culture"],
    aliases: ["kashmir", "srinagar", "gulmarg", "pahalgam", "dal lake"],
    image: jKashmir,
    featured: true,
  },
  {
    slug: "spiti",
    name: "Spiti Valley",
    region: "india",
    tag: "High altitude",
    blurb: "Cold desert monasteries, hanging roads, and star-lit villages.",
    overview:
      "Spiti is a high-altitude desert of hanging roads, Key at dusk, and nights thin enough to see the Milky Way without trying. We move slower than a tourist bus on purpose.",
    places: ["Kaza", "Key Monastery", "Chandratal", "High villages"],
    categories: ["mountains", "adventure"],
    aliases: ["spiti", "kaza", "chandratal", "key monastery"],
    image: jSpiti,
    featured: true,
  },
  {
    slug: "jibhi",
    name: "Jibhi & Himachal",
    region: "india",
    tag: "Slow travel",
    blurb: "Wooden houses, pine canopy, and a stream that never stops.",
    overview:
      "Jibhi and the Tirthan valley are for travellers who want Himachal without the queue. Wooden stays, Jalori if the weather holds, and enough café time to remember why you left the city.",
    places: ["Jibhi village", "Jalori Pass", "Tirthan river", "Banjar"],
    categories: ["mountains"],
    aliases: ["jibhi", "himachal", "jalori", "tirthan", "banjar", "manali", "kasol"],
    image: jJibhi,
    featured: true,
  },
  {
    slug: "valley-of-flowers",
    name: "Valley of Flowers",
    region: "india",
    tag: "Monsoon trek",
    blurb: "An alpine meadow that only opens for a few weeks a year.",
    overview:
      "A monsoon window into the Nanda Devi biosphere — Govindghat to Ghangaria, a full day in the valley, Hemkund if the group wants the extra climb. Permits and weather reshape the day; we plan slack.",
    places: ["Valley of Flowers", "Ghangaria", "Hemkund Sahib", "Govindghat"],
    categories: ["mountains", "adventure", "spiritual"],
    aliases: ["valley of flowers", "valley-of-flowers", "hemkund", "ghangaria"],
    image: jVof,
    featured: true,
  },
  {
    slug: "rishikesh",
    name: "Rishikesh",
    region: "india",
    tag: "River & ridge",
    blurb: "The Ganges at first light, trails by noon, cafés after.",
    overview:
      "A long weekend on the Ganges — aarti, an optional raft day, a ridge walk, and enough café culture to pretend you might stay. Easy to reach from Delhi, easy to repeat.",
    places: ["Triveni Ghat aarti", "River rafting", "Ridge trails", "Laxman Jhula"],
    categories: ["adventure", "spiritual"],
    aliases: ["rishikesh", "haridwar"],
    image: jRishi,
    featured: true,
  },
  {
    slug: "rajasthan",
    name: "Rajasthan",
    region: "india",
    tag: "Desert route",
    blurb: "Forts at dawn, dunes at dusk, thalis in between.",
    overview:
      "A week across the desert state — Jaipur as a door, then forts, dunes, and kitchens that still cook for the family first. Winter light, no rush.",
    places: ["Jaipur", "Living forts", "Desert camp", "Home kitchens"],
    categories: ["culture"],
    aliases: ["rajasthan", "jaipur", "jaisalmer", "jodhpur", "udaipur"],
    image: jRaj,
    featured: true,
  },
  {
    slug: "ladakh",
    name: "Ladakh",
    region: "india",
    tag: "High desert",
    blurb: "Passes, monasteries, and lakes that look invented.",
    overview:
      "Leh, Nubra, Pangong, and the passes in between. We host road and bike-style community batches when the roads open — acclimatisation first, photographs second.",
    places: ["Leh", "Nubra Valley", "Pangong", "High passes"],
    categories: ["mountains", "adventure"],
    aliases: ["ladakh", "leh", "nubra", "pangong", "turtuk"],
    image: heroImg,
    featured: true,
  },
  {
    slug: "uttarakhand",
    name: "Uttarakhand",
    region: "india",
    tag: "Himalayan foothills",
    blurb: "Temple towns, oak forest, and ridgelines above the Ganges.",
    overview:
      "Uttarakhand is more than a weekend hill station. Temple towns, oak forest, and ridgelines we can shape around your dates — Chopta, Auli, or a quieter valley.",
    places: ["Chopta", "Auli", "Temple towns", "Oak forest trails"],
    categories: ["mountains", "spiritual"],
    aliases: ["uttarakhand", "mussoorie", "auli", "chopta"],
    image: gTrail,
    featured: false,
  },
  {
    slug: "meghalaya",
    name: "Meghalaya",
    region: "india",
    tag: "Living root",
    blurb: "Waterfalls, caves, and villages in the clouds.",
    overview:
      "Living-root bridges, Dawki's clear water, and villages in the clouds. Best as a custom or seasonal community batch — tell us the month.",
    places: ["Shillong", "Cherrapunji", "Dawki", "Living root bridges"],
    categories: ["mountains", "adventure"],
    aliases: ["meghalaya", "shillong", "cherrapunji", "dawki"],
    image: gPines,
    featured: false,
  },
  {
    slug: "bhutan",
    name: "Bhutan",
    region: "international",
    tag: "Himalayan kingdom",
    blurb: "Dzongs, high passes, and a road trip through the last kingdom.",
    overview:
      "A hosted road trip through Bhutan — Paro, Thimphu, Punakha, and the passes in between. Permits and pacing handled; you show up ready to walk.",
    places: ["Paro", "Thimphu", "Punakha", "High passes"],
    categories: ["mountains", "culture"],
    aliases: ["bhutan", "thimphu", "paro", "punakha"],
    image: heroImg,
    featured: true,
  },
  {
    slug: "nepal",
    name: "Nepal",
    region: "international",
    tag: "Recommended",
    blurb: "Kathmandu alleys, ridge trails, and the roof of the world nearby.",
    overview:
      "Kathmandu, Pokhara, and the trails that start where the road ends. Community batches and custom treks — tell us how many days you actually have.",
    places: ["Kathmandu", "Pokhara", "Annapurna foothills", "Everest region"],
    categories: ["mountains", "adventure"],
    aliases: ["nepal", "kathmandu", "pokhara", "everest", "annapurna"],
    image: gLake,
    featured: true,
  },
  {
    slug: "thailand",
    name: "Thailand",
    region: "international",
    tag: "Trending",
    blurb: "Islands, night markets, and a backpacking loop from India.",
    overview:
      "A backpacking loop designed from India — islands, night markets, and enough slack to actually swim. Community batches when dates lock; custom anytime.",
    places: ["Bangkok", "Phuket", "Krabi", "Islands"],
    categories: ["island", "city"],
    aliases: ["thailand", "bangkok", "phuket", "chiang mai", "krabi"],
    featured: true,
  },
  {
    slug: "bali",
    name: "Bali",
    region: "international",
    tag: "Island",
    blurb: "Temples, ridgelines, and a few days on the Gili islands.",
    overview:
      "Ubud, the coast, and a few days on the Gilis. We host small groups and private trips — stays with character, not a resort conveyor.",
    places: ["Ubud", "Coast", "Gili Islands", "Temples"],
    categories: ["island"],
    aliases: ["bali", "gili", "ubud", "indonesia"],
    featured: true,
  },
  {
    slug: "vietnam",
    name: "Vietnam",
    region: "international",
    tag: "Most loved",
    blurb: "Motorbikes, street food, and a north-to-south wander.",
    overview:
      "Hanoi to the coast, or a tighter loop around Hoi An. Built for first-timers from India who want street food and scooters more than a shopping stop.",
    places: ["Hanoi", "Hoi An", "Da Nang", "Street food"],
    categories: ["city"],
    aliases: ["vietnam", "hanoi", "saigon", "hoi an", "da nang"],
    featured: true,
  },
  {
    slug: "europe",
    name: "Europe",
    region: "international",
    tag: "Backpacking",
    blurb: "A first-timer's loop across the cities that still surprise Indians.",
    aliases: ["europe", "paris", "amsterdam", "berlin", "prague", "italy"],
    featured: true,
  },
];

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function destinationHref(dest: Pick<Destination, "slug" | "region">): string {
  return dest.region === "international"
    ? `/international-trips/${dest.slug}`
    : `/india-trips/${dest.slug}`;
}

export function getDestination(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}

/**
 * Match a trip to the destination catalogue.
 *
 * Weighting matters: an alias hit on the trip's explicit `destination` field
 * ("Himachal Pradesh" → Himachal) must beat an incidental hit on the title or
 * slug (a Himachal circuit that *visits* Chandratal is not a Spiti trip, even
 * though "chandratal" is also a Spiti alias). Before this, matching ranked by
 * each destination's longest alias only, so the Chandratal–Manali–Kasol trip
 * landed on the Spiti page and its own destination page looked empty.
 */
export function destinationForJourney(journey: JourneyRecord): Destination | undefined {
  const destField = (journey.destination ?? "").toLowerCase();
  const rest = `${journey.slug} ${journey.title}`.toLowerCase();

  const scored = DESTINATIONS.map((dest) => {
    let weight = 0;
    let len = 0;
    for (const alias of dest.aliases) {
      const a = alias.toLowerCase();
      const name = dest.name.toLowerCase();
      let w = 0;
      if (destField && (destField === a || destField === name)) w = 3;
      else if (destField && (destField.includes(a) || a.includes(destField))) w = 2;
      else if (rest.includes(a)) w = 1;
      if (w > 0 && w >= weight) {
        if (w > weight || a.length > len) {
          weight = w;
          len = Math.max(len, a.length);
        }
      }
    }
    return { dest, weight, len };
  })
    .filter((x) => x.weight > 0)
    .sort((a, b) => b.weight - a.weight || b.len - a.len);
  return scored[0]?.dest;
}

export function journeysForDestination(
  dest: Destination,
  journeys: JourneyRecord[],
): JourneyRecord[] {
  return journeys.filter((j) => destinationForJourney(j)?.slug === dest.slug);
}

export function startingPriceOf(trips: JourneyRecord[]): {
  label: string | null;
  value: number | null;
} {
  const values = trips
    .map((t) => parsePrice(t.price))
    .filter((n): n is number => n != null)
    .sort((a, b) => a - b);
  if (values.length === 0) return { label: null, value: null };
  return { label: formatRupees(values[0]), value: values[0] };
}

export function coverForJourney(journey: JourneyRecord): string {
  if (journey.hero_image_url) return journey.hero_image_url;
  return destinationForJourney(journey)?.image ?? heroImg;
}

function toView(dest: Destination, trips: JourneyRecord[]): DestinationView {
  const { label, value } = startingPriceOf(trips);
  return { ...dest, trips, startingPrice: label, startingValue: value };
}

function syntheticFromJourney(journey: JourneyRecord, region: Region): Destination {
  return {
    slug: slugify(journey.destination || journey.slug),
    name: journey.destination || journey.title,
    region,
    tag: journey.best_season ?? "Expedition",
    blurb: journey.short_description ?? "",
    aliases: [journey.destination, journey.slug, journey.title].filter(Boolean) as string[],
    image: journey.hero_image_url ?? undefined,
    featured: false,
  };
}

/**
 * Group published (or fallback) trips under the destination catalogue.
 * Unmatched trips become their own destination so nothing is lost.
 */
export function collectDestinations(
  journeys: JourneyRecord[],
  region: Region,
  opts: { includeEmpty?: boolean } = {},
): DestinationView[] {
  const includeEmpty = opts.includeEmpty ?? true;
  const used = new Set<string>();
  const views: DestinationView[] = [];

  for (const dest of DESTINATIONS.filter((d) => d.region === region)) {
    const trips = journeysForDestination(dest, journeys);
    trips.forEach((t) => used.add(t.id));
    if (trips.length > 0 || (includeEmpty && dest.featured)) {
      views.push(toView(dest, trips));
    }
  }

  for (const journey of journeys) {
    if (used.has(journey.id)) continue;
    const matched = destinationForJourney(journey);
    if (matched) continue;
    // Uncatalogued trips surface on the India listing so nothing is lost.
    if (region !== "india") continue;
    const synth = syntheticFromJourney(journey, region);
    const existing = views.find((v) => v.slug === synth.slug);
    if (existing) {
      existing.trips.push(journey);
      const next = startingPriceOf(existing.trips);
      existing.startingPrice = next.label;
      existing.startingValue = next.value;
    } else {
      views.push(toView(synth, [journey]));
    }
  }

  return views.sort((a, b) => {
    if (a.trips.length !== b.trips.length) return b.trips.length - a.trips.length;
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export function uniqueDestinationNames(journeys: JourneyRecord[]): string[] {
  const names = new Set<string>();
  for (const j of journeys) {
    const dest = destinationForJourney(j);
    names.add(dest?.name ?? j.destination);
  }
  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

export function imagesForJourney(
  trip: JourneyRecord,
  journeyImages: JourneyImageRecord[] = [],
  gallery: GalleryImageRecord[] = [],
): { url: string; alt: string }[] {
  const seen = new Set<string>();
  const out: { url: string; alt: string }[] = [];
  const add = (url?: string | null, alt?: string | null) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    out.push({ url, alt: alt || trip.title });
  };
  add(trip.hero_image_url, trip.title);
  for (const img of [...journeyImages]
    .filter((i) => i.journey_id === trip.id)
    .sort((a, b) => a.sort_order - b.sort_order)) {
    add(img.url, img.alt_text || img.caption);
  }
  for (const img of gallery.filter((g) => g.journey_id === trip.id)) {
    add(img.url, img.alt_text || img.caption);
  }
  if (out.length === 0) add(coverForJourney(trip), `${trip.title} — ${trip.destination}`);
  return out;
}

export const DEFAULT_INCLUDES = [
  "Named trip host on the ground",
  "Stays as listed in the itinerary",
  "Local transfers mentioned in the plan",
  "WhatsApp group before and during the trip",
];

export const DEFAULT_EXCLUDES = [
  "Flights to the meeting point, unless stated",
  "Meals not mentioned in the itinerary",
  "Personal expenses and optional activities",
  "Travel insurance",
];

export function destinationHead(slug: string, region: Region) {
  const dest = getDestination(slug);
  const name = dest?.name ?? "Destination";
  const path = dest
    ? destinationHref(dest)
    : `/${region === "international" ? "international" : "india"}-trips/${slug}`;
  return {
    meta: [
      { title: `${name} trips — The Wandering Nomads` },
      {
        name: "description",
        content: dest?.blurb ?? `Small-group ${name} trips by The Wandering Nomads.`,
      },
      { property: "og:title", content: `${name} trips — The Wandering Nomads` },
      { property: "og:url", content: path },
    ],
    links: [{ rel: "canonical", href: path }],
  };
}
