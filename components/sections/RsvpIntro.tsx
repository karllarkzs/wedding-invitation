"use client";

import { useInvite } from "@/components/InviteContext";

/** The line above the RSVP card. Family and entourage (no RSVP needed) get their own wording. */
export function RsvpIntro({ deadline }: { deadline: string }) {
  const { invite } = useInvite();
  if (invite.status === "ready" && invite.group !== "guest") {
    return <p>We&rsquo;re so happy you&rsquo;ll be with us on our special day.</p>;
  }
  return <p>It would mean the world to have you with us. Please let us know by {deadline}.</p>;
}
