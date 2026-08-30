import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { TripCard } from "@/components/site/TripCard";
import { DestinationCard } from "@/components/site/DestinationCard";
import { TrustBar } from "@/components/site/TrustBar";
import { WhyUs } from "@/components/site/WhyUs";
import { Counter } from "@/components/site/Counter";
import { Agreement } from "@/components/site/Agreement";
import { FounderNote } from "@/components/site/FounderNote";
import { FaqSection } from "@/components/site/FaqSection";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { useContent, useSection } from "@/lib/cms/useContent";
import { collectDestinations, destinationForJourney } from "@/lib/destinations";
import { parsePrice, resolveBatches, resolveJourneys, waLink } from "@/lib/trips";
import { CONTACT_EMAIL, PHONE_DISPLAY, WHATSAPP_NUMBER } from "@/lib/site";

import heroImg from "@/assets/hero-himalaya.jpg";
import heroGroup from "@/assets/hero-group.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Wandering Nomads — Small-group trips across India & beyond" },
      {
        name: "description",
        content:
          "Community expeditions with confirmed dates. India, the Himalayas, and custom international journeys — small groups, hosted departures, limited seats.",
      },
      {
        property: "og:title",
        content: "The Wandering Nomads — Small-group trips across India & beyond",
      },
      {
        property: "og:description",
        content:
          "Community expeditions with confirmed dates. India, the Himalayas, and custom international journeys.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          name: "The Wandering Nomads",
          url: "https://thewanderingnomads.lovable.app",
          description:
            "Small-group community trips across India and beyond — confirmed dates, hosted departures.",
          areaServed: ["India", "Bhutan", "Nepal"],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Jaipur",
            addressRegion: "Rajasthan",
            addressCountry: "IN",
          },
          sameAs: ["https://instagram.com/thewanderingnomads.in"],
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout extra={<ScrollProgress />}>
      <main>
        <Hero />
        <TrustBar />
        <DestinationStrip />
        <Upcoming />
        <PromoBanner />
        <DestinationRail
          id="world"
          eyebrow="World adventures"
          title={
            <>
              Further than the
              <br />
              <em className="italic text-muted-foreground">last pass.</em>
            </>
          }
          region="international"
          allTo="/international-trips"
          allLabel="All international"
        />
        <DestinationRail
          id="india"
          eyebrow="Domestic getaways"
          title={
            <>
              India, the way
              <br />
              <em className="italic text-muted-foreground">it is actually travelled.</em>
            </>
          }
          region="india"
          allTo="/india-trips"
          allLabel="All India trips"
        />
        <WhyUs />
        <CommunityStats />
        <Agreement />
        <Testimonials />
        <FaqSection />
        <FounderNote />
        <ContactCta />
      </main>
    </SiteLayout>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] bg-forest"
    />
  );
}

const HERO_DESTINATIONS = ["the Himalayas", "Ladakh", "Spiti", "Kashmir", "Bhutan", "Meghalaya"];

function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <span className="relative inline-block align-baseline">
      <AnimatePresence mode="wait">
        <motion.em
          key={words[index]}
          initial={{ opacity: 0, y: "0.35em", filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-0.35em", filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block italic text-sunrise"
        >
          {words[index]}
        </motion.em>
      </AnimatePresence>
    </span>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const copy = useSection("home", "hero");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.55, 0.85]);

  const src = copy?.image_url ?? heroGroup;

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-[100svh] w-full overflow-hidden bg-neutral-950"
    >
      {/* Blurred group photo fills the section — the "soft" half the copy sits on */}
      <motion.div style={{ y, scale }} aria-hidden className="absolute inset-0">
        <img
          src={src}
          alt=""
          className="h-full w-full scale-125 object-cover object-center blur-2xl"
        />
      </motion.div>
      <motion.div
        style={{ opacity: overlay }}
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/55 to-black/65"
      />

      {/* Crisp group photo — top half on mobile, left half on desktop, feathered into the blur */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-x-0 top-0 h-[45%] overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] sm:inset-y-0 sm:left-0 sm:right-auto sm:h-full sm:w-1/2 sm:[mask-image:linear-gradient(to_right,black_70%,transparent_100%)]"
      >
        <img
          src={src}
          alt="A community of travellers together on a Himalayan ridge at sunrise"
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
          width={1920}
          height={1280}
        />
      </motion.div>

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-20 pt-28 sm:absolute sm:inset-y-0 sm:left-1/2 sm:right-0 sm:justify-center sm:px-10 sm:pb-12 sm:pt-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <RatingPill />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow text-white/75"
        >
          {copy?.subtitle ?? "Community expeditions · Confirmed dates · Limited seats"}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 26, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="display mt-6 max-w-4xl text-[12vw] leading-[0.95] text-white sm:text-7xl md:text-[84px]"
        >
          {copy?.heading ? (
            copy.heading
          ) : (
            <>
              Your trip to
              <br />
              <RotatingWord words={HERO_DESTINATIONS} />
            </>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl text-[15px] leading-relaxed text-white/85 sm:text-base"
        >
          <RichText
            html={
              copy?.description ??
              "India, the Himalayas, and custom journeys further afield. Hosted departures, stays with character, and groups small enough that the mountain still feels like the mountain."
            }
          />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Link
            to={(copy?.cta_href ?? "/upcoming-trips") as "/upcoming-trips"}
            className="group inline-flex items-center gap-3 rounded-lg bg-forest px-6 py-3.5 text-[13.5px] font-medium text-white transition hover:bg-forest/90 hover:shadow-[0_4px_16px_rgba(52,78,65,0.3)]"
          >
            {copy?.cta_label ?? "See upcoming trips"}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <Link
            to={(copy?.secondary_cta_href ?? "/india-trips") as "/india-trips"}
            className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-6 py-3.5 text-[13.5px] font-medium text-white backdrop-blur-md transition hover:bg-white/20"
          >
            {copy?.secondary_cta_label ?? "Explore India trips"}
          </Link>
          <a
            href={waLink("Hi The Wandering Nomads! I'd like to plan a trip.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-6 py-3.5 text-[13.5px] font-medium text-white backdrop-blur-md transition hover:bg-white/20"
          >
            Plan on WhatsApp
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.5 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/60 sm:left-[75%]"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="block h-6 w-px bg-gradient-to-b from-white/60 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}

function RatingPill() {
  return (
    <div className="inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
      <span className="text-[12px] text-white/80">2,500+ travellers hosted</span>
    </div>
  );
}

type PriceFilter = "all" | "under20" | "20to50" | "over50";

function Upcoming() {
  const { journeys: cmsJourneys, batches: cmsBatches, batchHosts, hosts } = useContent();
  const journeys = resolveJourneys(cmsJourneys);
  const batches = resolveBatches(cmsBatches, journeys);
  const [price, setPrice] = useState<PriceFilter>("all");
  const [dest, setDest] = useState("all");

  const destNames = useMemo(() => {
    const names = new Set<string>();
    for (const trip of journeys) names.add(destinationForJourney(trip)?.name ?? trip.destination);
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [journeys]);

  const visible = useMemo(() => {
    return journeys.filter((trip) => {
      const destName = destinationForJourney(trip)?.name ?? trip.destination;
      if (dest !== "all" && destName !== dest) return false;
      if (price === "all") return true;
      const value = parsePrice(trip.price);
      if (value == null) return false;
      if (price === "under20") return value < 20000;
      if (price === "20to50") return value >= 20000 && value <= 50000;
      return value > 50000;
    });
  }, [journeys, price, dest]);

  const filters: { id: PriceFilter; label: string }[] = [
    { id: "all", label: "All destinations" },
    { id: "under20", label: "Under ₹20K" },
    { id: "20to50", label: "₹20K – ₹50K" },
    { id: "over50", label: "₹50K+" },
  ];

  return (
    <section id="upcoming" className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <p className="eyebrow">Upcoming community trips</p>
            <h2 className="display mt-4 max-w-2xl text-4xl sm:text-5xl md:text-6xl">
              Reserve a seat on
              <br />
              <span className="italic text-muted-foreground">the next departure.</span>
            </h2>
            <p className="mt-4 max-w-lg text-[14.5px] text-muted-foreground">
              Confirmed dates, limited spots — pick a departure and we'll take it from there.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to="/upcoming-trips"
              className="group inline-flex items-center gap-2 text-[13px] font-medium text-forest"
            >
              All upcoming trips
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setPrice(f.id);
                if (f.id === "all") setDest("all");
              }}
              className={`rounded-lg px-4 py-2 text-[13px] font-medium transition ${
                price === f.id && dest === "all"
                  ? "bg-forest text-white shadow-sm"
                  : "bg-cream text-muted-foreground hover:text-forest hover:bg-forest/5"
              }`}
            >
              {f.label}
            </button>
          ))}
          {destNames.map((name) => (
            <button
              key={name}
              onClick={() => {
                setDest(name);
                setPrice("all");
              }}
              className={`rounded-lg px-4 py-2 text-[13px] font-medium transition ${
                dest === name
                  ? "bg-forest text-white shadow-sm"
                  : "bg-cream text-muted-foreground hover:text-forest hover:bg-forest/5"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {visible.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.slice(0, 6).map((trip, i) => (
              <Reveal key={trip.id} delay={i * 0.06}>
                <TripCard trip={trip} batches={batches} batchHosts={batchHosts} hosts={hosts} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-sm text-muted-foreground">
            No trips in that range — try another filter, or{" "}
            <a className="underline text-forest" href={waLink("Hi! I'd like help picking a trip.")}>
              ask us
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}

function DestinationStrip() {
  const { journeys: cmsJourneys } = useContent();
  const journeys = resolveJourneys(cmsJourneys);
  const india = collectDestinations(journeys, "india", { includeEmpty: true });
  const intl = collectDestinations(journeys, "international", { includeEmpty: true });
  const dests = [...india, ...intl].slice(0, 10);

  if (dests.length === 0) return null;

  return (
    <section className="relative bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Explore destinations</p>
              <h2 className="display mt-3 text-3xl sm:text-4xl">Where are we headed?</h2>
            </div>
            <Link
              to="/upcoming-trips"
              className="group inline-flex items-center gap-2 text-[13px] font-medium text-forest"
            >
              See all trips
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 flex gap-4 overflow-x-auto pb-3 marquee-fade snap-x sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-5">
          {dests.map((dest, i) => {
            const to =
              dest.region === "international" ? "/international-trips/$slug" : "/india-trips/$slug";
            return (
              <Reveal
                key={dest.slug}
                delay={i * 0.04}
                className="min-w-[150px] snap-start sm:min-w-0"
              >
                <Link
                  to={to}
                  params={{ slug: dest.slug }}
                  className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-2xl bg-ink text-white"
                >
                  {dest.image ? (
                    <img
                      src={dest.image}
                      alt={dest.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="relative z-10 p-3.5">
                    <p className="display text-lg leading-tight text-white">{dest.name}</p>
                    {dest.trips.length > 0 ? (
                      <p className="mt-0.5 text-[10.5px] uppercase tracking-[0.14em] text-white/70">
                        {dest.trips.length} {dest.trips.length === 1 ? "trip" : "trips"}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DestinationRail({
  id,
  eyebrow,
  title,
  region,
  allTo,
  allLabel,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  region: "india" | "international";
  allTo: "/india-trips" | "/international-trips";
  allLabel: string;
}) {
  const { journeys: cmsJourneys } = useContent();
  const journeys = resolveJourneys(cmsJourneys);
  const dests = collectDestinations(journeys, region, { includeEmpty: true }).slice(0, 8);

  return (
    <section id={id} className="relative bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="display mt-4 max-w-2xl text-4xl sm:text-5xl md:text-6xl">{title}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to={allTo}
              className="group inline-flex items-center gap-2 text-[13px] font-medium text-forest"
            >
              {allLabel}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
          {dests.map((dest, i) => (
            <Reveal
              key={dest.slug}
              delay={i * 0.05}
              className="min-w-[240px] snap-start sm:min-w-0"
            >
              <DestinationCard dest={dest} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const COMMUNITY_STATS: { value: number; suffix: string; label: string }[] = [
  { value: 2500, suffix: "+", label: "Travellers hosted" },
  { value: 120, suffix: "+", label: "Departures run" },
  { value: 30, suffix: "+", label: "Destinations covered" },
  { value: 4.9, suffix: "★", label: "Average rating" },
];

function CommunityStats() {
  return (
    <section className="relative overflow-hidden bg-forest py-16 text-white sm:py-20">
      <img
        src={heroGroup}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-[0.12]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="eyebrow text-white/60">A community, not a client list</p>
          <h2 className="display mt-3 max-w-2xl text-3xl text-white sm:text-4xl">
            Thousands have already left with us.
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">
          {COMMUNITY_STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <div className="text-center lg:text-left">
                <p className="display text-4xl text-white sm:text-5xl">
                  {stat.suffix === "★" ? (
                    <>
                      {stat.value}
                      <span className="text-sunrise">★</span>
                    </>
                  ) : (
                    <Counter to={stat.value} suffix={stat.suffix} />
                  )}
                </p>
                <p className="mt-2 text-[13px] text-white/70">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

type TestimonialView = {
  q: string;
  n: string;
  r: string;
  rating: number;
  date: string;
  avatar: string | null;
};

const defaultTestimonials: TestimonialView[] = [
  {
    q: "The most honest travel experience I've had in India. Small group, real places, no marketing fluff. Our host felt like an old friend by day two.",
    n: "Ananya R.",
    r: "Spiti Expedition",
    rating: 5,
    date: "May 2026",
    avatar: null,
  },
  {
    q: "I came for the mountains and left with friendships that outlasted the trip. Everything — stays, food, pace — was thought through.",
    n: "Rahul M.",
    r: "Jibhi Retreat",
    rating: 5,
    date: "Apr 2026",
    avatar: null,
  },
  {
    q: "Kashmir wasn't a destination. It was a week of belonging — hosted, not herded. Booking was effortless and the WhatsApp support was instant.",
    n: "Sneha K.",
    r: "Kashmir Expedition",
    rating: 5,
    date: "Mar 2026",
    avatar: null,
  },
];

function TestimonialStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rating ? "fill-sunrise" : "fill-ink/15"}`}
          aria-hidden
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

function GoogleGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.4 14.4c-.2-.7-.4-1.4-.4-2.4s.1-1.6.4-2.4V6.5H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.5l4-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"
      />
    </svg>
  );
}

function Testimonials() {
  const { testimonials: cmsTestimonials } = useContent();
  const hasReal = cmsTestimonials.length > 0;
  const testimonials: TestimonialView[] = hasReal
    ? cmsTestimonials.map((t) => ({
        q: t.review,
        n: t.name,
        r: t.trip ?? "",
        rating: t.rating ?? 5,
        date: t.review_date ?? "",
        avatar: t.avatar_url,
      }))
    : defaultTestimonials;

  return (
    <section id="testimonials" className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <p className="eyebrow">In their words</p>
            <h2 className="display mt-4 max-w-2xl text-4xl sm:text-5xl md:text-6xl">
              Trust is earned
              <br />
              <span className="italic text-muted-foreground">one departure at a time.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex items-center gap-3 rounded-xl border border-ink/8 bg-cream px-5 py-4">
              <GoogleGlyph className="h-8 w-8" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="display text-2xl text-ink">4.9</span>
                  <TestimonialStars rating={5} />
                </div>
                <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                  Rated by 2,500+ travellers
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-xl bg-cream border border-ink/5 p-7 transition-all duration-300 hover:shadow-lift hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <TestimonialStars rating={t.rating} />
                  <GoogleGlyph className="h-4 w-4 opacity-70" />
                </div>
                <blockquote className="mt-4 flex-1 text-[14.5px] leading-relaxed text-ink/85">
                  “{t.q}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/8 pt-5">
                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      alt={t.n}
                      className="h-10 w-10 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/8 text-[12px] font-medium text-forest">
                      {t.n.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-medium text-ink">{t.n}</p>
                    <p className="truncate text-[11.5px] uppercase tracking-[0.15em] text-muted-foreground">
                      {[t.r, t.date].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCta() {
  return (
    <section id="contact" className="relative overflow-hidden bg-forest py-24 text-white sm:py-32">
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Reveal>
              <p className="eyebrow text-white/60">Plan a trip</p>
              <h2 className="display mt-4 text-4xl leading-[1.02] text-white sm:text-5xl md:text-[64px]">
                Tell us where you
                <br />
                <span className="italic text-white/60">want to go.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-12 grid gap-6 text-[14.5px] sm:grid-cols-2">
                <ContactLine label="Email" href={`mailto:${CONTACT_EMAIL}`} v={CONTACT_EMAIL} />
                <ContactLine label="WhatsApp" href={waLink()} v={PHONE_DISPLAY} />
                <ContactLine label="Phone" href={`tel:+${WHATSAPP_NUMBER}`} v={PHONE_DISPLAY} />
                <ContactLine
                  label="Instagram"
                  href="https://instagram.com/thewanderingnomads.in"
                  v="@thewanderingnomads.in"
                />
                <ContactLine label="Based in" v="Jaipur, Rajasthan" />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <EnquiryForm tone="dark" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactLine({ label, v, href }: { label: string; v: string; href?: string }) {
  const inner = <span className="text-white">{v}</span>;
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">{label}</p>
      <p className="mt-2">
        {href ? (
          <a
            href={href}
            className="border-b border-white/30 pb-0.5 transition hover:border-white"
            target="_blank"
            rel="noreferrer"
          >
            {inner}
          </a>
        ) : (
          inner
        )}
      </p>
    </div>
  );
}

function PromoBanner() {
  return (
    <section className="bg-white pb-4">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-forest px-6 py-10 text-white sm:px-10 sm:py-12">
            <img
              src={heroImg}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-15"
            />
            <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="eyebrow text-white/60">Need help deciding?</p>
                <h2 className="display mt-3 text-3xl text-white sm:text-4xl">
                  Talk to a travel host — not a call centre.
                </h2>
              </div>
              <a
                href={waLink("Hi The Wandering Nomads! I need help picking a trip.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-[13.5px] font-medium text-forest transition hover:bg-white/90 hover:shadow-md"
              >
                Request a callback
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
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
