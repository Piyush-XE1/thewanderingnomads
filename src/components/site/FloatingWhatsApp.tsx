import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { waLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";

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
          <WhatsAppIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Chat with us</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
