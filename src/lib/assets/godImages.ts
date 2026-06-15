import type { Picture } from "@sveltejs/enhanced-img";
import { loadCachedPicture } from "./imageLoadUtils";

const loaders = import.meta.glob<Picture>("/src/lib/assets/gods/*.webp", {
  import: "default",
  query: { enhanced: true, format: "avif;webp" },
});

const cache = new Map<string, Picture>();
const inFlight = new Map<string, Promise<Picture | null>>();

export function resolveGodImagePath(godName: string): string {
  return `/src/lib/assets/gods/${godName}.webp`;
}

export async function loadGodImage(godName: string): Promise<Picture | null> {
  return loadCachedPicture(
    loaders,
    cache,
    inFlight,
    resolveGodImagePath(godName),
  );
}
