import { Reveal } from "@/components/site/Reveal";
import { waLink } from "@/lib/site";

const FAQS = [
  {
    q: "What makes these trips different from a regular group tour?",
    a: "Small groups, hosted departures, and itineraries we have actually walked. We do not fill buses or sell a brochure. You travel with people we would travel with.",
  },
  {
    q: "Can I join solo and still feel included?",
    a: "Most of our travellers do. Batches are built for solo joiners — shared rooms if you want them, a host who makes space, and no couple-only energy.",
  },
  {
    q: "Who leads the trips?",
    a: "A named trip host on every batch — often the founder, always someone who knows the route. You meet them before you pay the rest.",
  },
  {
    q: "How do I book?",
    a: "Pick a trip, tap Book on WhatsApp, and we hold a seat with a small advance. The remaining amount is due before departure. No surprise portal fees.",
  },
  {
    q: "Are itineraries flexible?",
    a: "Yes, within reason. Weather, permits, and the mood of a good group all reshape a day. Private and custom trips are built from scratch.",
  },
  {
    q: "Is this comfortable and safe for women travelling solo?",
    a: "Yes. We share the host's number, the stay list, and the group composition before you commit. Stays are vetted. You can always message us off-thread.",
  },
  {
    q: "Do you run international trips?",
    a: "Yes — Bhutan, Nepal, and custom loops across Southeast Asia and Europe. Some are fixed community batches; others we design around your dates.",
  },
  {
    q: "What if the dates don't work for me?",
    a: "Tell us. We open a new batch when enough people want the same week, or we plan a private departure for friends and families.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow">FAQ</p>
              <h2 className="display mt-4 text-4xl sm:text-5xl">
                Your questions,
                <br />
                <span className="italic text-muted-foreground">answered straight.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-muted-foreground">
                Still deciding? A five-minute WhatsApp chat is faster than any form.
              </p>
              <a
                href={waLink("Hi The Wandering Nomads! I have a few questions about your trips.")}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center rounded-lg bg-forest px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-forest/90 hover:shadow-[0_2px_8px_rgba(52,78,65,0.25)]"
              >
                Chat with us
              </a>
            </Reveal>
          </div>

          <div className="divide-y divide-ink/8">
            {FAQS.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.03}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left">
                    <span className="display text-xl text-ink sm:text-[22px]">{item.q}</span>
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-forest/30 text-forest/70 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
