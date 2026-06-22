import type { BoonData } from "$lib/types/hades2";

export const BOON_RARITY_ORDER = ["common", "rare", "epic", "heroic"] as const;

/** Type used for card styling; main `type` wins over Chaos `chaosType`. */
export function getBoonStyleType(boon: BoonData): string {
  const mainType = (boon.type ?? "").trim();
  if (mainType) return mainType.toLowerCase();
  return (boon.chaosType ?? "").trim().toLowerCase();
}

export function isChaosBlessing(boon: BoonData): boolean {
  return (boon.chaosType ?? "").toLowerCase() === "blessing";
}

export function getOrderedRarityEffects(boon: BoonData): [string, string][] {
  return BOON_RARITY_ORDER.flatMap((rarity) => {
    const value = boon.rarities_effect[rarity];
    return value ? [[rarity, value] as [string, string]] : [];
  });
}

/** Compact display for Chaos blessing ranges like "40%–60%" → "40-60%". */
export function compactRarityValue(value: string): string {
  const percentRange = value.match(/^([+-]?\d+)%[–-]([+-]?\d+)%$/);
  if (percentRange) return `${percentRange[1]}-${percentRange[2]}%`;

  const plainRange = value.match(/^([+-]?\d+)[–-]([+-]?\d+)$/);
  if (plainRange) return `${plainRange[1]}-${plainRange[2]}`;

  return value.replace(/–/g, "-");
}
