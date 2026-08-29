import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { Logo } from "@/components/site/Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/upcoming-trips", label: "Trips" },
  { to: "/india-trips", label: "India" },
  { to: "/international-trips", label: "International" },
  { to: "/atlas", label: "Atlas" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

function isTransparentPath(pathname: string) {
  return pathname === "/";
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const transparent = isTransparentPath(pathname) && !scrolled;

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
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        transparent
          ? ""
          : "bg-white/95 backdrop-blur-md border-b border-ink/6 shadow-[0_1px_3px_rgba(20,28,36,0.04)]"
      }`}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3.5 sm:px-6 sm:py-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <Logo variant={transparent ? "light" : "dark"} size={30} />
          <span
            className={`display text-[15px] tracking-tight transition-colors ${
              transparent ? "text-white" : "text-ink"
            }`}
          >
            The Wandering Nomads
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`relative rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                  transparent ? "text-white/80 hover:text-white" : "text-ink/65 hover:text-forest"
                }`}
                activeProps={{
                  className: transparent ? "text-white font-semibold" : "text-forest font-semibold",
                }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2.5 lg:flex">
          <ThemeToggle variant={transparent ? "light" : "dark"} />
          <Link
            to="/upcoming-trips"
            className={`inline-flex items-center rounded-lg px-4 py-2 text-[13px] font-medium transition ${
              transparent
                ? "border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                : "bg-forest text-white hover:bg-forest/90 hover:shadow-[0_2px_8px_rgba(52,78,65,0.25)]"
            }`}
          >
            Book Now
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle variant={transparent ? "light" : "dark"} />
          <button
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${
              transparent
                ? "border-white/25 text-white hover:bg-white/10"
                : "border-ink/10 text-ink hover:bg-ink/5"
            }`}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-4 bg-current transition-transform ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 h-[1.5px] w-4 bg-current transition-transform ${
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
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute left-3 right-3 top-[68px] rounded-2xl bg-white border border-ink/8 shadow-lift p-3 lg:hidden"
          >
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-[14px] font-medium text-ink/75 hover:bg-forest/5 hover:text-forest transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 border-t border-ink/6 pt-2">
                <Link
                  to="/upcoming-trips"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-forest px-4 py-3 text-center text-[13px] font-medium text-white"
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
