import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { TripCard } from "@/components/site/TripCard";
import { HelpDeciding } from "@/components/site/HelpDeciding";
import { useContent } from "@/lib/cms/useContent";
import {
  batchesForTrip,
  findJourney,
  formatBatchDates,
  hostsForBatch,
  resolveBatches,
  resolveJourneys,
  tripEnquiryMessage,
  upcomingBatch,
  waLink,
} from "@/lib/trips";
import {
  DEFAULT_EXCLUDES,
  DEFAULT_INCLUDES,
  destinationForJourney,
  imagesForJourney,
} from "@/lib/destinations";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";

export const Route = createFileRoute("/trip/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${titleFromSlug(params.slug)} — The Wandering Nomads` },
      {
        name: "description",
        content: `Small-group ${titleFromSlug(params.slug)} by The Wandering Nomads. Itinerary, batches, and booking on WhatsApp.`,
      },
    ],
  }),
  component: TripDetailPage,
});

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function TripDetailPage() {
  const { slug } = Route.useParams();
  const content = useContent();
  const journeys = resolveJourneys(content.journeys);
  const batches = resolveBatches(content.batches, journeys);
  const { batchHosts, hosts, gallery, journeyImages } = content;
  const trip = findJourney(content.journeys, slug);

  useEffect(() => {
    if (trip) document.title = `${trip.title} — The Wandering Nomads`;
  }, [trip]);

  if (!trip) {
    return (
      <SiteLayout>
        <main className="pt-40 pb-32">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <p className="eyebrow">404</p>
            <h1 className="display mt-4 text-5xl">Off the trail.</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              We couldn't find that trip. It may have moved or not be published yet.
            </p>
            <Link
              to="/upcoming-trips"
              className="mt-10 inline-flex items-center rounded-full bg-ink px-6 py-3 text-[13px] font-medium text-snow"
            >
              See upcoming trips
            </Link>
          </div>
        </main>
      </SiteLayout>
    );
  }

  const tripBatches = batchesForTrip(batches, trip.id);
  const next = upcomingBatch(tripBatches);
  const dest = destinationForJourney(trip);
  const photos = imagesForJourney(trip, journeyImages, gallery);
  const related = journeys
    .filter((j) => j.id !== trip.id)
    .sort((a, b) => {
      const aHit = destinationForJourney(a)?.slug === dest?.slug ? 0 : 1;
      const bHit = destinationForJourney(b)?.slug === dest?.slug ? 0 : 1;
      return aHit - bHit;
    })
    .slice(0, 3);
  const includes = trip.highlights.length > 0 ? trip.highlights : DEFAULT_INCLUDES;
  const book = waLink(tripEnquiryMessage(trip, next));

  return (
    <SiteLayout hideWhatsApp>
      <main className="pt-32 pb-28 sm:pt-36 sm:pb-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-muted-foreground">
              <Link to="/" className="hover:text-ink">
                Home
              </Link>
              <span>/</span>
              <Link to="/upcoming-trips" className="hover:text-ink">
                Trips
              </Link>
              {dest ? (
                <>
                  <span>/</span>
                  <Link
                    to={
                      dest.region === "international"
                        ? "/international-trips/$slug"
                        : "/india-trips/$slug"
                    }
                    params={{ slug: dest.slug }}
                    className="hover:text-ink"
                  >
                    {dest.name}
                  </Link>
                </>
              ) : null}
              <span>/</span>
              <span className="text-ink">{trip.title}</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="display mt-8 max-w-4xl text-5xl leading-[1.02] sm:text-6xl md:text-7xl">
              {trip.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-2.5 text-[12px]">
              {dest ? (
                <Link
                  to={
                    dest.region === "international"
                      ? "/international-trips/$slug"
                      : "/india-trips/$slug"
                  }
                  params={{ slug: dest.slug }}
                  className="rounded-full bg-ink/5 px-3 py-1.5 uppercase tracking-[0.14em] text-ink hover:bg-ink/10"
                >
                  {dest.name}
                </Link>
              ) : (
                <span className="rounded-full bg-ink/5 px-3 py-1.5 uppercase tracking-[0.14em] text-ink">
                  {trip.destination}
                </span>
              )}
              {trip.duration ? <MetaChip>{trip.duration}</MetaChip> : null}
              {trip.difficulty ? <MetaChip>{trip.difficulty}</MetaChip> : null}
              {trip.best_season ? <MetaChip>{trip.best_season}</MetaChip> : null}
              <MetaChip>Group</MetaChip>
            </div>
          </Reveal>

          <Gallery photos={photos} title={trip.title} />

          <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div>
              <Itinerary value={trip.itinerary} />

              <section className="mt-16 grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="eyebrow">Includes</p>
                  <ul className="mt-4 space-y-2.5 text-[14.5px] text-ink/85">
                    {includes.map((h) => (
                      <li key={h} className="flex gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="eyebrow">Excludes</p>
                  <ul className="mt-4 space-y-2.5 text-[14.5px] text-muted-foreground">
                    {DEFAULT_EXCLUDES.map((h) => (
                      <li key={h} className="flex gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/25" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {tripBatches.length > 0 ? (
                <section className="mt-16">
                  <p className="eyebrow">Available batches</p>
                  <h2 className="display mt-4 text-4xl sm:text-5xl">Pick your departure.</h2>
                  <div className="mt-8 divide-y divide-ink/8 rounded-[24px] bg-card hairline">
                    {tripBatches.map((batch) => {
                      const assigned = hostsForBatch(batch.id, batchHosts, hosts);
                      const lead = assigned.find((h) => h.role === "lead")?.host;
                      return (
                        <div key={batch.id} className="flex flex-wrap items-center gap-4 px-6 py-5">
                          <div className="min-w-0 flex-1">
                            <p className="display text-xl text-ink">{formatBatchDates(batch)}</p>
                            <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                              {[
                                batch.batch_type ?? "Community",
                                trip.duration,
                                lead ? `Hosted by ${lead.name}` : null,
                                batch.seats_remaining != null
                                  ? `${batch.seats_remaining} seats left`
                                  : null,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          </div>
                          <a
                            href={waLink(tripEnquiryMessage(trip, batch))}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-snow transition hover:opacity-90"
                          >
                            Enquire
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              <section className="mt-16">
                <p className="eyebrow">About the trip</p>
                <h2 className="display mt-4 text-4xl sm:text-5xl">What you're signing up for.</h2>
                <RichText
                  html={trip.long_description ?? trip.short_description}
                  className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted-foreground"
                />
              </section>

              <Hosts
                batchIds={tripBatches.map((b) => b.id)}
                batchHosts={batchHosts}
                hosts={hosts}
              />

              {trip.travel_info ? (
                <section className="mt-16">
                  <p className="eyebrow">Travel information</p>
                  <RichText
                    html={trip.travel_info}
                    className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground"
                  />
                </section>
              ) : null}
              {trip.notes ? (
                <section className="mt-12">
                  <p className="eyebrow">Important notes</p>
                  <RichText
                    html={trip.notes}
                    className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground"
                  />
                </section>
              ) : null}
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-[28px] bg-card p-6 hairline">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {trip.duration ? `${trip.duration} package` : "Community trip"}
                </p>
                {trip.price ? <p className="display mt-2 text-4xl text-ink">{trip.price}</p> : null}
                <dl className="mt-5 space-y-2 text-[13px] text-ink/80">
                  {next ? (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Next</dt>
                      <dd>{formatBatchDates(next)}</dd>
                    </div>
                  ) : (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Dates</dt>
                      <dd>On request</dd>
                    </div>
                  )}
                  {trip.difficulty ? (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Level</dt>
                      <dd>{trip.difficulty}</dd>
                    </div>
                  ) : null}
                  {dest ? (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Destination</dt>
                      <dd>
                        <Link
                          to={
                            dest.region === "international"
                              ? "/international-trips/$slug"
                              : "/india-trips/$slug"
                          }
                          params={{ slug: dest.slug }}
                          className="underline-offset-2 hover:underline"
                        >
                          {dest.name}
                        </Link>
                      </dd>
                    </div>
                  ) : null}
                </dl>
                <a
                  href={book}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-ink px-6 py-4 text-[15px] font-semibold text-snow shadow-lift transition hover:opacity-90 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                >
                  <WhatsAppIcon className="h-4.5 w-4.5 shrink-0" />
                  Book now — WhatsApp
                </a>
                {trip.booking_url ? (
                  <a
                    href={trip.booking_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2.5 flex w-full items-center justify-center rounded-full border border-ink/15 px-5 py-3 text-[13px] font-medium text-ink transition hover:bg-ink/5"
                  >
                    {trip.cta_label ?? "More details"}
                  </a>
                ) : null}
                <p className="mt-4 text-center text-[12px] text-muted-foreground">
                  {next?.seats_remaining != null
                    ? `Only ${next.seats_remaining} seats left on ${formatBatchDates(next)}.`
                    : "A real person. Same day."}
                </p>
              </div>
            </aside>
          </div>

          {related.length > 0 ? (
            <section className="mt-24">
              <p className="eyebrow">Also departing</p>
              <h2 className="display mt-4 text-4xl sm:text-5xl">More trips.</h2>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((t) => (
                  <TripCard
                    key={t.id}
                    trip={t}
                    batches={batches}
                    batchHosts={batchHosts}
                    hosts={hosts}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <div className="mt-16">
            <HelpDeciding
              message={`Hi The Wandering Nomads! I have a question about the ${trip.title}.`}
            />
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-[64] border-t border-ink/10 bg-background/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="min-w-0">
            {trip.price ? <p className="display text-xl text-ink">{trip.price}</p> : null}
            <p className="truncate text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {next ? formatBatchDates(next) : (trip.duration ?? "Enquire")}
            </p>
          </div>
          <a
            href={book}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-7 py-3 text-[14.5px] font-semibold text-snow shadow-lift transition hover:opacity-90 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0" />
            Book now
          </a>
        </div>
      </div>
    </SiteLayout>
  );
}

function Gallery({ photos, title }: { photos: { url: string; alt: string }[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = photos[active] ?? photos[0];
  if (!current) return null;

  return (
    <Reveal delay={0.1}>
      <div className="mt-10">
        <div className="overflow-hidden rounded-[28px] hairline">
          <img
            src={current.url}
            alt={current.alt || title}
            width={1920}
            height={1080}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
        {photos.length > 1 ? (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {photos.map((p, i) => (
              <button
                key={p.url}
                type="button"
                onClick={() => setActive(i)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl ${
                  i === active ? "ring-2 ring-ink" : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`Photo ${i + 1}`}
              >
                <img src={p.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}

function MetaChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-ink/10 px-3 py-1.5 uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </span>
  );
}

type ItineraryDay = {
  day?: number | string;
  title?: string;
  description?: string;
  items?: string[];
};

function Itinerary({ value }: { value: unknown }) {
  if (!Array.isArray(value) || value.length === 0) return null;
  const days = value.filter((d): d is ItineraryDay => typeof d === "object" && d !== null);
  if (days.length === 0) return null;

  return (
    <section>
      <p className="eyebrow">Tour itinerary</p>
      <h2 className="display mt-4 text-4xl sm:text-5xl">Day by day.</h2>
      <ol className="mt-8 space-y-6">
        {days.map((d, i) => {
          const label = d.day != null ? `Day ${d.day}` : `Day ${i + 1}`;
          return (
            <li key={i} className="grid grid-cols-[auto_1fr] gap-5 border-t border-ink/8 pt-6">
              <span className="display text-2xl text-ink/40">{label}</span>
              <div>
                {d.title ? <h3 className="display text-2xl text-ink">{d.title}</h3> : null}
                {d.description ? (
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                    {d.description}
                  </p>
                ) : null}
                {Array.isArray(d.items) && d.items.length > 0 ? (
                  <ul className="mt-3 space-y-1.5 text-[14.5px] text-muted-foreground">
                    {d.items.map((item, j) => (
                      <li key={j} className="flex gap-2.5">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink/30" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Hosts({
  batchIds,
  batchHosts,
  hosts,
}: {
  batchIds: string[];
  batchHosts: ReturnType<typeof useContent>["batchHosts"];
  hosts: ReturnType<typeof useContent>["hosts"];
}) {
  const assigned = batchIds.flatMap((id) => hostsForBatch(id, batchHosts, hosts));
  const unique = Array.from(new Map(assigned.map((a) => [a.host.id, a.host])).values());
  if (unique.length === 0) return null;

  return (
    <section className="mt-16">
      <p className="eyebrow">Your hosts</p>
      <h2 className="display mt-4 text-4xl sm:text-5xl">People you'll actually like.</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {unique.map((host) => (
          <div
            key={host.id}
            className="flex items-center gap-4 rounded-[24px] bg-card p-5 hairline"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink/8">
              {host.photo_url ? (
                <img src={host.photo_url} alt={host.name} className="h-full w-full object-cover" />
              ) : (
                <span className="display text-xl text-ink/60">{host.name.charAt(0)}</span>
              )}
            </span>
            <div className="min-w-0">
              <p className="display text-lg text-ink">{host.name}</p>
              <p className="truncate text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                {host.home_location ?? "Trip host"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
