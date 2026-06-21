import type { Picture } from "@sveltejs/enhanced-img";

const images = import.meta.glob<Picture>("./favicon.webp", {
  eager: true,
  import: "default",
  query: { enhanced: true, format: "avif;webp" },
});

export const faviconImg = images["./favicon.webp"]!;
