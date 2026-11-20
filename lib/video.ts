/**
 * Turns a YouTube or Vimeo link (watch, share, Shorts or embed links all work)
 * into an embed URL. The player is only loaded after a guest taps play, so it
 * autoplays; YouTube uses its no-cookie domain and Vimeo is asked not to track.
 * Returns null for anything else.
 */
export function videoEmbedUrl(link: string): string | null {
  let url: URL;
  try {
    url = new URL(link.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www|m|music)\./, "");

  let youtubeId: string | null = null;
  if (host === "youtu.be") {
    youtubeId = url.pathname.split("/")[1] ?? null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    youtubeId =
      url.pathname === "/watch"
        ? url.searchParams.get("v")
        : (url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/)?.[1] ?? null);
  }
  if (youtubeId && /^[\w-]{6,}$/.test(youtubeId)) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`;
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    // vimeo.com/123456, vimeo.com/123456/abcdef (unlisted), player.vimeo.com/video/123456?h=abcdef
    const m = url.pathname.match(/^(?:\/video)?\/(\d+)(?:\/([\da-f]+))?/);
    if (m) {
      const params = new URLSearchParams({ autoplay: "1", dnt: "1" });
      const hash = m[2] ?? url.searchParams.get("h");
      if (hash) params.set("h", hash);
      return `https://player.vimeo.com/video/${m[1]}?${params}`;
    }
  }
  return null;
}
