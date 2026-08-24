import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { DestinationCard } from "@/components/site/DestinationCard";
import { HelpDeciding } from "@/components/site/HelpDeciding";
import { useContent } from "@/lib/cms/useContent";
import { collectDestinations, type DestinationCategory } from "@/lib/destinations";
import { resolveJourneys } from "@/lib/trips";

import heroImg from "@/assets/hero-himalaya.jpg";

export const Route = createFileRoute("/india-trips/")({
  head: () => ({
    meta: [
      { title: "India Trips — The Wandering Nomads" },
      {
        name: "description",
        content:
          "Domestic community trips across Kashmir, Spiti, Himachal, Rajasthan, Rishikesh and more. Small groups, confirmed dates, hosted departures.",
      },
      { property: "og:title", content: "India Trips — The Wandering Nomads" },
      { property: "og:url", content: "/india-trips" },
    ],
    links: [{ rel: "canonical", href: "/india-trips" }],
  }),
  component: IndiaTripsPage,
});

const FILTERS: { id: "all" | DestinationCategory; label: string }[] = [
  { id: "all", label: "All destinations" },
  { id: "mountains", label: "Mountains & valleys" },
  { id: "adventure", label: "Adventure & trekking" },
  { id: "spiritual", label: "Spiritual" },
  { id: "culture", label: "Culture" },
];

function IndiaTripsPage() {
  const { journeys: cmsJourneys } = useContent();
  const all = collectDestinations(resolveJourneys(cmsJourneys), "india", { includeEmpty: true });
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const dests = useMemo(
    () => (filter === "all" ? all : all.filter((d) => d.categories?.includes(filter))),
    [all, filter],
  );

  return (
    <SiteLayout>
      <main>
        <section className="relative overflow-hidden bg-ink pt-32 pb-20 sm:pt-40 sm:pb-28">
          <img
            src={heroImg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <p className="eyebrow text-white/65">Domestic getaways</p>
              <h1 className="display mt-4 max-w-3xl text-5xl leading-[0.95] text-white sm:text-6xl md:text-7xl">
                India trips
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-white/75">
                Kashmir to Spiti, desert routes to river towns. Community batches and custom
                itineraries — pick a destination, we'll take the rest.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <p className="eyebrow">Overview</p>
              <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-muted-foreground">
                India is not one trip. Mountains, deserts, rivers, and temple towns — we host the
                routes we have actually walked, in groups small enough that the place still feels
                like the place.
              </p>
            </Reveal>

            <div className="mt-10 flex flex-wrap gap-2">
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
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {dests.map((dest, i) => (
                <Reveal key={dest.slug} delay={i * 0.05}>
                  <DestinationCard dest={dest} />
                </Reveal>
              ))}
            </div>

            <div className="mt-16">
              <HelpDeciding message="Hi The Wandering Nomads! I'd like help picking an India trip." />
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
