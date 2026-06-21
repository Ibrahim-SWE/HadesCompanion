import boonsData from "$lib/data/hades2/boons.json";
import arcanaCardsData from "$lib/data/hades2/arcana_cards.json";
import cursesData from "$lib/data/hades2/curses.json";
import keepsakesData from "$lib/data/hades2/keepsakes.json";
import petsData from "$lib/data/hades2/pets.json";
import toolsData from "$lib/data/hades2/tools.json";
import weaponsData from "$lib/data/hades2/weapons.json";
import godsData from "$lib/data/gods.json";
import {
  absoluteUrl,
  PAGE_SEO,
  SITE_NAME,
  type SeoMeta,
} from "$lib/seo";

export type JsonLd = Record<string, unknown>;

type ListItemInput = {
  name: string;
  path?: string;
};

type SectionConfig = {
  breadcrumbName: string;
  path: string;
  title: string;
  description: string;
};

function withContext(type: string, props: Record<string, unknown>): JsonLd {
  return { "@context": "https://schema.org", "@type": type, ...props };
}

export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function websiteJsonLd(): JsonLd {
  return withContext("WebSite", {
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: PAGE_SEO.home.description,
  });
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): JsonLd {
  return withContext("BreadcrumbList", {
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  });
}

export function itemListJsonLd(options: {
  name: string;
  description: string;
  items: ListItemInput[];
}): JsonLd {
  return withContext("ItemList", {
    name: options.name,
    description: options.description,
    numberOfItems: options.items.length,
    itemListElement: options.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { url: absoluteUrl(item.path) } : {}),
    })),
  });
}

function listPageJsonLd(
  section: SectionConfig,
  items: ListItemInput[],
): JsonLd[] {
  return [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: section.breadcrumbName, path: section.path },
    ]),
    itemListJsonLd({
      name: section.title,
      description: section.description,
      items,
    }),
  ];
}

function sortedNames(
  records: Record<string, { name: string }>,
): ListItemInput[] {
  return Object.values(records)
    .map((entry) => ({ name: entry.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function sortedKeys(records: Record<string, unknown>): ListItemInput[] {
  return Object.keys(records)
    .map((name) => ({ name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function jsonLdForHome(): JsonLd[] {
  return [websiteJsonLd()];
}

export function jsonLdForGodsList(): JsonLd[] {
  const items = Object.keys(godsData)
    .sort((a, b) => a.localeCompare(b))
    .map((god) => ({
      name: god,
      path: `/hades2/gods/${encodeURIComponent(god)}`,
    }));

  return listPageJsonLd(
    {
      breadcrumbName: "Gods & Characters",
      path: "/hades2/gods",
      title: "Gods & Characters",
      description: PAGE_SEO.gods.description,
    },
    items,
  );
}

export function jsonLdForGod(godName: string): JsonLd[] {
  return [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Gods & Characters", path: "/hades2/gods" },
      {
        name: godName,
        path: `/hades2/gods/${encodeURIComponent(godName)}`,
      },
    ]),
  ];
}

export function jsonLdForBoonsList(): JsonLd[] {
  const items = sortedNames(boonsData as Record<string, { name: string }>);

  return listPageJsonLd(
    {
      breadcrumbName: "Boons",
      path: "/hades2/boons",
      title: "Boons",
      description: PAGE_SEO.boons.description,
    },
    items,
  );
}

export function jsonLdForWeaponsList(): JsonLd[] {
  return listPageJsonLd(
    {
      breadcrumbName: "Weapons",
      path: "/hades2/weapons",
      title: "Weapons",
      description: PAGE_SEO.weapons.description,
    },
    sortedKeys(weaponsData as Record<string, unknown>),
  );
}

export function jsonLdForCardsList(): JsonLd[] {
  return listPageJsonLd(
    {
      breadcrumbName: "Arcana Cards",
      path: "/hades2/cards",
      title: "Arcana Cards",
      description: PAGE_SEO.cards.description,
    },
    sortedKeys(arcanaCardsData as Record<string, unknown>),
  );
}

export function jsonLdForKeepsakesList(): JsonLd[] {
  return listPageJsonLd(
    {
      breadcrumbName: "Keepsakes",
      path: "/hades2/keepsakes",
      title: "Keepsakes",
      description: PAGE_SEO.keepsakes.description,
    },
    sortedKeys(keepsakesData as Record<string, unknown>),
  );
}

export function jsonLdForCursesList(): JsonLd[] {
  return listPageJsonLd(
    {
      breadcrumbName: "Curses",
      path: "/hades2/curses",
      title: "Curses",
      description: PAGE_SEO.curses.description,
    },
    sortedNames(cursesData as Record<string, { name: string }>),
  );
}

export function jsonLdForAnimalsList(): JsonLd[] {
  return listPageJsonLd(
    {
      breadcrumbName: "Animal Familiars",
      path: "/hades2/animals",
      title: "Animal Familiars",
      description: PAGE_SEO.animals.description,
    },
    sortedKeys(petsData as Record<string, unknown>),
  );
}

export function jsonLdForToolsList(): JsonLd[] {
  const items = (toolsData as { name: string }[])
    .map((tool) => ({ name: tool.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return listPageJsonLd(
    {
      breadcrumbName: "Gathering Tools",
      path: "/hades2/tools",
      title: "Gathering Tools",
      description: PAGE_SEO.tools.description,
    },
    items,
  );
}

export function withJsonLd(seo: SeoMeta, jsonLd: JsonLd | JsonLd[]): SeoMeta {
  return { ...seo, jsonLd };
}
