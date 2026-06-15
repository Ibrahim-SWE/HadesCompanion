import type { Picture } from "@sveltejs/enhanced-img";
import { loadCachedPicture } from "./imageLoadUtils";

const loaders = import.meta.glob<Picture>("/src/lib/assets/boons/**/*.webp", {
  import: "default",
  query: { enhanced: true, format: "avif;webp" },
});

const cache = new Map<string, Picture>();
const inFlight = new Map<string, Promise<Picture | null>>();

export function resolveBoonImagePath(
  godFolder: string,
  imagePath: string,
): string {
  return imagePath.includes("/")
    ? `/src/lib/assets/boons/${imagePath}`
    : `/src/lib/assets/boons/${godFolder}/${imagePath}`;
}

export async function loadBoonImage(fullPath: string): Promise<Picture | null> {
  return loadCachedPicture(loaders, cache, inFlight, fullPath);
}
