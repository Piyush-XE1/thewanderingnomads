import { Link } from "@tanstack/react-router";

import type { DestinationView } from "@/lib/destinations";

export function DestinationCard({ dest }: { dest: DestinationView }) {
  const price = dest.startingPrice;
  const tripCount = dest.trips.length;
  const to = dest.region === "international" ? "/international-trips/$slug" : "/india-trips/$slug";

  return (
    <Link
      to={to}
      params={{ slug: dest.slug }}
      className="group lift relative flex aspect-[4/5] flex-col overflow-hidden rounded-[28px] bg-ink text-white hairline"
    >
      {dest.image ? (
        <img
          src={dest.image}
          alt={dest.name}
          className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.06]"
          loading="lazy"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 20% 0%, color-mix(in oklab, var(--forest) 55%, black) 0%, #141c24 70%)",
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/20" />

      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full glass-dark px-3 py-1 text-[10.5px] uppercase tracking-[0.18em] text-white">
            {dest.tag}
          </span>
          {tripCount > 0 ? (
            <span className="rounded-full glass-dark px-3 py-1 text-[10.5px] uppercase tracking-[0.18em] text-white/85">
              {tripCount} {tripCount === 1 ? "trip" : "trips"}
            </span>
          ) : null}
        </div>

        <div>
          <h3 className="display text-3xl leading-[0.95] text-white sm:text-[34px]">{dest.name}</h3>
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/75">
            {dest.blurb}
          </p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/55">
                {price
                  ? "Starting from"
                  : dest.region === "international"
                    ? "Custom"
                    : "On request"}
              </p>
              <p className="display mt-1 text-2xl">{price ?? "Enquire"}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-white/90">
              Details
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
