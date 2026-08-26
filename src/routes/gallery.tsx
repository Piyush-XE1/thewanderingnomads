import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { useContent } from "@/lib/cms/useContent";

import gCampfire from "@/assets/gallery-campfire.jpg";
import gTrail from "@/assets/gallery-trail.jpg";
import gLocal from "@/assets/gallery-local.jpg";
import gPines from "@/assets/gallery-pines.jpg";
import gLake from "@/assets/gallery-lake.jpg";
import gVillage from "@/assets/gallery-village.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — The Wandering Nomads" },
      {
        name: "description",
        content: "Photographs from community trips across the Himalayas and India.",
      },
      { property: "og:title", content: "Gallery — The Wandering Nomads" },
      { property: "og:description", content: "Field photographs from past expeditions." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

const FALLBACK = [
  { src: gCampfire, loc: "Campfire · high camp" },
  { src: gTrail, loc: "Pine trail · Himachal" },
  { src: gLake, loc: "Alpine lake · Spiti" },
  { src: gLocal, loc: "Local host · Kashmir" },
  { src: gPines, loc: "Deodar canopy · Jibhi" },
  { src: gVillage, loc: "Stone village · Uttarakhand" },
];

function GalleryPage() {
  const { gallery: cmsGallery } = useContent();
  const images =
    cmsGallery.length > 0
      ? cmsGallery.map((g) => ({
          src: g.url,
          loc: g.caption ?? g.location ?? g.alt_text ?? "",
        }))
      : FALLBACK;

  return (
    <SiteLayout>
      <main className="pt-36 pb-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="eyebrow">Gallery</p>
            <h1 className="display mt-4 max-w-3xl text-5xl leading-[1.02] sm:text-6xl md:text-7xl">
              From the road,
              <br />
              <em className="italic text-muted-foreground">not the brochure.</em>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-muted-foreground">
              Stills from community trips — the light, the kitchens, the quiet between destinations.
            </p>
          </Reveal>

          <div className="mt-14 grid auto-rows-[220px] grid-cols-2 gap-3 sm:auto-rows-[280px] md:grid-cols-3 md:gap-4">
            {images.map((g, i) => (
              <Reveal
                key={`${g.src}-${i}`}
                delay={i * 0.04}
                className={i % 5 === 0 ? "row-span-2" : ""}
              >
                <figure className="group relative h-full w-full overflow-hidden rounded-xl">
                  <img
                    src={g.src}
                    alt={g.loc || "Trip photograph"}
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  {g.loc ? (
                    <>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                      <figcaption className="pointer-events-none absolute bottom-3 left-3 translate-y-2 text-[11px] uppercase tracking-[0.18em] text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                        {g.loc}
                      </figcaption>
                    </>
                  ) : null}
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
    </SiteLayout>
  );
}
