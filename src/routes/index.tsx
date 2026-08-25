import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef, useState, type ReactNode } from "react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { TripCard } from "@/components/site/TripCard";
import { DestinationCard } from "@/components/site/DestinationCard";
import { TrustBar } from "@/components/site/TrustBar";
import { WhyUs } from "@/components/site/WhyUs";
import { Agreement } from "@/components/site/Agreement";
import { FounderNote } from "@/components/site/FounderNote";
import { FaqSection } from "@/components/site/FaqSection";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { useContent, useSection } from "@/lib/cms/useContent";
import { collectDestinations, destinationForJourney } from "@/lib/destinations";
import { parsePrice, resolveBatches, resolveJourneys, waLink } from "@/lib/trips";
import { CONTACT_EMAIL, PHONE_DISPLAY, WHATSAPP_NUMBER } from "@/lib/site";

import heroImg from "@/assets/hero-himalaya.jpg";

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
      className="fixed inset-x-0 top-0 z-[70] h-[2px] bg-gradient-to-r from-forest via-sunrise to-river"
    />
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
  const overlay = useTransform(scrollYProgress, [0, 1], [0.35, 0.7]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative h-[100svh] w-full overflow-hidden bg-neutral-950"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img
          src={copy?.image_url ?? heroImg}
          alt="A traveller on a Himalayan ridge at sunrise"
          className="h-full w-full object-cover"
          fetchPriority="high"
          width={1920}
          height={1280}
        />
      </motion.div>
      <motion.div
        style={{ opacity: overlay }}
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/70"
      />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-20 sm:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow text-white/70"
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
              Small-group trips
              <br />
              <em className="italic text-white/85">worth leaving for.</em>
            </>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl text-[15px] leading-relaxed text-white/80 sm:text-base"
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
            className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-[13.5px] font-medium text-neutral-900 transition hover:bg-white/90"
          >
            {copy?.cta_label ?? "See upcoming trips"}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <Link
            to={(copy?.secondary_cta_href ?? "/india-trips") as "/india-trips"}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-[13.5px] font-medium text-white backdrop-blur-md transition hover:bg-white/15"
          >
            {copy?.secondary_cta_label ?? "Explore India trips"}
          </Link>
          <a
            href={waLink("Hi The Wandering Nomads! I'd like to plan a trip.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-[13.5px] font-medium text-white backdrop-blur-md transition hover:bg-white/15"
          >
            Plan on WhatsApp
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.5 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/60"
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
    <section id="upcoming" className="relative bg-background py-24 sm:py-32">
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
              className="group inline-flex items-center gap-2 text-[13px] font-medium text-ink"
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
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
                price === f.id && dest === "all"
                  ? "bg-ink text-snow"
                  : "hairline text-muted-foreground hover:text-ink"
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
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
                dest === name ? "bg-ink text-snow" : "hairline text-muted-foreground hover:text-ink"
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
            <a className="underline" href={waLink("Hi! I'd like help picking a trip.")}>
              ask us
            </a>
            .
          </p>
        )}
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
    <section id={id} className="relative bg-snow py-24 sm:py-32 border-t border-ink/8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="display mt-4 max-w-2xl text-4xl sm:text-5xl md:text-6xl">{title}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to={allTo}
              className="group inline-flex items-center gap-2 text-[13px] font-medium text-ink"
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

const defaultTestimonials = [
  {
    q: "The most honest travel experience I've had in India. Small group, real places, no marketing fluff.",
    n: "A traveller",
    r: "Spiti Expedition",
  },
  {
    q: "I came for the mountains and left with friendships that outlasted the trip.",
    n: "A traveller",
    r: "Jibhi Retreat",
  },
  {
    q: "Kashmir wasn't a destination. It was a week of belonging — hosted, not herded.",
    n: "A traveller",
    r: "Kashmir Expedition",
  },
];

function Testimonials() {
  const { testimonials: cmsTestimonials } = useContent();
  const hasReal = cmsTestimonials.length > 0;
  const testimonials = hasReal
    ? cmsTestimonials.map((t) => ({ q: t.review, n: t.name, r: t.trip ?? "" }))
    : defaultTestimonials;

  return (
    <section id="testimonials" className="relative bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="eyebrow">In their words</p>
          <h2 className="display mt-4 max-w-2xl text-4xl sm:text-5xl md:text-6xl">
            Trust is earned
            <br />
            <span className="italic text-muted-foreground">one departure at a time.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <figure className="glass flex h-full flex-col rounded-[28px] p-8">
                <span className="display text-6xl leading-none text-ink/20">&ldquo;</span>
                <blockquote className="mt-2 text-[16px] leading-relaxed text-ink/85">
                  {t.q}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3 border-t border-ink/8 pt-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/8 text-[12px] font-medium text-ink/60">
                    {t.n.charAt(0)}
                  </span>
                  <div>
                    <p className="text-[13.5px] font-medium text-ink">{t.n}</p>
                    <p className="text-[11.5px] uppercase tracking-[0.15em] text-muted-foreground">
                      {t.r}
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
    <section id="contact" className="relative overflow-hidden bg-ink py-24 text-snow sm:py-32">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(2px)",
        }}
      />
      <div className="absolute inset-0 bg-ink/85" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Reveal>
              <p className="eyebrow text-snow/60">Plan a trip</p>
              <h2 className="display mt-4 text-4xl leading-[1.02] text-snow sm:text-5xl md:text-[64px]">
                Tell us where you
                <br />
                <span className="italic text-snow/60">want to go.</span>
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
  const inner = <span className="text-snow">{v}</span>;
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-snow/70">{label}</p>
      <p className="mt-2">
        {href ? (
          <a
            href={href}
            className="border-b border-snow/20 pb-0.5 transition hover:border-snow"
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
    <section className="bg-background pb-4">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-ink px-6 py-10 text-snow sm:px-10 sm:py-12">
            <img
              src={heroImg}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-ink/70" />
            <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="eyebrow text-snow/60">Need help deciding?</p>
                <h2 className="display mt-3 text-3xl text-snow sm:text-4xl">
                  Talk to a travel host — not a call centre.
                </h2>
              </div>
              <a
                href={waLink("Hi The Wandering Nomads! I need help picking a trip.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-[13.5px] font-medium text-neutral-900 transition hover:bg-white/90"
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
