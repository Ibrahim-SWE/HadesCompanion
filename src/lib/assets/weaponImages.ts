import type { Picture } from "@sveltejs/enhanced-img";
import { loadCachedPicture } from "./imageLoadUtils";

const loaders = import.meta.glob<Picture>("/src/lib/assets/weapons/**/*.webp", {
  import: "default",
  query: { enhanced: true, format: "avif;webp" },
});

const cache = new Map<string, Picture>();
const inFlight = new Map<string, Promise<Picture | null>>();

export function resolveWeaponImagePath(imagePath: string): string {
  return `/src/lib/assets/weapons/${imagePath}`;
}

export async function loadWeaponImage(
  imagePath: string,
): Promise<Picture | null> {
  return loadCachedPicture(
    loaders,
    cache,
    inFlight,
    resolveWeaponImagePath(imagePath),
  );
}
