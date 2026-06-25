export const SITE_ORIGIN = "https://hadescompanion.com";
export const SITE_NAME = "Hades 2 Companion";

export type SeoMeta = {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function seoTitle(...parts: string[]): string {
  const filtered = parts.filter(Boolean);
  if (filtered.length === 0) return SITE_NAME;
  return [...filtered, SITE_NAME].join(" | ");
}

export const PAGE_SEO = {
  home: {
    title: SITE_NAME,
    description:
      "Everything you need to plan and optimize your Hades 2 runs. Discover boons, weapons, arcana cards, keepsakes, and more.",
    canonicalPath: "/",
  },
  gods: {
    title: seoTitle("Gods & Characters"),
    description:
      "Gods and characters who grant boons and offerings in Hades 2. Browse keepsakes, curses, and every boon they offer.",
    canonicalPath: "/hades2/gods",
  },
  boons: {
    title: seoTitle("Boons"),
    description:
      "Browse and filter all boons in Hades 2. Use search or filters to narrow results by god, type, element, and rarity.",
    canonicalPath: "/hades2/boons",
  },
  weapons: {
    title: seoTitle("Weapons"),
    description:
      "The weapons of Melinoë, their Aspects, and Daedalus Hammer upgrades in Hades 2.",
    canonicalPath: "/hades2/weapons",
  },
  cards: {
    title: seoTitle("Arcana Cards"),
    description:
      "View all Arcana Cards from the Altar of Ashes in Hades 2, their effects, and upgrade requirements.",
    canonicalPath: "/hades2/cards",
  },
  keepsakes: {
    title: seoTitle("Keepsakes"),
    description:
      "Gifts from allies in Hades 2 that grow stronger as you complete runs. Find every keepsake and who gifts it.",
    canonicalPath: "/hades2/keepsakes",
  },
  curses: {
    title: seoTitle("Curses"),
    description:
      "A list of all curses and status effects in Hades 2. Find boons that apply each curse.",
    canonicalPath: "/hades2/curses",
  },
  animals: {
    title: seoTitle("Animal Familiars"),
    description:
      "Animal familiars in Hades 2. See how to unlock and upgrade each pet and the bonuses they grant.",
    canonicalPath: "/hades2/animals",
  },
  tools: {
    title: seoTitle("Gathering Tools"),
    description:
      "Unlock and upgrade gathering tools in Hades 2 to collect resources from the Underworld and Surface.",
    canonicalPath: "/hades2/tools",
  },
  cauldron: {
    title: seoTitle("The Cauldron"),
    description:
      "Alchemy recipes and incantations at the Crossroads in Hades 2. See costs, effects, unlock requirements, and prerequisites.",
    canonicalPath: "/hades2/cauldron",
  },
  notFound: {
    title: seoTitle("Page Not Found"),
    description:
      "This path leads nowhere in the Underworld. Return to Hades 2 Companion.",
    canonicalPath: "/",
    noindex: true,
  },
  error: {
    title: seoTitle("Error"),
    description: "Something went wrong. Return to Hades 2 Companion.",
    canonicalPath: "/",
    noindex: true,
  },
} satisfies Record<string, SeoMeta>;

export function godPageSeo(
  godName: string,
  subtitle: string,
  ogImage?: string,
): SeoMeta {
  return {
    title: seoTitle(godName, "Gods & Characters"),
    description: `${godName}, ${subtitle}. View boons, offerings, keepsakes, and curses in Hades 2.`,
    canonicalPath: `/hades2/gods/${encodeURIComponent(godName)}`,
    ogImage,
  };
}

export { SITEMAP_PATHS, buildSitemapXml } from "./sitemap";
