import type { Picture } from "@sveltejs/enhanced-img";
import { loadCachedPicture } from "./imageLoadUtils";

const loaders = import.meta.glob<Picture>(
  "/src/lib/assets/incantations/*.webp",
  {
    import: "default",
    query: { enhanced: true, format: "avif;webp" },
  },
);

const cache = new Map<string, Picture>();
const inFlight = new Map<string, Promise<Picture | null>>();

export function resolveIncantationImagePath(imageFile: string): string {
  return `/src/lib/assets/incantations/${imageFile}`;
}

export async function loadIncantationImage(
  imageFile: string,
): Promise<Picture | null> {
  return loadCachedPicture(
    loaders,
    cache,
    inFlight,
    resolveIncantationImagePath(imageFile),
  );
}
