import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { waLink } from "@/lib/site";

export function FloatingWhatsApp() {
  const [show, setShow] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setShow(h > 0 && y / h > 0.35);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          key="wa"
          href={waLink()}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with The Wandering Nomads on WhatsApp"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-[65] group inline-flex items-center gap-2.5 rounded-full bg-[#25D366] pl-3.5 pr-4 py-3 text-[13px] font-medium text-white shadow-[0_10px_40px_-10px_rgba(37,211,102,0.55)] ring-1 ring-white/20 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:bottom-8 sm:right-8"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
            <path d="M20.5 3.5A11.85 11.85 0 0 0 12.05 0C5.5 0 .2 5.3.2 11.85c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.83 11.83 0 0 0 5.65 1.44h.01c6.55 0 11.85-5.3 11.85-11.85 0-3.17-1.23-6.15-3.41-8.41ZM12.06 21.8h-.01a9.94 9.94 0 0 1-5.06-1.39l-.36-.21-3.8 1 1.01-3.7-.24-.38a9.94 9.94 0 0 1-1.52-5.27C2.08 6.4 6.55 1.94 12.06 1.94c2.66 0 5.16 1.04 7.04 2.92a9.93 9.93 0 0 1 2.92 7.05c0 5.5-4.47 9.97-9.96 9.97Zm5.46-7.46c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.6.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.5-.5-.68-.51l-.58-.01c-.2 0-.53.07-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.55.72.3 1.28.5 1.72.65.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.13-.28-.2-.58-.35Z" />
          </svg>
          <span className="hidden sm:inline">Chat with us</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
