import { Link } from "@tanstack/react-router";

import { Reveal } from "@/components/site/Reveal";
import { useContent } from "@/lib/cms/useContent";
import { RichText } from "@/components/site/RichText";

import krishAsset from "@/assets/krish-founder.png.asset.json";

const krishImg = krishAsset.url;

/** Compact founder band — the ~10% personal presence on an otherwise commercial site. */
export function FounderNote() {
  const { about } = useContent();
  const name = about?.founder_name ?? "Krishnakant Yadav";
  const title = about?.founder_title ?? "Founder & expedition host";
  const portrait = about?.founder_image_url ?? krishImg;

  return (
    <section className="relative bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="grid items-center gap-10 rounded-2xl bg-card border border-ink/6 p-6 shadow-[0_1px_3px_rgba(20,28,36,0.03)] sm:p-10 lg:grid-cols-[200px_1fr]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
              <img
                src={portrait}
                alt={name}
                className="h-full w-full object-cover object-[50%_28%]"
                loading="lazy"
              />
            </div>
            <div>
              <p className="eyebrow">A note from the founder</p>
              <h2 className="display mt-3 text-3xl sm:text-4xl">The trips are the point.</h2>
              {about?.biography ? (
                <RichText
                  html={about.biography}
                  className="mt-4 line-clamp-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground"
                />
              ) : (
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                  {name.split("—")[0].trim()} hosts the road we sell. Small groups, real places, and
                  a community that started because people asked to come along. The long version of
                  that story lives on the About page — this site is for the trips.
                </p>
              )}
              <p className="mt-3 text-[12px] uppercase tracking-[0.16em] text-muted-foreground">
                {title}
              </p>
              <Link
                to="/about"
                className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-forest hover:text-forest/80 transition-colors"
              >
                Read the story
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
