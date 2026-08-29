import { Link } from "@tanstack/react-router";

import type {
  HostRecord,
  JourneyRecord,
  TripBatchHostRecord,
  TripBatchRecord,
} from "@/lib/cms/types";
import { batchesForTrip, formatBatchDates, hostsForBatch, upcomingBatch } from "@/lib/trips";
import { coverForJourney } from "@/lib/destinations";

/**
 * Premium travel-product card — the product unit of the site.
 * Clean white surface, large image, restrained typography.
 */
export function TripCard({
  trip,
  batches = [],
  batchHosts = [],
  hosts = [],
}: {
  trip: JourneyRecord;
  batches?: TripBatchRecord[];
  batchHosts?: TripBatchHostRecord[];
  hosts?: HostRecord[];
}) {
  const tripBatches = batchesForTrip(batches, trip.id);
  const batch = upcomingBatch(tripBatches);
  const lead = batch
    ? hostsForBatch(batch.id, batchHosts, hosts).find((h) => h.role === "lead")?.host
    : undefined;
  const extraDates = Math.max(
    0,
    tripBatches.filter((b) => b.start_date >= (batch?.start_date ?? "")).length - 1,
  );
  const seats = batch?.seats_remaining ?? null;
  const lowSeats = seats != null && seats > 0 && seats <= 5;

  const img = coverForJourney(trip);

  return (
    <Link
      to="/trip/$slug"
      params={{ slug: trip.slug }}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-card border border-ink/6 shadow-[0_1px_3px_rgba(20,28,36,0.04)] transition-all duration-300 hover:shadow-lift hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={img}
          alt={`${trip.title} — ${trip.destination}`}
          loading="lazy"
          width={1400}
          height={1050}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        {/* Subtle gradient only at bottom for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-medium text-forest">
            Group
          </span>
          {trip.is_available ? null : (
            <span className="rounded-md bg-amber-100/90 backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-medium text-amber-800">
              Waitlist
            </span>
          )}
          {lowSeats ? (
            <span className="rounded-md bg-rose-600/95 backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] font-semibold text-white">
              Only {seats} left
            </span>
          ) : null}
        </div>
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-white/90 backdrop-blur-sm px-2 py-1 text-[10.5px] font-semibold text-ink/80">
            <svg viewBox="0 0 20 20" className="h-3 w-3 fill-sunrise" aria-hidden>
              <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
            </svg>
            4.9
          </span>
          {trip.duration ? (
            <span className="rounded-md bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-medium text-ink/70">
              {trip.duration}
            </span>
          ) : null}
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/75 font-medium">
            {trip.destination}
          </p>
          <h3 className="display mt-1 text-2xl leading-[0.95] text-white sm:text-[26px]">
            {trip.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <dl className="grid grid-cols-2 gap-3 text-[12px]">
          <div>
            <dt className="uppercase tracking-[0.14em] text-muted-foreground text-[10.5px]">
              Next departure
            </dt>
            <dd className="mt-1 text-ink/85 font-medium">
              {batch ? formatBatchDates(batch) : "On request"}
              {extraDates > 0 ? (
                <span className="text-muted-foreground"> (+{extraDates})</span>
              ) : null}
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.14em] text-muted-foreground text-[10.5px]">
              Seats
            </dt>
            <dd className={`mt-1 font-medium ${lowSeats ? "text-rose-600" : "text-ink/85"}`}>
              {seats != null ? `${seats} left` : "Ask us"}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-ink/6 pt-4 mt-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {trip.price
                ? "Starting from"
                : trip.duration
                  ? `${trip.duration} package`
                  : lead
                    ? `Hosted by ${lead.name}`
                    : "Hosted departure"}
            </p>
            {trip.price ? (
              <p className="display mt-0.5 text-xl text-forest">{trip.price}</p>
            ) : (
              <p className="mt-0.5 text-[13px] font-medium text-forest">On request</p>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-forest/8 px-3 py-2 text-[12px] font-medium text-forest transition group-hover:bg-forest group-hover:text-white">
            View trip
            <span aria-hidden className="transition group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
