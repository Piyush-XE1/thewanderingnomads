import { Link } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { TripCard } from "@/components/site/TripCard";
import { DestinationCard } from "@/components/site/DestinationCard";
import { HelpDeciding } from "@/components/site/HelpDeciding";
import { useContent } from "@/lib/cms/useContent";
import {
  collectDestinations,
  getDestination,
  journeysForDestination,
  startingPriceOf,
  type Region,
} from "@/lib/destinations";
import { resolveJourneys, waLink } from "@/lib/trips";

import heroImg from "@/assets/hero-himalaya.jpg";

export function DestinationPage({ slug, region }: { slug: string; region: Region }) {
  const { journeys: cmsJourneys, batches, batchHosts, hosts } = useContent();
  const journeys = resolveJourneys(cmsJourneys);
  const dest = getDestination(slug);
  const trips = dest ? journeysForDestination(dest, journeys) : [];
  const { label: starting } = startingPriceOf(trips);
  const siblings = collectDestinations(journeys, region, { includeEmpty: true })
    .filter((d) => d.slug !== slug)
    .slice(0, 3);

  if (!dest || dest.region !== region) {
    const listTo = region === "international" ? "/international-trips" : "/india-trips";
    return (
      <SiteLayout>
        <main className="pt-40 pb-32">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <p className="eyebrow">404</p>
            <h1 className="display mt-4 text-5xl">Off the trail.</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              We don't have that destination yet — or it lives under another name.
            </p>
            <Link
              to={listTo as "/india-trips" | "/international-trips"}
              className="mt-10 inline-flex items-center rounded-full bg-ink px-6 py-3 text-[13px] font-medium text-snow"
            >
              Browse destinations
            </Link>
          </div>
        </main>
      </SiteLayout>
    );
  }

  const listTo = dest.region === "international" ? "/international-trips" : "/india-trips";
  const listLabel = dest.region === "international" ? "International" : "India";
  const cover = dest.image ?? heroImg;
  const enquire = waLink(
    `Hi The Wandering Nomads! I'm interested in a ${dest.name} trip. Could you share dates and the next steps?`,
  );

  return (
    <SiteLayout>
      <main>
        <section className="relative overflow-hidden bg-ink pt-32 pb-20 sm:pt-40 sm:pb-28">
          <img
            src={cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/25" />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-white/60">
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
                <span>/</span>
                <Link to={listTo} className="hover:text-white">
                  {listLabel}
                </Link>
                <span>/</span>
                <span className="text-white">{dest.name}</span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="eyebrow mt-8 text-white/65">{dest.tag}</p>
              <h1 className="display mt-3 max-w-3xl text-5xl leading-[0.95] text-white sm:text-6xl md:text-7xl">
                {dest.name}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/80">
                {dest.blurb}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={enquire}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-white px-6 py-3 text-[13.5px] font-medium text-ink"
                >
                  Enquire on WhatsApp
                </a>
                {starting ? (
                  <span className="rounded-full border border-white/20 px-4 py-2 text-[12px] uppercase tracking-[0.16em] text-white/80">
                    From {starting}
                  </span>
                ) : (
                  <span className="rounded-full border border-white/20 px-4 py-2 text-[12px] uppercase tracking-[0.16em] text-white/80">
                    Custom · on request
                  </span>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-6">
            {(dest.overview || (dest.places && dest.places.length > 0)) && (
              <div className="mb-16 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                <Reveal>
                  <p className="eyebrow">About {dest.name}</p>
                  <h2 className="display mt-4 text-4xl sm:text-5xl">
                    {dest.region === "international"
                      ? "Tour packages from India"
                      : "Community trips"}
                  </h2>
                  <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-muted-foreground">
                    {dest.overview ?? dest.blurb}
                  </p>
                </Reveal>
                {dest.places && dest.places.length > 0 ? (
                  <Reveal delay={0.08}>
                    <div className="rounded-[24px] bg-card p-6 hairline">
                      <p className="eyebrow">Places we cover</p>
                      <ul className="mt-4 space-y-2.5 text-[14.5px] text-ink/85">
                        {dest.places.map((place) => (
                          <li key={place} className="flex gap-2.5">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                            {place}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ) : null}
              </div>
            )}

            {trips.length > 0 ? (
              <>
                <Reveal>
                  <p className="eyebrow">Popular packages</p>
                  <h2 className="display mt-4 text-4xl sm:text-5xl">Trips in {dest.name}.</h2>
                </Reveal>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {trips.map((trip, i) => (
                    <Reveal key={trip.id} delay={i * 0.06}>
                      <TripCard
                        trip={trip}
                        batches={batches}
                        batchHosts={batchHosts}
                        hosts={hosts}
                      />
                    </Reveal>
                  ))}
                </div>
              </>
            ) : (
              <Reveal>
                <div className="max-w-2xl">
                  <p className="eyebrow">Custom departure</p>
                  <h2 className="display mt-4 text-4xl sm:text-5xl">
                    We'll build this one around you.
                  </h2>
                  <p className="mt-5 text-[15.5px] leading-relaxed text-muted-foreground">
                    No fixed batch is on the calendar yet. Tell us your dates, group size and pace —
                    we host private and small-group {dest.name} journeys the same way we host
                    everything else.
                  </p>
                  <a
                    href={enquire}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center rounded-full bg-ink px-6 py-3 text-[13px] font-medium text-snow"
                  >
                    Plan this trip
                  </a>
                </div>
              </Reveal>
            )}

            <div className="mt-16">
              <HelpDeciding
                message={`Hi The Wandering Nomads! I'd like help planning a ${dest.name} trip.`}
              />
            </div>

            {siblings.length > 0 ? (
              <div className="mt-24">
                <Reveal>
                  <p className="eyebrow">Also on the map</p>
                  <h2 className="display mt-4 text-3xl sm:text-4xl">More destinations.</h2>
                </Reveal>
                <div className="mt-10 grid gap-5 sm:grid-cols-3">
                  {siblings.map((d) => (
                    <DestinationCard key={d.slug} dest={d} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
