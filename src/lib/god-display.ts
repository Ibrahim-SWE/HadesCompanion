import type { GodDetails } from "$lib/types/hades2";

export function getGodTypeLabel(godData: GodDetails): "God" | "Character" {
  return godData.type === "character" ? "Character" : "God";
}
