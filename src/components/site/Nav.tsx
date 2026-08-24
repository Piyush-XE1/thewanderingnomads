import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { Logo } from "@/components/site/Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/upcoming-trips", label: "Upcoming" },
  { to: "/india-trips", label: "India" },
  { to: "/international-trips", label: "International" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

function isDarkHeroPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/india-trips" ||
    pathname === "/international-trips" ||
    pathname.startsWith("/india-trips/") ||
    pathname.startsWith("/international-trips/")
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const light = isDarkHeroPath(pathname) && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6"
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6 sm:py-3 ${
          scrolled ? "glass" : "border border-white/10 bg-white/5 backdrop-blur-[6px]"
        } ${!light && !scrolled ? "border-ink/10 bg-background/70 backdrop-blur-md" : ""}`}
      >
        <Link to="/" className="flex items-center gap-2.5 group">
          <Logo variant={light ? "light" : "dark"} size={32} />
          <span
            className={`display text-[15px] tracking-tight transition-colors ${
              light ? "text-white" : "text-ink"
            }`}
          >
            The Wandering Nomads
          </span>
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`relative rounded-full px-3 py-2 text-[13px] font-medium transition-colors ${
                  light ? "text-white/80 hover:text-white" : "text-ink/70 hover:text-ink"
                }`}
                activeProps={{
                  className: light ? "text-white bg-white/15" : "text-ink bg-ink/5",
                }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle variant={light ? "light" : "dark"} />
          <Link
            to="/upcoming-trips"
            className={`inline-flex items-center rounded-full px-4 py-2 text-[13px] font-medium transition ${
              light ? "bg-white text-ink hover:bg-white/90" : "bg-ink text-snow hover:opacity-90"
            }`}
          >
            Book Now
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle variant={light ? "light" : "dark"} />

          <button
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
              light ? "border-white/25 text-white" : "border-ink/15 text-ink"
            }`}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 h-px w-4 bg-current transition-transform ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="glass absolute left-4 right-4 top-[72px] rounded-3xl p-3 lg:hidden"
          >
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-[15px] font-medium text-ink/80 hover:bg-ink/5"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 border-t border-ink/5 pt-2">
                <Link
                  to="/upcoming-trips"
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl bg-ink px-4 py-3 text-center text-[14px] font-medium text-snow"
                >
                  Book Now
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
