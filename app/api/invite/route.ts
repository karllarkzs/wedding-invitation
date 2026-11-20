import { NextResponse } from "next/server";
import { DEMO_GUESTS } from "@/lib/invites";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { normalizeCode, type InviteLookup } from "@/lib/rsvp-schema";
import { demoMode, findInvite } from "@/lib/sheets";

const json = (body: InviteLookup, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });

const NOT_FOUND = "We couldn't find this invitation link.";

/**
 * Looks up a personal invitation link (/?i=CODE): the guest's name, whether
 * they may bring a +1, and their saved reply. Only ever reveals that one guest.
 */
export async function GET(request: Request) {
  // Plenty for a guest opening their link a few times; too slow to guess codes.
  const limit = rateLimit(`invite:${clientIp(request.headers)}`, { limit: 40, windowMs: 10 * 60 * 1000 });
  if (!limit.ok) return json({ ok: false, error: "Too many tries. Please wait a few minutes." }, 429);

  const code = normalizeCode(new URL(request.url).searchParams.get("code"));
  if (!code) return json({ ok: false, error: NOT_FOUND }, 404);

  if (demoMode()) {
    const guest = DEMO_GUESTS.find((g) => g.code === code);
    return guest
      ? json({ ok: true, name: guest.name, plusOne: guest.plusOne, reply: null, demo: true })
      : json({ ok: false, error: NOT_FOUND }, 404);
  }

  try {
    const found = await findInvite(code);
    if (!found) return json({ ok: false, error: NOT_FOUND }, 404);
    const { guest, reply } = found;
    return json({
      ok: true,
      name: guest.name,
      plusOne: guest.plusOne,
      reply: reply
        ? { attending: reply.attending ? "yes" : "no", plusOneName: reply.plusOneName, message: reply.message }
        : null,
    });
  } catch (err) {
    console.error("[invite] Lookup failed:", err);
    return json({ ok: false, error: "We couldn't load your invitation just now. Please try again in a moment." }, 503);
  }
}
