"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CARTOUCHE, Cartouche } from "@/components/art/Cartouche";

type Focus = { x: number; y: number; zoom: number };

type Props = {
  src: string;
  alt: string;
  /** Focal point (percent) and zoom so the oval frames the couple. */
  focus: Focus;
  monogram: string;
  hint?: string;
  /** Decorations drawn around the oval (e.g. a eucalyptus sprig). */
  children?: React.ReactNode;
};

/** Share of the oval that must be scratched before the rest fades away. */
const REVEAL_AT = 0.45;
/** Oval width on screen (px) — used to request a sharp enough image. */
const OVAL_WIDTH = 290;

const FOIL_STOPS: [number, string][] = [
  [0, "#F8F1E1"],
  [0.3, "#EBDDBB"],
  [0.52, "#FBF6EA"],
  [0.75, "#E4CF9F"],
  [1, "#F5EBD6"],
];
const FOIL_CSS = `linear-gradient(135deg, ${FOIL_STOPS.map(([o, c]) => `${c} ${o * 100}%`).join(", ")})`;

/** Paints the pearl-and-gold foil with a pressed monogram and the hint. */
function paintFoil(ctx: CanvasRenderingContext2D, w: number, h: number, monogram: string, hint: string) {
  ctx.globalCompositeOperation = "source-over";
  const foil = ctx.createLinearGradient(0, 0, w, h);
  FOIL_STOPS.forEach(([o, c]) => foil.addColorStop(o, c));
  ctx.fillStyle = foil;
  ctx.fillRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, Math.max(w, h) * 0.6);
  glow.addColorStop(0, "rgba(255,255,255,0.55)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // fine foil speckle (deterministic)
  ctx.fillStyle = "rgba(180,152,103,0.2)";
  for (let i = 0; i < 320; i++) {
    ctx.fillRect((((i * 73) % 997) / 997) * w, (((i * 151) % 991) / 991) * h, 1, 1);
  }

  const css = getComputedStyle(document.documentElement);
  const script = css.getPropertyValue("--font-script-face").trim() || "cursive";
  const serif = css.getPropertyValue("--font-cormorant").trim() || "Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // monogram, pressed into the foil
  const my = h * 0.44;
  ctx.font = `${Math.round(w * 0.23)}px ${script}`;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(monogram, w / 2 - 1, my - 1.2);
  ctx.fillStyle = "rgba(132,105,62,0.35)";
  ctx.fillText(monogram, w / 2 + 1, my + 1.4);
  ctx.fillStyle = "#D8C293";
  ctx.fillText(monogram, w / 2, my);

  // hint + hairline
  ctx.font = `600 ${Math.max(9, Math.round(w * 0.04))}px ${serif}`;
  ctx.fillStyle = "#84693E";
  ctx.fillText(hint.toUpperCase().split("").join(" "), w / 2, h * 0.6);
  ctx.strokeStyle = "rgba(180,152,103,0.7)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(w / 2 - w * 0.12, h * 0.655);
  ctx.lineTo(w / 2 + w * 0.12, h * 0.655);
  ctx.stroke();
}

const SPARKLES = [
  { x: "8%", y: "18%", d: 0 },
  { x: "88%", y: "12%", d: 0.12 },
  { x: "96%", y: "58%", d: 0.24 },
  { x: "4%", y: "70%", d: 0.18 },
  { x: "52%", y: "-2%", d: 0.3 },
  { x: "70%", y: "96%", d: 0.06 },
];

/**
 * The couple photo in an oval, covered by a pearl-and-gold foil guests can
 * scratch away. Once about half is cleared the foil fades out by itself;
 * "Tap to reveal" does the same for anyone who'd rather not scratch.
 */
export function ScratchPortrait({ src, alt, focus, monogram, hint = "Scratch to see us", children }: Props) {
  const ovalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef(false);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const lastCheckRef = useRef(0);
  const [painted, setPainted] = useState(false);
  const [started, setStarted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Paint the foil (and repaint on resize until the guest starts scratching).
  useEffect(() => {
    const oval = ovalRef.current;
    const canvas = canvasRef.current;
    if (!oval || !canvas) return;
    let cancelled = false;
    const paint = async () => {
      try {
        await document.fonts.ready;
      } catch {
        /* fonts API unavailable — paint with fallbacks */
      }
      if (cancelled || startedRef.current) return;
      const { width, height } = oval.getBoundingClientRect();
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintFoil(ctx, width, height, monogram, hint);
      setPainted(true);
    };
    paint();
    const observer = new ResizeObserver(() => paint());
    observer.observe(oval);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [monogram, hint]);

  const ctx = () => canvasRef.current?.getContext("2d", { willReadFrequently: true }) ?? null;

  const scratch = (from: { x: number; y: number }, to: { x: number; y: number }, width: number) => {
    const c = ctx();
    if (!c) return;
    c.globalCompositeOperation = "destination-out";
    c.lineCap = "round";
    c.lineJoin = "round";
    c.lineWidth = Math.max(22, width * 0.13);
    c.beginPath();
    c.moveTo(from.x, from.y);
    c.lineTo(to.x + 0.01, to.y);
    c.stroke();
  };

  // How much of the oval (not the hidden corners) has been cleared?
  const checkCleared = () => {
    const canvas = canvasRef.current;
    const c = ctx();
    if (!canvas || !c || !canvas.width) return;
    const { width: W, height: H } = canvas;
    const data = c.getImageData(0, 0, W, H).data;
    let inside = 0;
    let cleared = 0;
    for (let y = 0; y < H; y += 8) {
      for (let x = 0; x < W; x += 8) {
        const dx = (x - W / 2) / (W / 2);
        const dy = (y - H / 2) / (H / 2);
        if (dx * dx + dy * dy > 1) continue;
        inside++;
        if (data[(y * W + x) * 4 + 3] < 128) cleared++;
      }
    }
    if (inside && cleared / inside >= REVEAL_AT) setRevealed(true);
  };

  const pointFrom = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, width: r.width };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    if (!startedRef.current) {
      startedRef.current = true;
      setStarted(true);
    }
    const p = pointFrom(e);
    lastRef.current = p;
    scratch(p, p, p.width);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const p = pointFrom(e);
    scratch(lastRef.current ?? p, p, p.width);
    lastRef.current = p;
    const now = e.timeStamp;
    if (now - lastCheckRef.current > 220) {
      lastCheckRef.current = now;
      checkCleared();
    }
  };
  const onPointerEnd = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastRef.current = null;
    checkCleared();
  };

  const { x, y, zoom } = focus;

  return (
    <div>
      <div className="relative">
        <div className="relative">
          <div
            ref={ovalRef}
            className="relative aspect-[4/5] overflow-hidden rounded-[50%] bg-ivory shadow-[0_24px_50px_-28px_rgba(70,63,82,0.45)]"
          >
            {/* the photo, zoomed and centered on the couple */}
            <div
              className="absolute inset-0"
              style={{ transform: `translate(${50 - x}%, ${50 - y}%) scale(${zoom})`, transformOrigin: `${x}% ${y}%` }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                quality={90}
                sizes={`${Math.ceil(OVAL_WIDTH * 1.25 * zoom)}px`}
                className="object-cover"
                style={{ objectPosition: `${x}% ${y}%` }}
              />
            </div>

            {/* static foil until the canvas is painted (no peeking) */}
            {!painted && (
              <div
                aria-hidden="true"
                className="scratch-cover absolute inset-0 grid place-items-center"
                style={{ backgroundImage: FOIL_CSS }}
              >
                <span className="font-script text-[4.6rem] leading-none text-[#D8C293] [text-shadow:-1px_-1px_0_rgba(255,255,255,0.85),1px_1.4px_0_rgba(132,105,62,0.35)]">
                  {monogram}
                </span>
              </div>
            )}

            <AnimatePresence>
              {!revealed && (
                <motion.canvas
                  key="foil"
                  ref={canvasRef}
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerEnd}
                  onPointerCancel={onPointerEnd}
                  onLostPointerCapture={onPointerEnd}
                  exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
                />
              )}
            </AnimatePresence>

            {!started && !revealed && <span aria-hidden="true" className="scratch-shimmer pointer-events-none absolute inset-0" />}
          </div>

          {/* the sculpted frame, sized so its opening sits exactly on the oval */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{
              left: `${(-(CARTOUCHE.cx - CARTOUCHE.rx) / (CARTOUCHE.rx * 2)) * 100}%`,
              top: `${(-(CARTOUCHE.cy - CARTOUCHE.ry) / (CARTOUCHE.ry * 2)) * 100}%`,
              width: `${(CARTOUCHE.w / (CARTOUCHE.rx * 2)) * 100}%`,
              height: `${(CARTOUCHE.h / (CARTOUCHE.ry * 2)) * 100}%`,
            }}
          >
            <Cartouche className="h-full w-full" />
          </div>

          {/* a few gold sparkles when the photo is revealed */}
          <AnimatePresence>
            {revealed &&
              SPARKLES.map((s, i) => (
                <motion.svg
                  key={i}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="pointer-events-none absolute size-4 text-gold"
                  style={{ left: s.x, top: s.y }}
                  initial={{ opacity: 0, scale: 0.2 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.2, 1.1, 0.6] }}
                  transition={{ duration: 1.4, delay: 0.25 + s.d }}
                >
                  <path
                    d="M12 2c.6 5.4 3.6 8.4 10 10-6.4 1.6-9.4 4.6-10 10-.6-5.4-3.6-8.4-10-10 6.4-1.6 9.4-4.6 10-10Z"
                    fill="currentColor"
                  />
                </motion.svg>
              ))}
          </AnimatePresence>
        </div>
        {children}
      </div>

      {/* sits below the frame's lower ornament (≈21% of the oval height, as % of width) */}
      <div className="flex h-6 justify-center" style={{ marginTop: "30%" }}>
        {!revealed && (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="link-hairline text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink-soft hover:text-ink"
          >
            Tap to reveal
          </button>
        )}
      </div>
    </div>
  );
}
