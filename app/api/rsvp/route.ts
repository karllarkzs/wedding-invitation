import { NextResponse } from "next/server";
import { DEMO_GUESTS } from "@/lib/invites";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { fieldErrorsFrom, normalizeCode, plusOneError, rsvpSchema, type RsvpResponse } from "@/lib/rsvp-schema";
import { SheetsNotConfiguredError, demoMode, findInvite, saveRsvp } from "@/lib/sheets";

const json = (body: RsvpResponse, init?: ResponseInit) => NextResponse.json(body, init);

const NOT_FOUND = "We couldn't find your invitation. Please use the personal link we sent you.";

export async function POST(request: Request) {
  // 1. Rate limit: 6 replies per 10 minutes per IP.
  const limit = rateLimit(`rsvp:${clientIp(request.headers)}`, { limit: 6, windowMs: 10 * 60 * 1000 });
  if (!limit.ok) {
    return json(
      { ok: false, error: "That's a lot of replies in a short time. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "We couldn't read your reply. Please try again." }, { status: 400 });
  }

  // 2. Honeypot: bots fill every field. Pretend it worked, but save nothing.
  const honeypot = (body as { website?: unknown } | null)?.website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return json({ ok: true, name: "friend", attending: "yes", plusOneName: "", updated: false });
  }

  // 3. Validate on the server — never trust the browser.
  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = fieldErrorsFrom(parsed.error);
    const error = Object.keys(fieldErrors).length ? "Please check the highlighted fields." : NOT_FOUND;
    return json({ ok: false, error, fieldErrors }, { status: 422 });
  }
  const rsvp = parsed.data;
  const code = normalizeCode(rsvp.code);
  if (!code) return json({ ok: false, error: NOT_FOUND }, { status: 404 });

  // 4. The guest comes from the guest list (by code), and so does their +1 allowance.
  if (demoMode()) {
    const guest = DEMO_GUESTS.find((g) => g.code === code);
    if (!guest) return json({ ok: false, error: NOT_FOUND }, { status: 404 });
    const plusOne = plusOneError(guest, rsvp);
    if (plusOne) return json({ ok: false, error: plusOne, fieldErrors: { plusOne } }, { status: 422 });
    console.warn("[rsvp] Google Sheets env vars missing — reply NOT saved (development preview).", { ...rsvp, code });
    return json({ ok: true, name: guest.name, attending: rsvp.attending, plusOneName: rsvp.plusOneName, updated: false, demo: true });
  }

  try {
    const found = await findInvite(code);
    if (!found) return json({ ok: false, error: NOT_FOUND }, { status: 404 });
    const { guest, reply } = found;
    const plusOne = plusOneError(guest, rsvp);
    if (plusOne) return json({ ok: false, error: plusOne, fieldErrors: { plusOne } }, { status: 422 });

    // 5. Save to Google Sheets.
    const { updated } = await saveRsvp(guest, rsvp, reply);
    return json({ ok: true, name: guest.name, attending: rsvp.attending, plusOneName: rsvp.plusOneName, updated });
  } catch (err) {
    console.error("[rsvp] Failed to save to Google Sheets:", err);
    const message =
      err instanceof SheetsNotConfiguredError
        ? "RSVPs aren't open just yet. Please try again soon, or message the couple directly."
        : "We couldn't save your reply just now. Please try again in a moment.";
    return json({ ok: false, error: message }, { status: 503 });
  }
}
