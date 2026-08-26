import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { Timeline } from "@/components/site/Timeline";
import { useContent } from "@/lib/cms/useContent";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — The Wandering Nomads" },
      {
        name: "description",
        content:
          "The story behind The Wandering Nomads — a small-group travel company born on the road across India.",
      },
      { property: "og:title", content: "About — The Wandering Nomads" },
      {
        property: "og:description",
        content: "How a year on the road became a community travel company.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { about, milestones } = useContent();

  const defaultIntro =
    "The Wandering Nomads started because people asked to come along. What began as one backpack across India is now a small-group travel company — hosted departures, real places, and a community that still fits around a fire.";

  return (
    <SiteLayout>
      <main className="pt-36 pb-32">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <p className="eyebrow">{about?.founder_title ?? "About the company"}</p>
            <h1 className="display mt-5 text-5xl leading-[1.02] sm:text-6xl md:text-7xl text-balance">
              The story behind
              <br />
              <em className="italic text-muted-foreground">the trips.</em>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 max-w-[58ch] text-[16.5px] leading-[1.7] text-muted-foreground">
              {about?.biography ? <RichText html={about.biography} /> : <p>{defaultIntro}</p>}
            </div>
          </Reveal>
        </div>

        <section aria-label="How we got here" className="mx-auto mt-20 max-w-3xl px-6">
          <Timeline items={milestones} />
        </section>

        <div className="mx-auto mt-16 max-w-3xl px-6">
          <Reveal delay={0.05}>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/upcoming-trips"
                className="inline-flex items-center rounded-lg bg-forest px-6 py-3.5 text-[13.5px] font-medium text-white transition hover:bg-forest/90 hover:shadow-[0_2px_8px_rgba(52,78,65,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                See upcoming trips
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center rounded-lg border border-forest/20 px-6 py-3.5 text-[13.5px] font-medium text-forest transition hover:bg-forest/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Plan a trip
              </Link>
            </div>
          </Reveal>
        </div>
      </main>
    </SiteLayout>
  );
}
