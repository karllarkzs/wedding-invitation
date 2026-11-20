/**
 * The invitation's public address, when known: NEXT_PUBLIC_SITE_URL (e.g. a
 * custom domain), or the main address Netlify or Vercel provides.
 * Null when none is set.
 */
export const publicSiteUrl: string | null =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NETLIFY === "true" && process.env.URL ? process.env.URL : null) ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null);
