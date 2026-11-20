"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_PATH,
  SESSION_MAX_AGE,
  adminConfigured,
  createSessionToken,
  isAdmin,
  passwordMatches,
} from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { assignMissingCodes } from "@/lib/sheets";

export type LoginState = { error: string | null };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminConfigured()) {
    return { error: "ADMIN_PASSWORD isn't set on the server yet. Add it to your environment variables." };
  }

  const ip = clientIp(await headers());
  if (!rateLimit(`admin-login:${ip}`, { limit: 8, windowMs: 15 * 60 * 1000 }).ok) {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }

  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) {
    return { error: "That password isn't right." };
  }

  (await cookies()).set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: ADMIN_COOKIE_PATH,
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).set(ADMIN_COOKIE, "", { path: ADMIN_COOKIE_PATH, maxAge: 0 });
  redirect("/admin");
}

/** Refresh in /admin: gives guests added to the sheet since last time their personal link code. */
export async function createMissingLinks(): Promise<{ added: number; error: string | null }> {
  if (!(await isAdmin())) return { added: 0, error: "Please sign in again." };
  try {
    return { added: await assignMissingCodes(), error: null };
  } catch (err) {
    console.error("[admin] Failed to create links:", err);
    return { added: 0, error: "Couldn't update the Google Sheet. Please try again." };
  }
}
