import { Link } from "@tanstack/react-router";

import { useContent } from "@/lib/cms/useContent";
import { CONTACT_EMAIL, PHONE_DISPLAY } from "@/lib/site";

export function Footer() {
  const { settings, social } = useContent();
  const email = settings?.contact_email ?? CONTACT_EMAIL;
  const phone = settings?.contact_phone ?? PHONE_DISPLAY;
  const phoneDigits = phone.replace(/[^0-9]/g, "");
  const socialLinks =
    social.length > 0
      ? social
      : [
          {
            id: "s1",
            platform: "instagram",
            label: "@thewanderingnomads.in",
            handle: null,
            url: "https://instagram.com/thewanderingnomads.in",
            sort_order: 0,
          },
        ];

  return (
    <footer className="border-t border-ink/8 bg-snow">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-[11px] font-medium tracking-widest text-ink">
                WN
              </span>
              <span className="display text-[17px] text-ink">
                {settings?.site_title ?? "The Wandering Nomads"}
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Small-group community trips across India and beyond — confirmed dates, hosted
              departures, and itineraries we have actually walked.
            </p>
            <p className="mt-6 text-xs text-muted-foreground">Jaipur, Rajasthan · India</p>
          </div>

          <FooterCol title="Trips">
            <FLink to="/upcoming-trips">Upcoming trips</FLink>
            <FLink to="/india-trips">India</FLink>
            <FLink to="/international-trips">International</FLink>
            <li>
              <Link
                to="/india-trips/$slug"
                params={{ slug: "kashmir" }}
                className="transition hover:text-ink"
              >
                Kashmir
              </Link>
            </li>
            <li>
              <Link
                to="/india-trips/$slug"
                params={{ slug: "spiti" }}
                className="transition hover:text-ink"
              >
                Spiti
              </Link>
            </li>
            <li>
              <Link
                to="/international-trips/$slug"
                params={{ slug: "bhutan" }}
                className="transition hover:text-ink"
              >
                Bhutan
              </Link>
            </li>
          </FooterCol>

          <FooterCol title="The brand">
            <FLink to="/about">About</FLink>
            <FLink to="/gallery">Gallery</FLink>
            <FLink to="/atlas">Travel Atlas</FLink>
            <FLink to="/contact">Contact</FLink>
          </FooterCol>

          <FooterCol title="Talk to us">
            <FA href={`mailto:${email}`}>{email}</FA>
            <FA href={`tel:${phoneDigits ? `+${phoneDigits}` : ""}`}>{phone}</FA>
            <FA href={`https://wa.me/${phoneDigits}`}>WhatsApp</FA>
            {socialLinks.map((l) => (
              <FA key={l.id} href={l.url}>
                {l.label || l.handle || l.platform}
              </FA>
            ))}
          </FooterCol>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-ink/8 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            {settings?.footer_copyright ??
              `© ${new Date().getFullYear()} The Wandering Nomads. Crafted with care in Jaipur.`}
          </p>
          <p className="tracking-widest uppercase">Community trips · Est. 2024</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-4">{title}</p>
      <ul className="flex flex-col gap-2.5 text-sm text-ink/80">{children}</ul>
    </div>
  );
}

function FLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="transition hover:text-ink">
        {children}
      </Link>
    </li>
  );
}

function FA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a href={href} className="transition hover:text-ink" target="_blank" rel="noreferrer">
        {children}
      </a>
    </li>
  );
}
