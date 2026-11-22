import { wedding } from "@/config/wedding.config";
import { coupleNames, monogramText } from "@/lib/datetime";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Gallery } from "./Gallery";
import { Teaser } from "./Teaser";

export type TeaserVideo = { embedSrc: string | null; file: string | null; poster: string | null };

export function GallerySection({ images, teaser }: { images: string[]; teaser: TeaserVideo }) {
  const teaserReady = Boolean(teaser.embedSrc || teaser.file);
  const showTeaser = teaserReady || wedding.teaser.showWhenMissing;
  if (images.length === 0 && !teaserReady && !wedding.gallery.showWhenEmpty) return null;

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="px-4 py-16 sm:py-28">
      <SectionHeading id="gallery-title" title={wedding.gallery.title} subtitle="moments we'll treasure" />
      {(images.length > 0 || wedding.gallery.showWhenEmpty) && (
        <Gallery images={images} names={coupleNames} monogram={monogramText} caption={wedding.gallery.caption} />
      )}
      {showTeaser && (
        <Teaser
          title={wedding.teaser.title}
          embedSrc={teaser.embedSrc}
          file={teaser.file}
          poster={teaser.poster}
          vertical={wedding.teaser.vertical}
          monogram={monogramText}
        />
      )}
    </section>
  );
}
