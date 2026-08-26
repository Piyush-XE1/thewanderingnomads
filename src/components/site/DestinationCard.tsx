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
      className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-xl bg-ink text-white"
    >
      {dest.image ? (
        <img
          src={dest.image}
          alt={dest.name}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
          loading="lazy"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.33 0.06 155) 0%, oklch(0.22 0.04 260) 100%)",
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/10" />

      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-md bg-white/20 backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white font-medium">
            {dest.tag}
          </span>
          {tripCount > 0 ? (
            <span className="rounded-md bg-white/20 backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/90">
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
              Explore
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
