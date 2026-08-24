import { Reveal } from "@/components/site/Reveal";

const ITEMS = [
  {
    t: "Exclusivity, not volume",
    d: "We don't fill buses. Batches stay small so the group still feels like people, not a tour code.",
  },
  {
    t: "You come first",
    d: "Want to extend a day, skip a market, celebrate a birthday on the road? Say so. You're not a slot.",
  },
  {
    t: "Captains who actually care",
    d: "They notice the quiet ones, hold the group, and lead without making it feel like a flag-on-a-stick tour.",
  },
  {
    t: "The community doesn't end at the airport",
    d: "Travel once and you're in — the next batch, a reunion, a custom trip with people you already trust.",
  },
];

export function Agreement() {
  return (
    <section className="relative bg-snow py-24 sm:py-32 border-t border-ink/8">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="eyebrow">Our unspoken agreement</p>
          <h2 className="display mt-4 max-w-3xl text-4xl sm:text-5xl md:text-6xl">
            Not everyone gets in.
            <br />
            <span className="italic text-muted-foreground">That's what makes it work.</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-[24px] hairline bg-ink/8 sm:grid-cols-2">
          {ITEMS.map((item, i) => (
            <Reveal key={item.t} delay={i * 0.05}>
              <div className="h-full bg-card p-8">
                <p className="eyebrow">0{i + 1}</p>
                <h3 className="display mt-4 text-2xl text-ink">{item.t}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">{item.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
