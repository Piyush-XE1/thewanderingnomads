import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { TripCard } from "@/components/site/TripCard";
import { HelpDeciding } from "@/components/site/HelpDeciding";
import { useContent } from "@/lib/cms/useContent";
import { destinationForJourney } from "@/lib/destinations";
import { batchesForTrip, parsePrice, resolveJourneys, upcomingBatch, waLink } from "@/lib/trips";

export const Route = createFileRoute("/upcoming-trips")({
  head: () => ({
    meta: [
      { title: "Upcoming Trips — The Wandering Nomads" },
      {
        name: "description",
        content:
          "Reserve your seat on the next departures — small-group community trips across India and beyond with confirmed dates.",
      },
      { property: "og:title", content: "Upcoming Trips — The Wandering Nomads" },
      {
        property: "og:description",
        content: "Small-group expeditions with confirmed dates across India and beyond.",
      },
      { property: "og:url", content: "/upcoming-trips" },
    ],
    links: [{ rel: "canonical", href: "/upcoming-trips" }],
  }),
  component: UpcomingTripsPage,
});

type Filter = "all" | "dates" | "available" | "under20" | "20to50" | "over50";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All trips" },
  { id: "dates", label: "Upcoming dates" },
  { id: "available", label: "Available now" },
  { id: "under20", label: "Under ₹20K" },
  { id: "20to50", label: "₹20K – ₹50K" },
  { id: "over50", label: "₹50K+" },
];

function UpcomingTripsPage() {
  const { journeys: cmsJourneys, batches, batchHosts, hosts } = useContent();
  const journeys = resolveJourneys(cmsJourneys);
  const [filter, setFilter] = useState<Filter>("all");
  const [dest, setDest] = useState("all");
  const [query, setQuery] = useState("");

  const destinations = useMemo(() => {
    const names = new Set<string>();
    for (const trip of journeys) {
      names.add(destinationForJourney(trip)?.name ?? trip.destination);
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [journeys]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return journeys.filter((trip) => {
      if (filter === "available" && !trip.is_available) return false;
      if (filter === "dates" && !upcomingBatch(batchesForTrip(batches, trip.id))) return false;
      const value = parsePrice(trip.price);
      if (filter === "under20" && !(value != null && value < 20000)) return false;
      if (filter === "20to50" && !(value != null && value >= 20000 && value <= 50000)) return false;
      if (filter === "over50" && !(value != null && value > 50000)) return false;
      const destName = destinationForJourney(trip)?.name ?? trip.destination;
      if (dest !== "all" && destName !== dest) return false;
      if (term && !`${trip.title} ${trip.destination}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [journeys, batches, filter, dest, query]);

  return (
    <SiteLayout>
      <main className="pt-40 pb-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="eyebrow">Upcoming Trips</p>
            <h1 className="display mt-4 max-w-3xl text-5xl leading-[1.02] sm:text-6xl md:text-7xl">
              Reserve your seat on
              <br />
              <em className="italic text-muted-foreground">the next departure.</em>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-muted-foreground">
              Small groups, real places, hosted departures. Confirmed dates and limited spots — pick
              a trip and we'll take it from there.
            </p>
          </Reveal>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
                  filter === f.id
                    ? "bg-ink text-snow"
                    : "hairline text-muted-foreground hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search trips…"
              className="ml-auto w-full max-w-xs rounded-full border border-ink/12 bg-card px-5 py-2 text-[13.5px] outline-none transition focus:border-ink/30"
            />
          </div>

          {destinations.length > 1 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip active={dest === "all"} onClick={() => setDest("all")}>
                All destinations
              </Chip>
              {destinations.map((name) => (
                <Chip key={name} active={dest === name} onClick={() => setDest(name)}>
                  {name}
                </Chip>
              ))}
            </div>
          ) : null}

          {visible.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((trip, i) => (
                <Reveal key={trip.id} delay={i * 0.06}>
                  <TripCard trip={trip} batches={batches} batchHosts={batchHosts} hosts={hosts} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-16 rounded-[28px] border border-dashed border-border p-14 text-center">
              <p className="display text-2xl text-ink">No trips match.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different filter, or ask us what's next.
              </p>
              <a
                href={waLink(
                  "Hi The Wandering Nomads! I'd like to know about your upcoming trips.",
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center rounded-full bg-ink px-6 py-3 text-[13px] font-medium text-snow"
              >
                Chat on WhatsApp
              </a>
            </div>
          )}

          <div className="mt-20 grid gap-8 md:grid-cols-3">
            {[
              {
                t: "Solo-friendly",
                d: "Most travellers join alone. Shared rooms if you want them, a host who makes space.",
              },
              {
                t: "Confirmed dates",
                d: "If it's on this page, the batch is real. When it fills, it fills.",
              },
              {
                t: "Hosted, not herded",
                d: "A named trip captain on every departure — someone who has walked the route.",
              },
            ].map((item) => (
              <div key={item.t} className="rounded-[24px] bg-card p-6 hairline">
                <h3 className="display text-2xl text-ink">{item.t}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{item.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <HelpDeciding />
          </div>
        </div>
      </main>
    </SiteLayout>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition ${
        active ? "bg-ink/90 text-snow" : "bg-ink/5 text-ink/70 hover:bg-ink/10"
      }`}
    >
      {children}
    </button>
  );
}
