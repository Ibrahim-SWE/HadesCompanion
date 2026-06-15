import type { Picture } from "@sveltejs/enhanced-img";

const loaders = import.meta.glob<Picture>("/src/lib/assets/boons/**/*.webp", {
  import: "default",
  query: { enhanced: true, format: 'avif;webp' },
});

const cache = new Map<string, Picture>();

export function resolveBoonImagePath(
  godFolder: string,
  imagePath: string,
): string {
  return imagePath.includes("/")
    ? `/src/lib/assets/boons/${imagePath}`
    : `/src/lib/assets/boons/${godFolder}/${imagePath}`;
}

export async function loadBoonImage(fullPath: string): Promise<Picture | null> {
  const cached = cache.get(fullPath);
  if (cached) return cached;

  const loader = loaders[fullPath];
  if (!loader) return null;

  const picture = await loader();
  cache.set(fullPath, picture);
  return picture;
}
