import { waLink } from "@/lib/trips";

export function EnquiryForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const name = String(data.get("name") ?? "");
        const dest = String(data.get("destination") ?? "");
        const note = String(data.get("note") ?? "");
        window.open(
          waLink(
            `Hi The Wandering Nomads! I'm ${name || "a traveller"}${
              dest ? `, looking at ${dest}` : ""
            }. ${note}`.trim(),
          ),
          "_blank",
          "noreferrer",
        );
      }}
      className={
        dark
          ? "glass-dark rounded-2xl p-6 sm:p-8"
          : "rounded-2xl bg-card border border-ink/6 p-6 shadow-[0_1px_3px_rgba(20,28,36,0.03)] sm:p-8"
      }
    >
      <p className={`eyebrow ${dark ? "text-white/60" : ""}`}>Enquire</p>
      <h3 className={`display mt-3 text-2xl ${dark ? "text-white" : "text-ink"}`}>
        We'll take it from here
      </h3>
      <div className="mt-6 grid gap-4">
        <Field dark={dark} name="name" label="Your name" placeholder="Your name" />
        <Field
          dark={dark}
          name="destination"
          label="Destination in mind"
          placeholder="Kashmir, Spiti, Bhutan…"
        />
        <div>
          <label
            className={`text-[11px] uppercase tracking-[0.18em] ${dark ? "text-white/70" : "text-muted-foreground"}`}
          >
            A few words
          </label>
          <textarea
            name="note"
            rows={4}
            placeholder="When you'd like to travel, group size, anything on your mind."
            className={
              dark
                ? "mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-[14.5px] text-white placeholder:text-white/55 outline-none transition focus:border-white/40 focus:bg-white/10"
                : "mt-2 w-full rounded-xl border border-ink/10 bg-background px-4 py-3 text-[14.5px] outline-none transition focus:border-forest/40"
            }
          />
        </div>
        <button
          type="submit"
          className={
            dark
              ? "mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-[13.5px] font-medium text-forest transition hover:opacity-90"
              : "mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-forest px-6 py-3.5 text-[13.5px] font-medium text-white transition hover:bg-forest/90 hover:shadow-[0_2px_8px_rgba(52,78,65,0.25)]"
          }
        >
          Continue on WhatsApp
        </button>
      </div>
    </form>
  );
}

function Field({
  dark,
  name,
  label,
  placeholder,
}: {
  dark: boolean;
  name: string;
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label
        className={`text-[11px] uppercase tracking-[0.18em] ${dark ? "text-white/70" : "text-muted-foreground"}`}
      >
        {label}
      </label>
      <input
        name={name}
        placeholder={placeholder}
        className={
          dark
            ? "mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-[14.5px] text-white placeholder:text-white/55 outline-none transition focus:border-white/40 focus:bg-white/10"
            : "mt-2 w-full rounded-lg border border-ink/10 bg-background px-5 py-3 text-[14.5px] outline-none transition focus:border-forest/40"
        }
      />
    </div>
  );
}
