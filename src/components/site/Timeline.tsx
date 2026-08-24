import { motion, useReducedMotion } from "framer-motion";

import { RichText } from "@/components/site/RichText";
import type { Milestone } from "@/lib/cms/types";

type Chapter = {
  year: string;
  title: string;
  body: string;
};

const defaults: Chapter[] = [
  {
    year: "Origin",
    title: "A small village in Deoria",
    body: "Born in Deoria, Uttar Pradesh — curious about a world beyond the fields, long before he had the words for it.",
  },
  {
    year: "College",
    title: "Moving to Jaipur",
    body: "University pulled him west. Jaipur sharpened his voice and taught him the discipline of a new city.",
  },
  {
    year: "First trip",
    title: "Discovering solo travel",
    body: "One backpack. One decision. Thousands of kilometres of hitchhiking that quietly rewired everything.",
  },
  {
    year: "24+",
    title: "Across the Indian subcontinent",
    body: "State by state. Twenty-four and counting — not for a list, but for the people at the end of each road.",
  },
  {
    year: "200+",
    title: "Two hundred cities and towns",
    body: "Villages, temple towns, high-altitude posts, coastal ports — India revealed itself slowly, in conversation.",
  },
  {
    year: "Community",
    title: "Building a following",
    body: "Travellers started asking to come along. A community formed around trust, not marketing.",
  },
  {
    year: "2024",
    title: "Founding The Wandering Nomads",
    body: "A hosted expedition brand for young travellers who want the real thing — small groups, real places.",
  },
];

export function Timeline({ items }: { items?: Milestone[] }) {
  const reduced = useReducedMotion();
  const chapters: Chapter[] =
    items && items.length > 0
      ? items.map((m) => ({
          year: m.year ?? "",
          title: m.title,
          body: m.description ?? "",
        }))
      : defaults;

  return (
    <ol className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[6.5rem] top-2 bottom-2 hidden w-px bg-gradient-to-b from-transparent via-ink/15 to-transparent sm:block"
      />
      {chapters.map((m, i) => (
        <motion.li
          key={`${m.title}-${i}`}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, filter: "blur(6px)" }}
          whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            delay: Math.min(i * 0.04, 0.24),
          }}
          className="relative grid grid-cols-1 gap-4 py-10 sm:grid-cols-[6rem_1fr] sm:gap-10 sm:py-12"
        >
          <div className="sm:text-right">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {m.year}
            </p>
          </div>

          <div className="relative sm:pl-10">
            <span
              aria-hidden
              className="absolute -left-[3px] top-2 hidden h-2 w-2 rounded-full bg-forest ring-4 ring-background sm:block"
              style={{
                boxShadow: "0 0 0 6px color-mix(in oklab, var(--forest) 12%, transparent)",
              }}
            />
            <h3 className="display text-[26px] sm:text-[30px] leading-[1.05] text-ink text-balance">
              {m.title}
            </h3>
            <RichText
              html={m.body}
              className="mt-3 max-w-[58ch] text-[15px] leading-[1.65] text-muted-foreground"
            />
          </div>

          {i < chapters.length - 1 && (
            <div className="col-span-full sm:hidden">
              <div className="mx-0 mt-6 h-px w-16 bg-ink/15" />
            </div>
          )}
        </motion.li>
      ))}
    </ol>
  );
}
