import type { Metadata } from "next";
import { Suspense } from "react";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { coupleNames } from "@/lib/datetime";
import { publicSiteUrl } from "@/lib/site";
import { listGuests, listRsvps, sheetUrl } from "@/lib/sheets";
import { Flourish } from "@/components/art/Ornaments";
import { Dashboard } from "./Dashboard";
import { buildAdminRows, type AdminRow } from "./rows";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: `RSVP Admin · ${coupleNames}`,
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="min-h-dvh px-4 py-12 sm:py-16">
      <header className="text-center">
        <p className="eyebrow">Guest list</p>
        <h1 className="title-display mt-2">RSVP Admin</h1>
        <Flourish className="mx-auto mt-2" />
      </header>
      <Suspense fallback={<p className="mt-12 text-center italic text-ink-soft">Loading…</p>}>
        <AdminGate />
      </Suspense>
    </main>
  );
}

/** Reads the session cookie at request time, then shows the login or the dashboard. */
async function AdminGate() {
  if (!(await isAdmin())) {
    return <LoginForm configured={adminConfigured()} />;
  }

  let rows: AdminRow[] = [];
  let error: string | null = null;
  try {
    const [guests, rsvps] = await Promise.all([listGuests(), listRsvps()]);
    rows = buildAdminRows(guests, rsvps);
  } catch (err) {
    console.error("[admin] Failed to read RSVPs:", err);
    error =
      err instanceof Error && err.name === "SheetsNotConfiguredError"
        ? err.message
        : "Couldn't read the Google Sheet. Check the service account has Editor access and the env vars are correct.";
  }

  return <Dashboard rows={rows} sheetUrl={sheetUrl()} siteUrl={publicSiteUrl} error={error} />;
}
