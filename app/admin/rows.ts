import type { Guest, RsvpRow } from "@/lib/sheets";

/** One line of the admin guest list: a guest and their reply (if any). */
export type AdminRow = {
  key: string;
  name: string;
  /** Personal link code ("" for a reply whose guest was removed from the list). */
  code: string;
  plusOneAllowed: boolean;
  onList: boolean;
  status: "yes" | "no" | "waiting";
  plusOneName: string;
  message: string;
  repliedAt: string;
};

/** Joins the guest list with the replies (by code). Replies from removed guests are kept, flagged. */
export function buildAdminRows(guests: Guest[], rsvps: RsvpRow[]): AdminRow[] {
  const byCode = new Map(rsvps.filter((r) => r.code).map((r) => [r.code, r]));
  const listed = new Set(guests.map((g) => g.code));

  const rows: AdminRow[] = guests.map((g) => {
    const r = byCode.get(g.code);
    return {
      key: `g${g.row}`,
      name: g.name,
      code: g.code,
      plusOneAllowed: g.plusOne,
      onList: true,
      status: r ? (r.attending ? "yes" : "no") : "waiting",
      plusOneName: r?.attending ? r.plusOneName : "",
      message: r?.message ?? "",
      repliedAt: r?.timestamp ?? "",
    };
  });

  for (const r of rsvps) {
    if (r.code && listed.has(r.code)) continue;
    rows.push({
      key: `r${r.row}`,
      name: r.name,
      code: "",
      plusOneAllowed: Boolean(r.plusOneName),
      onList: false,
      status: r.attending ? "yes" : "no",
      plusOneName: r.attending ? r.plusOneName : "",
      message: r.message,
      repliedAt: r.timestamp,
    });
  }
  return rows;
}
