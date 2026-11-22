import "server-only";
import { google, type sheets_v4 } from "googleapis";
import { localTimestamp } from "./datetime";
import { newInviteCode } from "./invites";
import { normalizeCode, type GuestGroup, type Rsvp } from "./rsvp-schema";

/**
 * Two tabs in one Google Sheet:
 * - "Guests": your guest list. You fill in Name, Plus One (Yes/No), Plus One
 *   Name (if you already know who it is), and Group (Guest, Family or
 *   Entourage: family and entourage don't RSVP, their seat is saved automatically);
 *   the site fills in each guest's personal Code when you press Refresh in /admin.
 *   Role (optional) is shown on their invitation, e.g. "Principal Sponsors".
 * - "RSVPs": the replies, one row per guest (updated in place if they change it).
 */
export const GUESTS_TAB = "Guests";
export const SHEET_TAB = "RSVPs";
const GUEST_HEADERS = ["Name", "Plus One", "Plus One Name", "Group", "Code", "Role"];
const RSVP_HEADERS = ["Timestamp", "Name", "Attending", "Plus One", "Message", "Code"];
const range = (tab: string, a1: string) => `'${tab}'!${a1}`;

export class SheetsNotConfiguredError extends Error {
  constructor(missing: string[]) {
    super(`Google Sheets is not configured. Missing env vars: ${missing.join(", ")}`);
    this.name = "SheetsNotConfiguredError";
  }
}

/**
 * Accepts the private key however it was pasted: with real newlines, with
 * escaped "\n" sequences (typical in .env files and hosting dashboards),
 * and with or without wrapping quotes.
 */
function normalizePrivateKey(raw: string) {
  let key = raw.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
}

export function sheetsConfigured() {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SHEET_ID,
  );
}

/** Local preview without Google credentials: sample guests, and replies aren't saved. */
export function demoMode() {
  return !sheetsConfigured() && process.env.NODE_ENV !== "production";
}

export function sheetUrl() {
  const id = process.env.GOOGLE_SHEET_ID;
  return id ? `https://docs.google.com/spreadsheets/d/${id}/edit` : null;
}

let client: { sheets: sheets_v4.Sheets; spreadsheetId: string } | null = null;

function getClient() {
  if (client) return client;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const missing = [
    !email && "GOOGLE_SERVICE_ACCOUNT_EMAIL",
    !key && "GOOGLE_PRIVATE_KEY",
    !spreadsheetId && "GOOGLE_SHEET_ID",
  ].filter(Boolean) as string[];
  if (missing.length) throw new SheetsNotConfiguredError(missing);

  const auth = new google.auth.JWT({
    email,
    key: normalizePrivateKey(key!),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  client = { sheets: google.sheets({ version: "v4", auth }), spreadsheetId: spreadsheetId! };
  return client;
}

let tabsReady: Promise<void> | null = null;

/**
 * Creates the "Guests" and "RSVPs" tabs and their header rows if they don't
 * exist yet. A new Guests tab gets dropdowns: Yes/No for Plus One, Guest/Family/Entourage for Group.
 */
function ensureTabs(): Promise<void> {
  if (!tabsReady) {
    tabsReady = (async () => {
      const { sheets, spreadsheetId } = getClient();
      const meta = await sheets.spreadsheets.get({ spreadsheetId, fields: "sheets.properties(sheetId,title)" });
      const titles = new Set(meta.data.sheets?.map((s) => s.properties?.title));

      const toAdd = [GUESTS_TAB, SHEET_TAB].filter((t) => !titles.has(t));
      if (toAdd.length) {
        const res = await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: toAdd.map((title) => ({ addSheet: { properties: { title, gridProperties: { frozenRowCount: 1 } } } })),
          },
        });
        const guestsSheetId = res.data.replies
          ?.map((r) => r.addSheet?.properties)
          .find((p) => p?.title === GUESTS_TAB)?.sheetId;
        if (guestsSheetId != null) {
          const dropdown = (column: number, options: string[]) => ({
            setDataValidation: {
              range: { sheetId: guestsSheetId, startRowIndex: 1, startColumnIndex: column, endColumnIndex: column + 1 },
              rule: {
                condition: { type: "ONE_OF_LIST", values: options.map((o) => ({ userEnteredValue: o })) },
                showCustomUi: true,
                strict: false,
              },
            },
          });
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: { requests: [dropdown(1, ["Yes", "No"]), dropdown(3, ["Guest", "Family", "Entourage"])] },
          });
        }
      }

      const heads = await sheets.spreadsheets.values.batchGet({
        spreadsheetId,
        ranges: [range(GUESTS_TAB, "A1:F1"), range(SHEET_TAB, "A1:F1")],
      });
      const empty = (i: number) => (heads.data.valueRanges?.[i]?.values?.[0] ?? []).every((c) => !String(c ?? "").trim());
      const data = [
        empty(0) && { range: range(GUESTS_TAB, "A1:F1"), values: [GUEST_HEADERS] },
        empty(1) && { range: range(SHEET_TAB, "A1:F1"), values: [RSVP_HEADERS] },
      ].filter(Boolean) as sheets_v4.Schema$ValueRange[];
      if (data.length) {
        await sheets.spreadsheets.values.batchUpdate({ spreadsheetId, requestBody: { valueInputOption: "RAW", data } });
      }
    })().catch((err) => {
      tabsReady = null; // retry next time
      throw err;
    });
  }
  return tabsReady;
}

// ─── Guests ────────────────────────────────────────────────────────────────

export type Guest = {
  row: number;
  name: string;
  plusOne: boolean;
  /** The +1's name, when it's already known (shown with the guest's name, and pre-filled on the RSVP). */
  plusOneName: string;
  group: GuestGroup;
  code: string;
  /** Their part in the wedding, shown on the invitation ("" if none), e.g. "Best Man". */
  role: string;
};

const cell = (v: unknown) => String(v ?? "").trim();
const yes = (v: unknown) => /^(y|yes|true|1|✓|✔)/i.test(cell(v));
/** "Family" (or a Yes from the older Family column) and "Entourage"; anything else is a regular guest. */
const groupOf = (v: unknown): GuestGroup =>
  /^(f|y|true|1|✓|✔)/i.test(cell(v)) ? "family" : /^e/i.test(cell(v)) ? "entourage" : "guest";

function parseGuests(values: unknown[][] | null | undefined): Guest[] {
  return (values ?? [])
    .map((r, i) => ({
      row: i + 2,
      name: cell(r[0]).replace(/\s+/g, " "),
      // a known +1 name means a +1 is allowed, even if Plus One was left blank
      plusOne: yes(r[1]) || Boolean(cell(r[2])),
      plusOneName: cell(r[2]).replace(/\s+/g, " "),
      group: groupOf(r[3]),
      code: normalizeCode(cell(r[4])) ?? "",
      role: cell(r[5]).replace(/\s+/g, " "),
    }))
    .filter((g) => g.name);
}

async function readGuests(): Promise<Guest[]> {
  const { sheets, spreadsheetId } = getClient();
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: range(GUESTS_TAB, "A2:F") });
  return parseGuests(res.data.values);
}

/** The guest list, for the admin page. Read-only: guests added since the last Refresh have no code yet (""). */
export async function listGuests(): Promise<Guest[]> {
  await ensureTabs();
  return readGuests();
}

/**
 * Gives every guest without a usable code (a new row, or a code that's
 * duplicated or mistyped) a fresh one, written to the sheet. Runs only when
 * the couple presses Refresh in /admin, never just because a page is being
 * viewed, so two page loads at once can't hand out different codes.
 * Returns how many guests got a new code.
 */
export async function assignMissingCodes(): Promise<number> {
  await ensureTabs();
  const { sheets, spreadsheetId } = getClient();
  const guests = await readGuests();

  const seen = new Set<string>();
  const needsCode: Guest[] = [];
  for (const g of guests) {
    if (g.code && !seen.has(g.code)) seen.add(g.code);
    else needsCode.push(g);
  }
  if (!needsCode.length) return 0;

  for (const g of needsCode) g.code = newInviteCode(seen);
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: "RAW",
      data: needsCode.map((g) => ({ range: range(GUESTS_TAB, `E${g.row}`), values: [[g.code]] })),
    },
  });
  return needsCode.length;
}

// ─── RSVPs ─────────────────────────────────────────────────────────────────

export type RsvpRow = {
  row: number;
  timestamp: string;
  name: string;
  attending: boolean;
  plusOneName: string;
  message: string;
  code: string;
};

function parseRsvps(values: unknown[][] | null | undefined): RsvpRow[] {
  return (values ?? [])
    .map((r, i) => ({
      row: i + 2,
      timestamp: cell(r[0]),
      name: cell(r[1]),
      attending: /^y/i.test(cell(r[2])),
      plusOneName: cell(r[3]),
      message: cell(r[4]),
      code: normalizeCode(cell(r[5])) ?? "",
    }))
    .filter((r) => r.name || r.timestamp);
}

export async function listRsvps(): Promise<RsvpRow[]> {
  await ensureTabs();
  const { sheets, spreadsheetId } = getClient();
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: range(SHEET_TAB, "A2:F") });
  return parseRsvps(res.data.values);
}

/** Looks up a personal link: the guest it belongs to, and their saved reply (if any). */
export async function findInvite(code: string): Promise<{ guest: Guest; reply: RsvpRow | null } | null> {
  await ensureTabs();
  const { sheets, spreadsheetId } = getClient();
  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges: [range(GUESTS_TAB, "A2:F"), range(SHEET_TAB, "A2:F")],
  });
  const guest = parseGuests(res.data.valueRanges?.[0]?.values).find((g) => g.code === code);
  if (!guest) return null;
  const reply = parseRsvps(res.data.valueRanges?.[1]?.values).find((r) => r.code === code) ?? null;
  return { guest, reply };
}

/**
 * Saves a guest's reply. If they've replied before (same code), their row is
 * updated in place instead of adding a duplicate.
 * Values are written RAW, so text like "=SUM(...)" is never run as a formula.
 */
export async function saveRsvp(guest: Guest, rsvp: Rsvp, previous: RsvpRow | null): Promise<{ updated: boolean }> {
  const { sheets, spreadsheetId } = getClient();
  const row = [
    localTimestamp(new Date()),
    guest.name,
    rsvp.attending === "yes" ? "Yes" : "No",
    rsvp.plusOneName,
    rsvp.message,
    guest.code,
  ];

  if (previous) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: range(SHEET_TAB, `A${previous.row}:F${previous.row}`),
      valueInputOption: "RAW",
      requestBody: { values: [row] },
    });
    return { updated: true };
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: range(SHEET_TAB, "A:F"),
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
  return { updated: false };
}
