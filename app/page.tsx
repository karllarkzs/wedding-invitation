import { wedding } from "@/config/wedding.config";
import { listPublicImages, publicFileExists } from "@/lib/assets";
import { googleCalendarUrl } from "@/lib/calendar";
import { ceremonyStart, formatLongDate, formatShortDate } from "@/lib/datetime";
import { videoEmbedUrl } from "@/lib/video";
import { WaveDivider } from "@/components/art/Ornaments";
import { InvitationShell } from "@/components/InvitationShell";
import { Countdown } from "@/components/sections/Countdown";
import { DressCode } from "@/components/sections/DressCode";
import { Footer } from "@/components/sections/Footer";
import { GallerySection } from "@/components/sections/GallerySection";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { OurStory } from "@/components/sections/OurStory";
import { Program } from "@/components/sections/Program";
import { Rsvp } from "@/components/sections/Rsvp";
import { Venues } from "@/components/sections/Venues";

export default function Home() {
  // Which photos exist in /public? (sync file checks → resolved at build time)
  const venuePhotos = {
    ceremony: publicFileExists(wedding.ceremony.photo),
    reception: publicFileExists(wedding.reception.photo),
  };
  const journeyPhotos = Object.fromEntries(
    wedding.journey.chapters.flatMap((c) =>
      "folder" in c ? [[c.folder, listPublicImages(`/images/story/${c.folder}`, { recursive: true })]] : [],
    ),
  );
  const prenupPhotos = listPublicImages(wedding.gallery.folder);
  const musicSrc = publicFileExists(wedding.music.src) ? wedding.music.src : null;
  const { teaser } = wedding;
  const teaserVideo = {
    embedSrc: teaser.link ? videoEmbedUrl(teaser.link) : null,
    file: teaser.file && publicFileExists(teaser.file) ? teaser.file : null,
    poster: teaser.poster && publicFileExists(teaser.poster) ? teaser.poster : (prenupPhotos[1] ?? prenupPhotos[0] ?? null),
  };

  return (
    <InvitationShell
      partnerOne={wedding.couple.partnerOne}
      partnerTwo={wedding.couple.partnerTwo}
      shortDate={formatShortDate(wedding.date)}
      musicSrc={musicSrc}
    >
      <main>
        <Hero />
        <Countdown
          target={ceremonyStart.toISOString()}
          googleCalendarUrl={googleCalendarUrl}
          dateLabel={formatLongDate(wedding.date)}
        />
        <WaveDivider />
        <OurStory photoAvailable={publicFileExists(wedding.story.photo)} />
        <Journey photosByChapter={journeyPhotos} />
        <GallerySection images={prenupPhotos} teaser={teaserVideo} />
        <WaveDivider />
        <Venues photos={venuePhotos} />
        <Program />
        <DressCode />
        <WaveDivider />
        <Rsvp />
      </main>
      <Footer />
    </InvitationShell>
  );
}
