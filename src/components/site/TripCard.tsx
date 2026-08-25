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
 * Commercial trip card — the product unit of the site.
 * Mirrors the reference listing: photo, group type, next date, duration, price.
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

  const img = coverForJourney(trip);

  return (
    <Link
      to="/trip/$slug"
      params={{ slug: trip.slug }}
      className="group lift relative flex h-full flex-col overflow-hidden rounded-[28px] bg-card hairline"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={img}
          alt={`${trip.title} — ${trip.destination}`}
          loading="lazy"
          width={1400}
          height={1050}
          className="h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full glass-dark px-3 py-1 text-[10.5px] uppercase tracking-[0.18em] text-white">
            Group
          </span>
          {trip.is_available ? null : (
            <span className="rounded-full glass-dark px-3 py-1 text-[10.5px] uppercase tracking-[0.18em] text-white">
              Waitlist
            </span>
          )}
        </div>
        {trip.duration ? (
          <span className="absolute right-4 top-4 rounded-full glass-dark px-3 py-1 text-[10.5px] uppercase tracking-[0.18em] text-white">
            {trip.duration}
          </span>
        ) : null}

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">
            {trip.destination}
          </p>
          <h3 className="display mt-1 text-3xl leading-[0.95] text-white">{trip.title}</h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <dl className="grid grid-cols-2 gap-3 text-[12px]">
          <div>
            <dt className="uppercase tracking-[0.16em] text-muted-foreground">Next departure</dt>
            <dd className="mt-1 text-ink">
              {batch ? formatBatchDates(batch) : "Dates on request"}
              {extraDates > 0 ? (
                <span className="text-muted-foreground"> (+{extraDates})</span>
              ) : null}
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.16em] text-muted-foreground">Seats</dt>
            <dd className="mt-1 text-ink">
              {batch?.seats_remaining != null ? `${batch.seats_remaining} left` : "Ask us"}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-ink/8 pt-4 mt-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {trip.duration
                ? `${trip.duration} package`
                : lead
                  ? `Hosted by ${lead.name}`
                  : "Hosted departure"}
            </p>
            {trip.price ? <p className="display mt-1 text-2xl text-ink">{trip.price}</p> : null}
          </div>
          <span className="inline-flex items-center gap-1 text-[13px] font-medium text-ink">
            Details
            <span aria-hidden className="transition group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
