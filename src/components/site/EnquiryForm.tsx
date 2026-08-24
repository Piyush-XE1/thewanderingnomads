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
        dark ? "glass-dark rounded-[28px] p-6 sm:p-8" : "rounded-[28px] bg-card p-6 hairline sm:p-8"
      }
    >
      <p className={`eyebrow ${dark ? "text-snow/60" : ""}`}>Enquire</p>
      <h3 className={`display mt-3 text-2xl ${dark ? "text-snow" : "text-ink"}`}>
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
            className={`text-[11px] uppercase tracking-[0.18em] ${dark ? "text-snow/50" : "text-muted-foreground"}`}
          >
            A few words
          </label>
          <textarea
            name="note"
            rows={4}
            placeholder="When you'd like to travel, group size, anything on your mind."
            className={
              dark
                ? "mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-[14.5px] text-snow placeholder:text-snow/40 outline-none transition focus:border-white/40 focus:bg-white/10"
                : "mt-2 w-full rounded-2xl border border-ink/12 bg-background px-4 py-3 text-[14.5px] outline-none transition focus:border-ink/30"
            }
          />
        </div>
        <button
          type="submit"
          className={
            dark
              ? "mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-snow px-6 py-3.5 text-[13.5px] font-medium text-ink transition hover:bg-white"
              : "mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[13.5px] font-medium text-snow transition hover:opacity-90"
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
        className={`text-[11px] uppercase tracking-[0.18em] ${dark ? "text-snow/50" : "text-muted-foreground"}`}
      >
        {label}
      </label>
      <input
        name={name}
        placeholder={placeholder}
        className={
          dark
            ? "mt-2 w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-[14.5px] text-snow placeholder:text-snow/40 outline-none transition focus:border-white/40 focus:bg-white/10"
            : "mt-2 w-full rounded-full border border-ink/12 bg-background px-5 py-3 text-[14.5px] outline-none transition focus:border-ink/30"
        }
      />
    </div>
  );
}
