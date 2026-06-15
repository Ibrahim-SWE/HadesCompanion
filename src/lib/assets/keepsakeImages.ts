import type { Picture } from "@sveltejs/enhanced-img";
import { loadCachedPicture } from "./imageLoadUtils";

const loaders = import.meta.glob<Picture>("/src/lib/assets/keepsakes/*.webp", {
  import: "default",
  query: { enhanced: true, format: "avif;webp" },
});

const cache = new Map<string, Picture>();
const inFlight = new Map<string, Promise<Picture | null>>();

export function resolveKeepsakeImagePath(imageFile: string): string {
  return `/src/lib/assets/keepsakes/${imageFile}`;
}

export async function loadKeepsakeImage(
  imageFile: string,
): Promise<Picture | null> {
  return loadCachedPicture(
    loaders,
    cache,
    inFlight,
    resolveKeepsakeImagePath(imageFile),
  );
}
