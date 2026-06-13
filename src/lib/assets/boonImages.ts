const loaders = import.meta.glob<string>("/src/lib/assets/boons/**/*.webp", {
  import: "default",
});

const cache = new Map<string, string>();

export function resolveBoonImagePath(
  godFolder: string,
  imagePath: string,
): string {
  return imagePath.includes("/")
    ? `/src/lib/assets/boons/${imagePath}`
    : `/src/lib/assets/boons/${godFolder}/${imagePath}`;
}

export async function loadBoonImage(fullPath: string): Promise<string> {
  const cached = cache.get(fullPath);
  if (cached) return cached;

  const loader = loaders[fullPath];
  if (!loader) return "";

  const url = await loader();
  cache.set(fullPath, url);
  return url;
}
