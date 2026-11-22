import { z } from "zod";

/**
 * Personal invite codes, as in yoursite.com/?i=K7F2QX. Six characters from an
 * alphabet without look-alikes (no 0/O, 1/I/L), so they're easy to read aloud.
 */
export const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Tidies a code from a link or the sheet ("k7f-2qx " → "K7F2QX"); null if it can't be one. */
export function normalizeCode(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const code = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  return /^[A-Z0-9]{4,12}$/.test(code) ? code : null;
}

const oneLine = (v: string) => v.replace(/\s+/g, " ");

/**
 * One reply per personal link. The guest's own name comes from the guest list
 * (looked up by code on the server), never from the form. Shared by the RSVP
 * form (instant feedback) and the API route (the real check).
 */
export const rsvpSchema = z
  .object({
    code: z.string({ error: "Please use the personal link we sent you." }).trim().min(4).max(12),
    attending: z.enum(["yes", "no"], { error: "Please let us know whether you can make it." }),
    plusOne: z.enum(["yes", "no"], { error: "Please let us know if you're bringing a +1." }).optional().default("no"),
    plusOneName: z
      .string()
      .trim()
      .max(80, { error: "That's a little long — 80 characters at most, please." })
      .optional()
      .default("")
      .transform(oneLine),
    message: z
      .string()
      .trim()
      .max(500, { error: "Please keep your note under 500 characters." })
      .optional()
      .default(""),
  })
  .superRefine((data, ctx) => {
    if (data.attending === "yes" && data.plusOne === "yes" && data.plusOneName.length < 2) {
      ctx.addIssue({ code: "custom", path: ["plusOneName"], message: "Please tell us your +1's full name." });
    }
  })
  // Declining, or coming alone, means no +1.
  .transform((data) =>
    data.attending === "yes" && data.plusOne === "yes" ? data : { ...data, plusOne: "no" as const, plusOneName: "" },
  );

export type RsvpInput = z.input<typeof rsvpSchema>;
export type Rsvp = z.output<typeof rsvpSchema>;
export type RsvpField = "attending" | "plusOne" | "plusOneName" | "message";
export type FieldErrors = Partial<Record<RsvpField, string>>;

/** The server's rule for +1s: only guests marked "Plus One: Yes" on the guest list may bring one. */
export function plusOneError(guest: { plusOne: boolean }, rsvp: Rsvp): string | null {
  return rsvp.plusOne === "yes" && !guest.plusOne ? "This invitation is for one guest." : null;
}

export function fieldErrorsFrom(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as RsvpField | undefined;
    if (key && key !== ("code" as string) && !out[key]) out[key] = issue.message;
  }
  return out;
}

/** A guest's saved answer, used to pre-fill the form when they open their link again. */
export type SavedReply = { attending: "yes" | "no"; plusOneName: string; message: string };

/**
 * Which group a guest is in (the Group column of the Guests tab). Family and
 * entourage don't RSVP: their seat is saved automatically.
 */
export type GuestGroup = "guest" | "family" | "entourage";

/** What /api/invite returns for a personal link. */
export type InviteLookup =
  | {
      ok: true;
      name: string;
      plusOne: boolean;
      /** The +1's name if it's already known ("" if not). */
      plusOneName: string;
      group: GuestGroup;
      /** Their part in the wedding (e.g. "Principal Sponsors"), "" if none. */
      role: string;
      reply: SavedReply | null;
      demo?: boolean;
    }
  | { ok: false; error: string };

/** What /api/rsvp returns to the form. */
export type RsvpResponse =
  | { ok: true; name: string; attending: "yes" | "no"; plusOneName: string; updated: boolean; demo?: boolean }
  | { ok: false; error: string; fieldErrors?: FieldErrors };
