import type { Guest, RsvpRow } from "@/lib/sheets";

/** One line of the admin guest list: a guest and their reply (if any). */
export type AdminRow = {
  key: string;
  name: string;
  /** Their part in the wedding, from the Role column ("" if none). */
  role: string;
  /** Personal link code ("" for a reply whose guest was removed from the list). */
  code: string;
  plusOneAllowed: boolean;
  onList: boolean;
  /** Has a row in the RSVPs tab (a reply, or the row Refresh adds for family/entourage). */
  inRsvpTab: boolean;
  /** "family" and "entourage": no RSVP needed, their seat is saved automatically. */
  status: "yes" | "no" | "waiting" | "family" | "entourage";
  /** The +1 who's coming: from the guest's reply, or (family/entourage, who don't reply) from the guest list. */
  plusOneName: string;
  /** The +1 named on the guest list, for guests who haven't replied yet. */
  expectedPlusOne: string;
  message: string;
  repliedAt: string;
};

/** Joins the guest list with the replies (by code). Replies from removed guests are kept, flagged. */
export function buildAdminRows(guests: Guest[], rsvps: RsvpRow[]): AdminRow[] {
  const byCode = new Map(rsvps.filter((r) => r.code).map((r) => [r.code, r]));
  const listed = new Set(guests.map((g) => g.code));

  const rows: AdminRow[] = guests.map((g) => {
    const r = byCode.get(g.code);
    const noRsvp = g.group !== "guest";
    return {
      key: `g${g.row}`,
      name: g.name,
      role: g.role,
      code: g.code,
      plusOneAllowed: g.plusOne && g.group === "guest",
      onList: true,
      inRsvpTab: Boolean(r),
      status: g.group !== "guest" ? g.group : r ? (r.attending ? "yes" : "no") : "waiting",
      // family/entourage don't reply, so a +1 on the list counts as coming
      plusOneName: noRsvp ? g.plusOneName || (g.plusOne ? "+1" : "") : r?.attending ? r.plusOneName : "",
      expectedPlusOne: !noRsvp && !r ? g.plusOneName : "",
      message: r?.message ?? "",
      repliedAt: r?.timestamp ?? "",
    };
  });

  for (const r of rsvps) {
    if (r.code && listed.has(r.code)) continue;
    rows.push({
      key: `r${r.row}`,
      name: r.name,
      role: "",
      code: "",
      plusOneAllowed: Boolean(r.plusOneName),
      onList: false,
      inRsvpTab: true,
      status: r.attending ? "yes" : "no",
      plusOneName: r.attending ? r.plusOneName : "",
      expectedPlusOne: "",
      message: r.message,
      repliedAt: r.timestamp,
    });
  }
  return rows;
}
