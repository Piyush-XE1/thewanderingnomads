import { Link } from "@tanstack/react-router";

import { Reveal } from "@/components/site/Reveal";
import { waLink } from "@/lib/site";

export function HelpDeciding({
  message = "Hi The Wandering Nomads! I need help deciding on a trip.",
}: {
  message?: string;
}) {
  return (
    <Reveal>
      <div className="flex flex-col items-start justify-between gap-5 rounded-[28px] bg-card p-6 hairline sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="eyebrow">Need help deciding?</p>
          <p className="display mt-2 text-2xl text-ink sm:text-3xl">
            Talk to us. We'll match dates, budget and pace.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={waLink(message)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-snow"
          >
            Chat on WhatsApp
          </a>
          <Link
            to="/upcoming-trips"
            className="inline-flex items-center rounded-full border border-ink/15 px-5 py-2.5 text-[13px] font-medium text-ink"
          >
            See upcoming trips
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
