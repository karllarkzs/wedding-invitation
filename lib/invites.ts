import "server-only";
import { randomInt } from "node:crypto";
import { CODE_ALPHABET, type GuestGroup } from "./rsvp-schema";

/** A new random code that isn't in `taken` (and is then added to it). */
export function newInviteCode(taken: Set<string>) {
  for (;;) {
    let code = "";
    for (let i = 0; i < 6; i++) code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
    if (!taken.has(code)) {
      taken.add(code);
      return code;
    }
  }
}

/**
 * Sample guests for trying personal links on your own computer before Google
 * Sheets is connected: open /?i=DEMO1 (allowed a +1), /?i=DEMO2 (no +1) or
 * /?i=DEMO3 (family) or /?i=DEMO4 (entourage): no RSVP needed. Never used on the
 * live site (see `demoMode` in ./sheets).
 */
export const DEMO_GUESTS: { name: string; plusOne: boolean; plusOneName: string; group: GuestGroup; role: string; code: string }[] = [
  { name: "Maria Santos", plusOne: true, plusOneName: "Ana Reyes", group: "guest", role: "", code: "DEMO1" },
  { name: "Juan Dela Cruz", plusOne: false, plusOneName: "", group: "guest", role: "", code: "DEMO2" },
  { name: "Lola Rosa", plusOne: false, plusOneName: "", group: "family", role: "Grandmother of the Bride", code: "DEMO3" },
  { name: "Paolo Reyes", plusOne: true, plusOneName: "Bea Reyes", group: "entourage", role: "Principal Sponsors", code: "DEMO4" },
];
