import { CARD_COUNT } from "$lib/arcana-grid";
import { filterManualCards, isAwakeningCard } from "$lib/arcana-awakening";

/** Bitmask covering all 25 altar grid slots (card N → bit N−1). */
export const BUILD_MASK_MAX = (1 << CARD_COUNT) - 1;

export function buildMaskFromManualCards(
  manualCards: readonly string[],
  nameToNumber: ReadonlyMap<string, number>,
): number {
  let mask = 0;
  for (const name of filterManualCards(manualCards)) {
    const num = nameToNumber.get(name);
    if (num === undefined) continue;
    mask |= 1 << (num - 1);
  }
  return mask & BUILD_MASK_MAX;
}

export function manualCardsFromBuildMask(
  mask: number,
  numberToName: ReadonlyMap<number, string>,
): string[] {
  const cards: string[] = [];
  const clipped = mask & BUILD_MASK_MAX;

  for (let num = 1; num <= CARD_COUNT; num++) {
    if ((clipped & (1 << (num - 1))) === 0) continue;
    const name = numberToName.get(num);
    if (!name || isAwakeningCard(name)) continue;
    cards.push(name);
  }

  return cards;
}

/** Base36 bitmask — 1 char for small builds, up to ~6 for any 25-card combo. */
export function encodeBuildMask(mask: number): string {
  const clipped = mask & BUILD_MASK_MAX;
  if (clipped === 0) return "";
  return clipped.toString(36);
}

export function decodeBuildMask(token: string): number | null {
  const trimmed = token.trim().toLowerCase();
  if (!trimmed || !/^[0-9a-z]+$/.test(trimmed)) return null;

  const mask = parseInt(trimmed, 36);
  if (Number.isNaN(mask) || mask < 0 || mask > BUILD_MASK_MAX) return null;
  return mask;
}
