import "server-only";
import fs from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const IMAGE_RE = /\.(jpe?g|png|webp|avif)$/i;

/** Does `/images/foo.jpg` exist at public/images/foo.jpg? (sync I/O → prerendered) */
export function publicFileExists(src: string): boolean {
  try {
    return fs.statSync(path.join(PUBLIC_DIR, src.replace(/^\/+/, ""))).isFile();
  } catch {
    return false;
  }
}

/**
 * Lists images in a public folder, sorted naturally (1, 2, 10…).
 * With `recursive`, subfolders are included in name order too
 * (e.g. story/younger-years/2017/…, then 2018/…).
 */
export function listPublicImages(folder: string, { recursive = false } = {}): string[] {
  const base = folder.replace(/\/+$/, "");
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(path.join(PUBLIC_DIR, base.replace(/^\/+/, "")), { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => !e.name.startsWith("."))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }))
    .flatMap((e) => {
      if (e.isDirectory()) return recursive ? listPublicImages(`${base}/${e.name}`, { recursive }) : [];
      return IMAGE_RE.test(e.name) ? [`${base}/${e.name}`] : [];
    });
}
