import godsData from "./data/gods.json" with { type: "json" };

const SITE_ORIGIN = "https://hadescompanion.com";

function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export const SITEMAP_PATHS = [
  "/",
  "/hades2/gods",
  ...Object.keys(godsData).map(
    (god) => `/hades2/gods/${encodeURIComponent(god)}`,
  ),
  "/hades2/boons",
  "/hades2/weapons",
  "/hades2/cards",
  "/hades2/keepsakes",
  "/hades2/curses",
  "/hades2/animals",
  "/hades2/tools",
] as const;

export function buildSitemapXml(): string {
  const urls = SITEMAP_PATHS.map(
    (path) => `  <url><loc>${absoluteUrl(path)}</loc></url>`,
  ).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}
