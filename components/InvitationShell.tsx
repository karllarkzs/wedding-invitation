"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { PAUSE_MUSIC, RESUME_MUSIC } from "@/lib/music-events";
import { BloomIntro } from "./BloomIntro";
import { InviteProvider } from "./InviteContext";
import { MusicToggle } from "./MusicToggle";
import { OpenedContext } from "./ui/Reveal";

type Props = {
  children: React.ReactNode;
  partnerOne: string;
  partnerTwo: string;
  shortDate: string;
  musicSrc: string | null;
};

const MUSIC_VOLUME = 0.55;

// A shared link straight to a section (e.g. /#rsvp) skips the envelope.
// Read once, when the page first loads, so in-page links don't affect it.
const noop = () => () => {};
const initialDeepLink = typeof window !== "undefined" && window.location.hash.length > 1;
const hasDeepLink = () => initialDeepLink;
const noDeepLinkOnServer = () => false;

/** Drops "#section" from the address bar so a refresh starts with the envelope again. */
function clearHash() {
  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}

/**
 * Client wrapper for the invitation: the blooming opening, scroll lock while
 * it's showing, and optional background music (started only by the tap).
 */
export function InvitationShell({ children, partnerOne, partnerTwo, shortDate, musicSrc }: Props) {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const deepLinked = useSyncExternalStore(noop, hasDeepLink, noDeepLinkOnServer);
  const opened = envelopeOpened || deepLinked;
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const resumeOnVisible = useRef(false);

  const markOpened = useCallback(() => setEnvelopeOpened(true), []);

  // Keep the address clean: after an in-page link (Scroll, Kindly reply…) or a
  // shared deep link has done its jump, remove the "#…" so refreshing shows the
  // envelope opening again.
  useEffect(() => {
    const timer = window.setTimeout(clearHash, 1200);
    window.addEventListener("hashchange", clearHash);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", clearHash);
    };
  }, []);

  // Lock page scroll until the envelope is opened.
  useEffect(() => {
    if (opened) return;
    const { documentElement: html, body } = document;
    const prev = [html.style.overflow, body.style.overflow];
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev[0];
      body.style.overflow = prev[1];
    };
  }, [opened]);

  const fadeIn = (audio: HTMLAudioElement) => {
    audio.volume = 0;
    const started = performance.now();
    const step = (now: number) => {
      // clamp: the first frame's timestamp can be a hair earlier than `started`
      const p = Math.min(1, Math.max(0, (now - started) / 2500));
      audio.volume = MUSIC_VOLUME * p;
      if (p < 1 && !audio.paused) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => {
        setPlaying(true);
        fadeIn(audio);
      })
      .catch(() => setPlaying(false));
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    pausedForVideo.current = false;
    if (audio.paused) play();
    else {
      audio.pause();
      setPlaying(false);
    }
  };

  // The prenup teaser pauses the song while it plays, and hands it back when it ends.
  const pausedForVideo = useRef(false);
  useEffect(() => {
    const onPause = () => {
      const audio = audioRef.current;
      if (!audio || audio.paused) return;
      pausedForVideo.current = true;
      audio.pause();
      setPlaying(false);
    };
    const onResume = () => {
      if (!pausedForVideo.current) return;
      pausedForVideo.current = false;
      play();
    };
    window.addEventListener(PAUSE_MUSIC, onPause);
    window.addEventListener(RESUME_MUSIC, onResume);
    return () => {
      window.removeEventListener(PAUSE_MUSIC, onPause);
      window.removeEventListener(RESUME_MUSIC, onResume);
    };
  }, [play]);

  // Pause when the tab is hidden; resume when the guest comes back.
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden && !audio.paused) {
        resumeOnVisible.current = true;
        audio.pause();
      } else if (!document.hidden && resumeOnVisible.current) {
        resumeOnVisible.current = false;
        audio.play().catch(() => setPlaying(false));
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <InviteProvider>
        <OpenedContext.Provider value={opened}>
          <AnimatePresence>
            {!opened && (
              <BloomIntro
                key="intro"
                partnerOne={partnerOne}
                partnerTwo={partnerTwo}
                shortDate={shortDate}
                onOpenStart={play}
                onOpened={markOpened}
              />
            )}
          </AnimatePresence>

          {/* overflow-x-clip: decorative glows may extend past the screen edge without causing sideways panning */}
          <div inert={!opened} className="overflow-x-clip">
            {children}
          </div>

          {musicSrc && (
            <>
              <audio ref={audioRef} src={musicSrc} loop preload="none" />
              {opened && <MusicToggle playing={playing} onToggle={toggleMusic} />}
            </>
          )}
        </OpenedContext.Provider>
      </InviteProvider>
    </MotionConfig>
  );
}
