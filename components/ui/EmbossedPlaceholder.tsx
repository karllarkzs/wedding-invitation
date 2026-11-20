import { Eucalyptus } from "@/components/art/Eucalyptus";

type Props = {
  label: string;
  /** Script text shown large (e.g. the monogram). Defaults to the label in serif. */
  script?: string;
  sublabel?: string;
  className?: string;
};

/**
 * Elegant stand-in for a photo that hasn't been added yet:
 * an ivory sheet with a pressed frame, embossed eucalyptus and the place name.
 */
export function EmbossedPlaceholder({ label, script, sublabel, className = "" }: Props) {
  return (
    <div
      role="img"
      aria-label={sublabel ? `${label} — ${sublabel}` : label}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#fcf8ef] to-[#f7f0e2] ${className}`}
    >
      <div className="deboss-well absolute inset-3 rounded-[inherit]" style={{ borderRadius: "inherit" }} />
      <Eucalyptus spray="corner" tone="emboss" className="absolute -bottom-3 -left-3 w-[42%] max-w-44" />
      <Eucalyptus
        spray="corner"
        tone="emboss"
        className="absolute -right-3 -top-3 w-[34%] max-w-36"
        style={{ transform: "rotate(180deg)" }}
      />
      <div className="relative px-8 text-center">
        {script ? (
          <p className="emboss-text font-script text-6xl leading-none sm:text-7xl">{script}</p>
        ) : (
          <p className="emboss-text text-balance text-[1.35rem] font-semibold uppercase leading-snug tracking-[0.14em] sm:text-[1.6rem]">{label}</p>
        )}
        {sublabel && (
          <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#968767]">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
