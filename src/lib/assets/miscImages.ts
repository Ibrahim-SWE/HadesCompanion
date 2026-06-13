export const miscImages = import.meta.glob<string>(
  "/src/lib/assets/misc/*.webp",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

export function miscImageUrl(imgPath: string): string {
  return miscImages[`/src/lib/assets/misc/${imgPath}`] ?? "";
}
