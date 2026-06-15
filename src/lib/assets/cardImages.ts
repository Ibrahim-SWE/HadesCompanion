import type { Picture } from "@sveltejs/enhanced-img";
import { loadCachedPicture } from "./imageLoadUtils";

const loaders = import.meta.glob<Picture>("/src/lib/assets/cards/*.webp", {
  import: "default",
  query: { enhanced: true, format: "avif;webp" },
});

const cache = new Map<string, Picture>();
const inFlight = new Map<string, Promise<Picture | null>>();

export function resolveCardImagePath(imageFile: string): string {
  return `/src/lib/assets/cards/${imageFile}`;
}

export async function loadCardImage(imageFile: string): Promise<Picture | null> {
  return loadCachedPicture(
    loaders,
    cache,
    inFlight,
    resolveCardImagePath(imageFile),
  );
}
