import { Filigree } from "@/components/art/Filigree";
import { Reveal } from "./Reveal";
import { ShimmerTitle } from "./ShimmerTitle";

type Props = {
  /** Small capitals above the title (optional). */
  eyebrow?: string;
  /** The section title, set in gold capitals. */
  title: string;
  /** A short italic line under the title, e.g. "to our forever". */
  subtitle?: React.ReactNode;
  intro?: React.ReactNode;
  id?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, subtitle, intro, id, className = "" }: Props) {
  return (
    <Reveal className={`mx-auto max-w-2xl text-center ${className}`}>
      {eyebrow && <p className="eyebrow text-balance">{eyebrow}</p>}
      <ShimmerTitle id={id} className={eyebrow ? "mt-3" : ""}>
        {title}
      </ShimmerTitle>
      {subtitle && <p className="mt-2 text-balance text-[1.3rem] italic leading-snug text-ink-soft">{subtitle}</p>}
      <Filigree className="mx-auto mt-4" />
      {intro && <div className="mx-auto mt-5 max-w-md text-balance text-ink-soft">{intro}</div>}
    </Reveal>
  );
}
