import { Reveal } from "@/components/site/Reveal";

const ITEMS = [
  { k: "24×7", t: "WhatsApp support", d: "A real person. Same day." },
  { k: "8–12", t: "Small groups only", d: "Never a bus. Never a crowd." },
  { k: "100%", t: "Personalised", d: "Dates, pace, stays — we shape it." },
  { k: "Hosted", t: "On the ground", d: "A trip captain you will actually like." },
];

export function TrustBar() {
  return (
    <section className="relative border-b border-ink/8 bg-snow py-10 sm:py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 lg:grid-cols-4 lg:gap-8">
        {ITEMS.map((item, i) => (
          <Reveal key={item.t} delay={i * 0.05}>
            <div>
              <p className="display text-3xl text-ink sm:text-4xl">{item.k}</p>
              <p className="mt-2 text-[13px] font-medium text-ink">{item.t}</p>
              <p className="mt-1 text-[12.5px] text-muted-foreground">{item.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
