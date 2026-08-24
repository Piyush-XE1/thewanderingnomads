import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { CONTACT_EMAIL, PHONE_DISPLAY, WHATSAPP_NUMBER, waLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — The Wandering Nomads" },
      {
        name: "description",
        content:
          "Plan a community trip or a custom itinerary. WhatsApp, email and phone — we write back the same day.",
      },
      { property: "og:title", content: "Contact — The Wandering Nomads" },
      { property: "og:description", content: "Plan your next trip with The Wandering Nomads." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <main className="pt-40 pb-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="eyebrow">Contact</p>
            <h1 className="display mt-4 max-w-3xl text-5xl leading-[1.02] sm:text-6xl md:text-7xl">
              Plan your next trip.
              <br />
              <em className="italic text-muted-foreground">We write back.</em>
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-muted-foreground">
              Dates, group size, a destination — or none of the above. WhatsApp is the fastest way
              to a real answer.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
              <Row label="Email" href={`mailto:${CONTACT_EMAIL}`} v={CONTACT_EMAIL} />
              <Row label="WhatsApp" href={waLink()} v={PHONE_DISPLAY} />
              <Row label="Phone" href={`tel:+${WHATSAPP_NUMBER}`} v={PHONE_DISPLAY} />
              <Row
                label="Instagram"
                href="https://instagram.com/thewanderingnomads.in"
                v="@thewanderingnomads.in"
              />
              <Row label="Based in" v="Jaipur, Rajasthan, India" />
            </div>
            <EnquiryForm />
          </div>
        </div>
      </main>
    </SiteLayout>
  );
}

function Row({ label, v, href }: { label: string; v: string; href?: string }) {
  return (
    <Reveal>
      <div className="border-t border-ink/10 pt-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="mt-3 text-[18px] text-ink">
          {href ? (
            <a
              href={href}
              className="border-b border-ink/20 pb-0.5 transition hover:border-ink"
              target="_blank"
              rel="noreferrer"
            >
              {v}
            </a>
          ) : (
            v
          )}
        </p>
      </div>
    </Reveal>
  );
}
