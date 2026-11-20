"use client";

import { useMemo, useState, useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createMissingLinks, logout } from "./actions";
import type { AdminRow } from "./rows";

type SortKey = "name" | "status" | "repliedAt";

// The phone's share sheet, where the browser offers one (checked after load, so server and browser agree).
const noop = () => () => {};
const canShareNow = () => typeof navigator.share === "function";
const cannotShareOnServer = () => false;
type Filter = "all" | "yes" | "no" | "waiting";

const STATUS_ORDER = { yes: 0, no: 1, waiting: 2 } as const;
const STATUS_LABEL = { yes: "Coming", no: "Declined", waiting: "Waiting" } as const;
const STATUS_STYLE = {
  yes: "bg-sage-wash text-sage-deep",
  no: "bg-pearl text-ink-soft",
  waiting: "bg-candle-soft text-gold-deep",
} as const;

type Props = {
  rows: AdminRow[];
  sheetUrl: string | null;
  /** The live site's address, if known; otherwise links use this browser's address. */
  siteUrl: string | null;
  error: string | null;
};

export function Dashboard({ rows, sheetUrl, siteUrl, error }: Props) {
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "name", dir: "asc" });
  const canShare = useSyncExternalStore(noop, canShareNow, cannotShareOnServer);
  const [notice, setNotice] = useState<string | null>(null);
  const needsLink = rows.filter((r) => r.onList && !r.code).length;

  const totals = useMemo(() => {
    const listed = rows.filter((r) => r.onList);
    const coming = rows.filter((r) => r.status === "yes");
    return {
      people: coming.length + coming.filter((r) => r.plusOneName).length,
      plusOnes: coming.filter((r) => r.plusOneName).length,
      declined: rows.filter((r) => r.status === "no").length,
      waiting: rows.filter((r) => r.status === "waiting").length,
      invited: listed.length,
      plusOnesAllowed: listed.filter((r) => r.plusOneAllowed).length,
    };
  }, [rows]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return [r.name, r.plusOneName, r.message].some((v) => v.toLowerCase().includes(q));
    });
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sort.key === "status") return (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) * dir || a.name.localeCompare(b.name);
      const av = a[sort.key];
      const bv = b[sort.key];
      if (sort.key === "repliedAt" && !av !== !bv) return av ? -1 : 1; // no reply yet: always last
      return av.localeCompare(bv, undefined, { numeric: true, sensitivity: "base" }) * dir;
    });
  }, [rows, query, filter, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "repliedAt" ? "desc" : "asc" }));

  const sortButton = (key: SortKey, label: string) => (
    <button
      type="button"
      onClick={() => toggleSort(key)}
      className="inline-flex items-center gap-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gold-deep hover:text-ink"
    >
      {label}
      <span aria-hidden="true" className="text-[0.7rem]">
        {sort.key === key ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}
      </span>
    </button>
  );
  const ariaSort = (key: SortKey) => (sort.key === key ? (sort.dir === "asc" ? "ascending" : "descending") : "none");
  const th = "px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gold-deep";

  return (
    <div className="mx-auto mt-8 max-w-6xl lining-nums">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {sheetUrl && (
          <a href={sheetUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            Open Google Sheet ↗
          </a>
        )}
        <button
          type="button"
          className="btn btn-outline"
          onClick={() =>
            startRefresh(async () => {
              // New guests get their codes here (one deliberate action), then the list reloads.
              const res = await createMissingLinks();
              setNotice(
                res.error ??
                  (res.added ? `Created ${res.added} new personal link${res.added === 1 ? "" : "s"}.` : "Up to date."),
              );
              router.refresh();
            })
          }
          disabled={refreshing}
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
        <form action={logout}>
          <button type="submit" className="btn text-ink-soft hover:text-ink">
            Log out
          </button>
        </form>
      </div>

      <p className="mx-auto mt-5 max-w-xl text-balance text-center text-[1rem] leading-relaxed text-ink-soft">
        Add guests in the <strong className="text-ink">Guests</strong> tab of the Google Sheet (their name, and{" "}
        <strong className="text-ink">Plus One</strong>: Yes or No), then press Refresh. Each new guest gets a personal link
        below.
      </p>
      {notice && (
        <p role="status" className="mt-3 text-center text-[0.95rem] font-semibold text-sage-deep">
          {notice}
        </p>
      )}
      {!error && needsLink > 0 && (
        <p className="mx-auto mt-4 max-w-xl rounded-2xl bg-candle-soft px-5 py-3 text-center text-[1rem] text-ink">
          {needsLink === 1 ? "1 new guest doesn't" : `${needsLink} new guests don't`} have a link yet. Press{" "}
          <strong>Refresh</strong> to create {needsLink === 1 ? "it" : "them"}.
        </p>
      )}

      {error ? (
        <p role="alert" className="mx-auto mt-8 max-w-xl rounded-2xl bg-[#fbeef0] px-5 py-4 text-wax shadow-[inset_0_0_0_1px_rgba(123,46,59,0.25)]">
          {error}
        </p>
      ) : (
        <>
          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
            {[
              { label: "Coming", value: totals.people, hint: totals.plusOnes ? `people, incl. ${totals.plusOnes} +1s` : "people" },
              { label: "Declined", value: totals.declined, hint: "guests" },
              { label: "Waiting", value: totals.waiting, hint: "no reply yet" },
              {
                label: "Invited",
                value: totals.invited,
                hint: totals.plusOnesAllowed ? `guests, ${totals.plusOnesAllowed} with a +1` : "guests",
              },
            ].map((t) => (
              <div key={t.label} className="paper-card px-3 py-5 text-center sm:py-7">
                <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-gold-deep sm:text-xs">{t.label}</dt>
                <dd className="mt-2 font-display text-4xl font-semibold tabular-nums text-ink sm:text-5xl">{t.value}</dd>
                <dd className="text-xs text-ink-soft sm:text-sm">{t.hint}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block sm:w-80">
              <span className="sr-only">Search guests</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, +1 or message…"
                className="field"
              />
            </label>
            <div role="radiogroup" aria-label="Filter guests" className="flex flex-wrap gap-2">
              {(
                [
                  ["all", "All"],
                  ["yes", "Coming"],
                  ["no", "Declined"],
                  ["waiting", "Waiting"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={filter === value}
                  onClick={() => setFilter(value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    filter === value
                      ? "bg-ink text-white"
                      : "bg-white text-ink-soft shadow-[inset_0_0_0_1px_rgba(180,152,103,0.5)] hover:bg-ivory"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="paper-card mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-[1rem]">
              <caption className="sr-only">Guest list and replies, {visible.length} shown</caption>
              <thead>
                <tr className="border-b border-gold/30">
                  <th scope="col" aria-sort={ariaSort("name")} className="px-4 py-3">
                    {sortButton("name", "Guest")}
                  </th>
                  <th scope="col" aria-sort={ariaSort("status")} className="px-4 py-3">
                    {sortButton("status", "Reply")}
                  </th>
                  <th scope="col" className={th}>
                    +1
                  </th>
                  <th scope="col" className={`${th} min-w-[14rem]`}>
                    Message
                  </th>
                  <th scope="col" aria-sort={ariaSort("repliedAt")} className="whitespace-nowrap px-4 py-3">
                    {sortButton("repliedAt", "Replied")}
                  </th>
                  <th scope="col" className={th}>
                    Personal link
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center italic text-ink-soft">
                      {rows.length === 0
                        ? "No guests yet. Add them in the Guests tab of the Google Sheet, then press Refresh."
                        : "No guests match your search."}
                    </td>
                  </tr>
                ) : (
                  visible.map((r) => (
                    <tr key={r.key} className="border-b border-gold/15 align-top last:border-0 even:bg-ivory/50">
                      <td className="px-4 py-3">
                        <span className="font-semibold">{r.name}</span>
                        <span className="mt-1 flex flex-wrap gap-1.5">
                          {r.onList && r.plusOneAllowed && (
                            <span className="rounded-full bg-candle-soft px-2 py-0.5 text-xs font-semibold text-gold-deep">+1 allowed</span>
                          )}
                          {!r.onList && (
                            <span className="rounded-full bg-[#fbeef0] px-2 py-0.5 text-xs font-semibold text-wax">Not on guest list</span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-sm font-semibold ${STATUS_STYLE[r.status]}`}>
                          {STATUS_LABEL[r.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink-soft">{r.plusOneName || "—"}</td>
                      <td className="px-4 py-3 text-ink-soft">{r.message || "—"}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm tabular-nums text-ink-soft">{r.repliedAt || "—"}</td>
                      <td className="px-4 py-3">
                        {r.code ? (
                          <CopyLink code={r.code} name={r.name} siteUrl={siteUrl} canShare={canShare} />
                        ) : r.onList ? (
                          <span className="text-sm italic text-gold-deep">Press Refresh</span>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

/** Copies a guest's personal link (and offers the phone's share sheet where available). */
function CopyLink({ code, name, siteUrl, canShare }: { code: string; name: string; siteUrl: string | null; canShare: boolean }) {
  const [copied, setCopied] = useState(false);
  const link = () => `${(siteUrl ?? window.location.origin).replace(/\/+$/, "")}/?i=${code}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(`Personal link for ${name}:`, link());
    }
  };

  const share = () => navigator.share({ title: "You're invited", url: link() }).catch(() => {});

  return (
    <span className="flex items-center gap-2 whitespace-nowrap">
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${name}'s personal link`}
        className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink shadow-[inset_0_0_0_1px_rgba(180,152,103,0.55)] transition hover:bg-ivory"
      >
        {copied ? "Copied ✓" : "Copy link"}
      </button>
      {canShare && (
        <button
          type="button"
          onClick={share}
          aria-label={`Share ${name}'s personal link`}
          className="grid size-8 place-items-center rounded-full bg-white text-ink shadow-[inset_0_0_0_1px_rgba(180,152,103,0.55)] transition hover:bg-ivory"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 15V3.5M7.5 8 12 3.5 16.5 8" />
            <path d="M5 12.5v6A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-6" />
          </svg>
        </button>
      )}
      <code className="text-xs tracking-wider text-ink-soft">{code}</code>
    </span>
  );
}
