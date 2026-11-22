"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { GuestGroup, InviteLookup, SavedReply } from "@/lib/rsvp-schema";

/** Who this page was opened for, from the personal link's ?i=CODE. */
export type Invite =
  /** Rendering on the server: the link isn't known yet. */
  | { status: "pending" }
  /** The plain site link, without a personal code. */
  | { status: "none" }
  | { status: "loading"; code: string }
  | {
      status: "ready";
      code: string;
      name: string;
      plusOne: boolean;
      /** The +1's name if already known ("" if not). */
      plusOneName: string;
      group: GuestGroup;
      /** Their part in the wedding (e.g. "Best Man"), "" if none. */
      role: string;
      reply: SavedReply | null;
      demo: boolean;
    }
  /** A code that isn't on the guest list. */
  | { status: "invalid"; code: string }
  | { status: "error"; code: string; message: string };

type Settled = Extract<Invite, { status: "ready" | "invalid" | "error" }>;

type InviteContextValue = {
  invite: Invite;
  /** Keeps the page in sync after the guest sends (or changes) their reply. */
  saveReply: (reply: SavedReply) => void;
  /** Looks the link up again after a network hiccup. */
  retry: () => void;
};

const InviteContext = createContext<InviteContextValue>({
  invite: { status: "pending" },
  saveReply: () => {},
  retry: () => {},
});

export const useInvite = () => useContext(InviteContext);

const noop = () => () => {};
const codeFromUrl = () => new URLSearchParams(window.location.search).get("i");
const unknownOnServer = () => undefined;

export function InviteProvider({ children }: { children: React.ReactNode }) {
  const code = useSyncExternalStore(noop, codeFromUrl, unknownOnServer);
  const [settled, setSettled] = useState<Settled | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    fetch(`/api/invite?code=${encodeURIComponent(code)}`, { cache: "no-store" })
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as InviteLookup | null;
        if (cancelled) return;
        if (data?.ok) {
          setSettled({
            status: "ready",
            code,
            name: data.name,
            plusOne: data.plusOne,
            plusOneName: data.plusOneName,
            group: data.group,
            role: data.role ?? "",
            reply: data.reply,
            demo: Boolean(data.demo),
          });
        } else if (res.status === 404) {
          setSettled({ status: "invalid", code });
        } else {
          const message = data && !data.ok ? data.error : "We couldn't load your invitation just now.";
          setSettled({ status: "error", code, message });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSettled({ status: "error", code, message: "We couldn't reach the server. Please check your connection." });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [code, attempt]);

  const saveReply = useCallback(
    (reply: SavedReply) => setSettled((s) => (s?.status === "ready" ? { ...s, reply } : s)),
    [],
  );
  const retry = useCallback(() => {
    setSettled(null);
    setAttempt((n) => n + 1);
  }, []);

  const value = useMemo(() => {
    const invite: Invite =
      code === undefined
        ? { status: "pending" }
        : code === null
          ? { status: "none" }
          : settled?.code === code
            ? settled
            : { status: "loading", code };
    return { invite, saveReply, retry };
  }, [code, settled, saveReply, retry]);
  return <InviteContext.Provider value={value}>{children}</InviteContext.Provider>;
}
