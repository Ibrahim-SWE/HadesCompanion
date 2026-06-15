import type { Picture } from "@sveltejs/enhanced-img";

export const miscImages = import.meta.glob<Picture>(
  "/src/lib/assets/misc/*.webp",
  {
    eager: true,
    import: "default",
    query: { enhanced: true, format: 'avif;webp' },
  },
) as Record<string, Picture>;

export function miscImage(imgPath: string): Picture | undefined {
  return miscImages[`/src/lib/assets/misc/${imgPath}`];
}
