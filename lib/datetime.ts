import { wedding } from "@/config/wedding.config";

/** Parses "3:00 PM", "3 PM" or "15:00" into 24h hours and minutes. */
export function parseTime(time: string): { hours: number; minutes: number } {
  const match = time.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*([ap]\.?m\.?)?$/i);
  if (!match) throw new Error(`Unrecognised time "${time}". Use e.g. "3:00 PM" or "15:00".`);
  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? 0);
  const meridiem = match[3]?.toLowerCase().replace(/\./g, "");
  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;
  return { hours, minutes };
}

function splitDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return { y, m, d };
}

/**
 * Converts a wall-clock date + time in `timeZone` to an absolute Date.
 * Works for any IANA zone (Asia/Manila has no DST, but this handles it anyway).
 */
export function zonedDateTime(date: string, time: string, timeZone: string): Date {
  const { y, m, d } = splitDate(date);
  const { hours, minutes } = parseTime(time);
  const guess = Date.UTC(y, m - 1, d, hours, minutes);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(guess));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asIfUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return new Date(guess - (asIfUtc - guess));
}

/** Date-only strings are formatted at UTC noon so they never drift a day. */
function calendarDate(date: string) {
  const { y, m, d } = splitDate(date);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

export function dateParts(date: string) {
  const dt = calendarDate(date);
  const fmt = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...opts }).format(dt);
  return {
    weekday: fmt({ weekday: "long" }),
    day: fmt({ day: "numeric" }),
    month: fmt({ month: "long" }),
    year: fmt({ year: "numeric" }),
  };
}

/** "Tuesday, January 5, 2027" */
export function formatLongDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(calendarDate(date));
}

/** "January 5, 2027" */
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(calendarDate(date));
}

/** "1-5-2027": month-day-year with no leading zeros, the way guests here read dates. */
export function formatShortDate(date: string) {
  const dt = calendarDate(date);
  return `${dt.getUTCMonth() + 1}-${dt.getUTCDate()}-${dt.getUTCFullYear()}`;
}

/** Normalises any accepted time string to "3:00 PM". */
export function formatTime(time: string) {
  const { hours, minutes } = parseTime(time);
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${h12}:${String(minutes).padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`;
}

/** Whole years between two YYYY-MM-DD dates. */
export function yearsBetween(start: string, end: string) {
  const a = splitDate(start);
  const b = splitDate(end);
  let years = b.y - a.y;
  if (b.m < a.m || (b.m === a.m && b.d < a.d)) years -= 1;
  return Math.max(0, years);
}

const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen", "twenty",
];
export const numberWord = (n: number) => NUMBER_WORDS[n] ?? String(n);

/** "2026-11-13 14:05:22" in the wedding's timezone — used for sheet timestamps. */
export function localTimestamp(now: Date, timeZone = wedding.timezone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

/* ── Derived values used across the site ─────────────────────────────────── */

export const ceremonyStart = zonedDateTime(wedding.date, wedding.ceremony.time, wedding.timezone);

export const coupleNames = `${wedding.couple.partnerOne} & ${wedding.couple.partnerTwo}`;

/**
 * The monogram as drawn in script: a third-of-an-em space before the "&" so the
 * K's long swash doesn't run into it ("K&H" → "K &H").
 */
export const monogramText = wedding.couple.monogram.replace(/\s*&\s*/, "\u2004&");

export const yearsTogether = yearsBetween(wedding.relationshipStart, wedding.date);

export function mapsSearchUrl(name: string, address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${address}`)}`;
}
