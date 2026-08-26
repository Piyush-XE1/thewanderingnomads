import { Reveal } from "@/components/site/Reveal";

const REASONS = [
  {
    t: "Community trips, not tourist buses",
    d: "Hand-picked batches of solo travellers and small friend groups. You leave with people, not a WhatsApp graveyard.",
  },
  {
    t: "Confirmed dates, limited seats",
    d: "Every departure on the site is a real batch. When it fills, it fills. No phantom 'sold out' theatre.",
  },
  {
    t: "Stays with character",
    d: "Homestays, wooden houses, houseboats — places you would actually post, and sleep well in.",
  },
  {
    t: "Hosts you'd call after",
    d: "Trip captains who notice the quiet ones, hold the group, and know the road because they have walked it.",
  },
  {
    t: "Experiences over itineraries",
    d: "We run every route ourselves. Want to swap a market stop for a ridge walk? We already budgeted the slack.",
  },
  {
    t: "Custom when you want it",
    d: "Private groups, family departures, and international itineraries built around how you actually like to travel.",
  },
];

export function WhyUs() {
  return (
    <section className="relative bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="eyebrow">Why travel with us</p>
          <h2 className="display mt-4 max-w-3xl text-4xl sm:text-5xl md:text-6xl">
            Crafted for the curious,
            <br />
            <span className="italic text-muted-foreground">the wild and the real.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((w, i) => (
            <Reveal key={w.t} delay={i * 0.05}>
              <div className="group relative h-full rounded-xl bg-card border border-ink/6 p-7 shadow-[0_1px_3px_rgba(20,28,36,0.03)] transition-all duration-300 hover:shadow-lift hover:-translate-y-1">
                <span className="display text-sm text-forest/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display mt-6 text-xl text-ink">{w.t}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{w.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
