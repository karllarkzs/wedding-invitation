import { wedding } from "@/config/wedding.config";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EntourageMore } from "./EntourageMore";

type Names = readonly string[];
const e = wedding.entourage;

/** A column label: "Parents of the Groom", "Best Man", "Veil"… */
const LABEL =
  "font-display text-[0.66rem] font-semibold uppercase leading-snug tracking-[0.15em] text-gold-deep sm:text-[0.74rem] sm:tracking-[0.2em]";
/** A heading over a whole group: "Principal Sponsors", "Secondary Sponsors", "Offertory". */
const TITLE = "text-center font-display text-[0.95rem] font-semibold uppercase tracking-[0.24em] text-ink sm:text-[1.05rem]";
const NAME = "text-[0.95rem] leading-snug text-ink sm:text-[1.1rem]";

type Column = { label: string; names: Names; note?: string };
const ALIGN = { left: "text-right", right: "text-left", center: "text-center" } as const;

function NameColumn({ label, names, note, side }: Column & { side: keyof typeof ALIGN }) {
  if (!names.length) return <div />;
  return (
    <div className={ALIGN[side]}>
      <p className={`${LABEL} text-balance`}>{label}</p>
      <ul className="mt-1.5 space-y-0.5">
        {names.map((name) => (
          <li key={name} className={`${NAME} text-balance`}>
            {name}
          </li>
        ))}
      </ul>
      {note && <p className="mt-0.5 text-balance text-[0.85rem] italic leading-snug text-ink-soft sm:text-[0.95rem]">{note}</p>}
    </div>
  );
}

/**
 * Two columns facing each other across the middle, as on the printed
 * invitation: the groom's side on the left (aligned right), the bride's side
 * on the right (aligned left). Stays side by side on phones too.
 */
function Facing({ left, right }: { left: Column; right: Column }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8">
      <NameColumn {...left} side="left" />
      <NameColumn {...right} side="right" />
    </div>
  );
}

/** Two or three short, centred columns under an optional heading: Veil | Cord | Candle… */
function Row({ title, columns }: { title?: string; columns: Column[] }) {
  const shown = columns.filter((c) => c.names.length);
  const cols = shown.length >= 3 ? "grid-cols-3" : shown.length === 2 ? "grid-cols-2" : "grid-cols-1";
  return (
    <div>
      {title && <p className={TITLE}>{title}</p>}
      <div className={`grid gap-x-3 gap-y-6 sm:gap-x-6 ${cols} ${title ? "mt-3" : ""}`}>
        {shown.map((c) => (
          <NameColumn key={c.label} {...c} side="center" />
        ))}
      </div>
    </div>
  );
}

/** Principal sponsors: each pair on one line, gentleman | lady, meeting in the middle. */
function Sponsors({ pairs }: { pairs: readonly (readonly [string, string])[] }) {
  return (
    <div>
      <p className={TITLE}>Principal Sponsors</p>
      <ul className="mt-3 space-y-1.5 sm:space-y-1">
        {pairs.map(([a, b]) => (
          <li key={`${a}|${b}`} className={`grid grid-cols-2 gap-x-4 sm:gap-x-8 ${NAME}`}>
            <span className="text-balance text-right">{a}</span>
            <span className="sr-only"> and </span>
            <span className="text-balance text-left">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const nonEmpty = (...lists: Names[]) => lists.some((l) => l.length > 0);
const assisted = (name: string) => (name ? `assisted by ${name}` : undefined);

/** Shows the parts that have names, each fading in, a little apart (more room before a group heading). */
function Parts({ parts }: { parts: { key: string; filled: boolean; titled?: boolean; node: React.ReactNode }[] }) {
  return parts
    .filter((p) => p.filled)
    .map((p, i) => (
      <Reveal key={p.key} y={16} delay={0.05} className={i === 0 ? "" : p.titled ? "mt-10" : "mt-7"}>
        {p.node}
      </Reveal>
    ));
}

/** The wedding party, from `entourage` in the config, laid out like the printed invitation. */
export function Entourage() {
  const gm = e.grandmothers;
  const ss = e.secondarySponsors;
  const first = [
    {
      key: "parents",
      filled: nonEmpty(e.parents.groom, e.parents.bride),
      node: (
        <Facing
          left={{ label: "Parents of the Groom", names: e.parents.groom }}
          right={{ label: "Parents of the Bride", names: e.parents.bride }}
        />
      ),
    },
    {
      key: "grandmothers",
      filled: Boolean(gm.groom.name || gm.bride.name),
      node: (
        <Facing
          left={{ label: "Grandmother of the Groom", names: gm.groom.name ? [gm.groom.name] : [], note: assisted(gm.groom.assistedBy) }}
          right={{ label: "Grandmother of the Bride", names: gm.bride.name ? [gm.bride.name] : [], note: assisted(gm.bride.assistedBy) }}
        />
      ),
    },
  ];

  const more = [
    { key: "sponsors", titled: true, filled: e.principalSponsors.length > 0, node: <Sponsors pairs={e.principalSponsors} /> },
    {
      key: "honor",
      titled: true,
      filled: nonEmpty(e.bestMan, e.maidOfHonor),
      node: <Facing left={{ label: "Best Man", names: e.bestMan }} right={{ label: "Maid of Honor", names: e.maidOfHonor }} />,
    },
    {
      key: "party",
      filled: nonEmpty(e.groomsmen, e.bridesmaids),
      node: <Facing left={{ label: "Groomsmen", names: e.groomsmen }} right={{ label: "Bridesmaids", names: e.bridesmaids }} />,
    },
    {
      key: "secondary",
      titled: true,
      filled: nonEmpty(ss.veil, ss.cord, ss.candle),
      node: (
        <Row
          title="Secondary Sponsors"
          columns={[
            { label: "Veil", names: ss.veil },
            { label: "Cord", names: ss.cord },
            { label: "Candle", names: ss.candle },
          ]}
        />
      ),
    },
    {
      key: "bearers",
      filled: nonEmpty(e.bearers.ring, e.bearers.coin, e.bearers.bible),
      node: (
        <Row
          columns={[
            { label: "Ring Bearer", names: e.bearers.ring },
            { label: "Coin Bearer", names: e.bearers.coin },
            { label: "Bible Bearer", names: e.bearers.bible },
          ]}
        />
      ),
    },
    {
      key: "little",
      filled: nonEmpty(e.littleBrides, e.flowerGirls),
      node: (
        <Row
          columns={[
            { label: "Little Bride", names: e.littleBrides },
            { label: "Flower Girls", names: e.flowerGirls },
          ]}
        />
      ),
    },
    {
      key: "offertory",
      titled: true,
      filled: nonEmpty(e.offertory.wine, e.offertory.bread, e.offertory.fruits),
      node: (
        <Row
          title="Offertory"
          columns={[
            { label: "Wine", names: e.offertory.wine },
            { label: "Bread", names: e.offertory.bread },
            { label: "Fruits", names: e.offertory.fruits },
          ]}
        />
      ),
    },
  ];

  const hasFirst = first.some((p) => p.filled);
  const hasMore = more.some((p) => p.filled);
  if (!hasFirst && !hasMore) return null;

  return (
    <section id="entourage" aria-labelledby="entourage-title" className="band band-ivory px-4 py-16 sm:py-28">
      <SectionHeading id="entourage-title" title="The Entourage" subtitle="standing beside us" />
      <Reveal className="mx-auto mt-10 max-w-2xl sm:mt-12">
        <div className="paper-card relative px-3.5 py-10 sm:px-12 sm:py-14">
          <div className="hairline-inset rounded-[20px]" />
          <div className="relative">
            {hasFirst && <Parts parts={first} />}
            {hasMore &&
              (hasFirst ? (
                <EntourageMore teaser="Principal sponsors, the wedding party, bearers and more">
                  <div aria-hidden="true" className="my-8 flex items-center justify-center gap-2.5">
                    <span className="h-px w-12 bg-gold/40" />
                    <span className="size-1.5 rotate-45 bg-gold/70" />
                    <span className="h-px w-12 bg-gold/40" />
                  </div>
                  <Parts parts={more} />
                </EntourageMore>
              ) : (
                <Parts parts={more} />
              ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
