import "server-only";
import { randomInt } from "node:crypto";
import { CODE_ALPHABET } from "./rsvp-schema";

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
 * Sheets is connected: open /?i=DEMO1 (allowed a +1) or /?i=DEMO2 (no +1).
 * Never used on the live site (see `demoMode` in ./sheets).
 */
export const DEMO_GUESTS = [
  { name: "Maria Santos", plusOne: true, code: "DEMO1" },
  { name: "Juan Dela Cruz", plusOne: false, code: "DEMO2" },
];
