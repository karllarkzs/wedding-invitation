import { wedding } from "@/config/wedding.config";
import { ceremonyStart, coupleNames, zonedDateTime } from "./datetime";

const lastProgramItem = wedding.program[wedding.program.length - 1];
/** Event ends one hour after the last program item (e.g. send-off at 10 PM → 11 PM). */
export const eventEnd = new Date(
  zonedDateTime(wedding.date, lastProgramItem?.time ?? "11:00 PM", wedding.timezone).getTime() + 60 * 60 * 1000,
);

const toCalStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const title = `${coupleNames}'s Wedding`;
const details = [
  `${wedding.ceremony.label}: ${wedding.ceremony.name} — ${wedding.ceremony.time}`,
  `${wedding.reception.label}: ${wedding.reception.name} — ${wedding.reception.time}`,
  wedding.reception.address,
].join("\n");

export const googleCalendarUrl =
  "https://calendar.google.com/calendar/render?" +
  new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toCalStamp(ceremonyStart)}/${toCalStamp(eventEnd)}`,
    details,
    location: `${wedding.ceremony.name}, ${wedding.ceremony.address}`,
    ctz: wedding.timezone,
  }).toString();

const escapeIcs = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");

/** RFC 5545 lines must be folded at 75 octets (60 chars leaves room for accents like ñ). */
const fold = (line: string) => line.match(/.{1,60}/g)?.join("\r\n ") ?? line;

export function buildIcs() {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${wedding.date}-${wedding.couple.monogram.replace(/\W/g, "").toLowerCase()}@wedding-invitation`,
    `DTSTAMP:${toCalStamp(ceremonyStart)}`,
    `DTSTART:${toCalStamp(ceremonyStart)}`,
    `DTEND:${toCalStamp(eventEnd)}`,
    `SUMMARY:${escapeIcs(title)}`,
    `LOCATION:${escapeIcs(`${wedding.ceremony.name}, ${wedding.ceremony.address}`)}`,
    `DESCRIPTION:${escapeIcs(details)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(`Tomorrow: ${title}`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
