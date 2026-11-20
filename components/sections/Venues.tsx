import { wedding } from "@/config/wedding.config";
import { formatTime, mapsEmbedUrl, mapsSearchUrl } from "@/lib/datetime";
import { Flourish } from "@/components/art/Ornaments";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { Unveil } from "@/components/ui/Unveil";

type Venue = (typeof wedding)["ceremony"] | (typeof wedding)["reception"];

/** Gently arched window (flatter than a semicircle), for the venue photo. */
const ARCH = "rounded-[50%_50%_14px_14px/38%_38%_14px_14px]";
const ARCH_INNER = "rounded-[50%_50%_9px_9px/38%_38%_9px_9px]";

function VenueCard({ venue, photoAvailable, delay }: { venue: Venue; photoAvailable: boolean; delay: number }) {
  const time = formatTime(venue.time);
  return (
    <Reveal
      as="article"
      delay={delay}
      className="paper-card relative flex flex-col px-4 pb-8 pt-4 text-center sm:px-6 sm:pb-10 sm:pt-6"
    >
      <div aria-hidden="true" className="hairline-inset rounded-[20px]" />

      {/* arched photo window */}
      <div className={`relative aspect-[5/4] overflow-hidden bg-ivory ${ARCH}`}>
        <Unveil delay={delay + 0.1}>
          <SmartImage
            src={venue.photo}
            alt={venue.name}
            available={photoAvailable}
            sizes="(min-width: 768px) 460px, 92vw"
            placeholderLabel={venue.name}
            placeholderClassName={ARCH}
            className="photo-tone"
          />
          <span aria-hidden="true" className="photo-tone-glow" />
        </Unveil>
        <span aria-hidden="true" className={`pointer-events-none absolute inset-[7px] border border-white/75 ${ARCH_INNER}`} />
      </div>

      <div className="relative flex flex-1 flex-col">
        <p className="mt-6 font-script text-[2.5rem] leading-none text-gold-deep sm:text-[2.8rem]">{venue.label}</p>
        <h3 className="mx-auto mt-3 max-w-xs text-balance text-[1.55rem] font-semibold leading-tight text-ink sm:text-[1.7rem]">
          {/* keep a dash attached to the word before it, so a line never starts with "–" */}
          {venue.name.replace(/ ([–—-]) /g, "\u00A0$1 ")}
        </h3>

        <div className="mt-4 flex items-center justify-center gap-3">
          <span aria-hidden="true" className="h-px w-10 bg-gold/55" />
          <p className="font-display text-[1.2rem] font-semibold tracking-[0.08em] text-gold-deep">
            <span className="sr-only">Starts at </span>
            {time}
          </p>
          <span aria-hidden="true" className="h-px w-10 bg-gold/55" />
        </div>

        <address className="mx-auto mt-3 max-w-[19rem] text-balance text-[1.06rem] leading-snug text-ink-soft">
          {venue.address}
        </address>

        {/* the map, framed like a postcard */}
        <div className="mt-auto pt-7">
          <div className="rounded-[18px] bg-white p-1.5 shadow-[0_14px_28px_-20px_rgba(70,63,82,0.5),inset_0_0_0_1px_rgba(180,152,103,0.3)]">
            <div className="overflow-hidden rounded-[13px] bg-ivory">
              <iframe
                title={`Map showing ${venue.name}`}
                src={mapsEmbedUrl(venue.name, venue.address)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-52 w-full border-0 [filter:grayscale(0.55)_sepia(0.22)_contrast(0.96)_brightness(1.04)]"
                allowFullScreen
              />
            </div>
          </div>

          <a
            href={mapsSearchUrl(venue.name, venue.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline mt-6"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4 text-gold-deep"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
              <circle cx="12" cy="10" r="2.3" />
            </svg>
            Open in Maps
            <span className="sr-only">(opens Google Maps in a new tab)</span>
          </a>
        </div>
      </div>
    </Reveal>
  );
}

export function Venues({ photos }: { photos: { ceremony: boolean; reception: boolean } }) {
  return (
    <section id="venues" aria-labelledby="venues-title" className="band band-ivory px-4 py-20 sm:py-28">
      <SectionHeading id="venues-title" title="Ceremony & Reception" subtitle="where to find us" />

      <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2 md:gap-10">
        <VenueCard venue={wedding.ceremony} photoAvailable={photos.ceremony} delay={0} />
        <VenueCard venue={wedding.reception} photoAvailable={photos.reception} delay={0.12} />
      </div>

      <Reveal className="mx-auto mt-14 max-w-xl text-center">
        <Flourish className="mx-auto" />
        <p className="mt-4 font-script text-[2.3rem] leading-none text-ink">A gentle note</p>
        <p className="mx-auto mt-3 max-w-md text-balance italic leading-relaxed text-ink-soft">{wedding.venueNote}</p>
      </Reveal>
    </section>
  );
}
