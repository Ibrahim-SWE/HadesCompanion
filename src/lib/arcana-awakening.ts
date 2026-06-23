import type { ArcanaGrid } from "$lib/arcana-grid";
import {
  getColumnIndices,
  getNeighborIndices,
  getRowIndices,
  isLineActive,
} from "$lib/arcana-grid";

export const AWAKENING_CARD_NAMES = [
  "The Moon",
  "The Centaur",
  "The Queen",
  "The Fates",
  "Divinity",
  "Judgement",
] as const;

export type AwakeningCardName = (typeof AWAKENING_CARD_NAMES)[number];

const AWAKENING_SET = new Set<string>(AWAKENING_CARD_NAMES);

export function isAwakeningCard(name: string): name is AwakeningCardName {
  return AWAKENING_SET.has(name);
}

export function filterManualCards(names: readonly string[]): string[] {
  return names.filter((name) => !isAwakeningCard(name));
}

function checkMoon(index: number, active: ReadonlySet<string>, grid: ArcanaGrid): boolean {
  const neighbors = getNeighborIndices(index);
  return neighbors.some((ni) => active.has(grid.cards[ni]!.name));
}

function checkFates(index: number, active: ReadonlySet<string>, grid: ArcanaGrid): boolean {
  const neighbors = getNeighborIndices(index);
  return neighbors.every((ni) => active.has(grid.cards[ni]!.name));
}

function checkDivinity(card: ArcanaCardMeta, active: ReadonlySet<string>, grid: ArcanaGrid): boolean {
  const indexToName = grid.cards.map((c) => c.name);

  for (let row = 0; row < 5; row++) {
    if (row === card.row) continue;
    if (isLineActive(getRowIndices(row), indexToName, active)) return true;
  }

  for (let col = 0; col < 5; col++) {
    if (col === card.col) continue;
    if (isLineActive(getColumnIndices(col), indexToName, active)) return true;
  }

  return false;
}

type ArcanaCardMeta = ArcanaGrid["cards"][number];

function checkCentaur(active: ReadonlySet<string>, grid: ArcanaGrid): boolean {
  const tiersPresent = new Set<number>();
  for (const name of active) {
    const cost = grid.graspByName.get(name) ?? 0;
    if (cost >= 1 && cost <= 5) tiersPresent.add(cost);
  }
  return [1, 2, 3, 4, 5].every((tier) => tiersPresent.has(tier));
}

function checkQueen(active: ReadonlySet<string>, grid: ArcanaGrid): boolean {
  const tierCounts = new Map<number, number>();
  let graspCardCount = 0;

  for (const name of active) {
    const cost = grid.graspByName.get(name) ?? 0;
    if (cost < 1 || cost > 5) continue;
    graspCardCount++;
    tierCounts.set(cost, (tierCounts.get(cost) ?? 0) + 1);
    if ((tierCounts.get(cost) ?? 0) > 2) return false;
  }

  return graspCardCount > 0;
}

function checkJudgement(manual: ReadonlySet<string>): boolean {
  return manual.size >= 1 && manual.size <= 3;
}

function checkAwakeningCondition(
  name: AwakeningCardName,
  manual: ReadonlySet<string>,
  active: ReadonlySet<string>,
  grid: ArcanaGrid,
): boolean {
  const index = grid.nameToIndex.get(name);
  if (index === undefined) return false;
  const card = grid.cards[index]!;

  switch (name) {
    case "The Moon":
      return checkMoon(index, active, grid);
    case "The Fates":
      return checkFates(index, active, grid);
    case "Divinity":
      return checkDivinity(card, active, grid);
    case "The Centaur":
      return checkCentaur(active, grid);
    case "The Queen":
      return checkQueen(active, grid);
    case "Judgement":
      return checkJudgement(manual);
    default:
      return false;
  }
}

export function computeAwakenedCards(
  manualNames: readonly string[],
  grid: ArcanaGrid,
): string[] {
  const manual = new Set(filterManualCards(manualNames));
  const awakened = new Set<string>();
  let changed = true;

  while (changed) {
    changed = false;
    const active = new Set([...manual, ...awakened]);

    for (const name of AWAKENING_CARD_NAMES) {
      if (awakened.has(name)) continue;
      if (
        checkAwakeningCondition(name, manual, active, grid)
      ) {
        awakened.add(name);
        changed = true;
      }
    }
  }

  return [...awakened];
}

export function computeActiveCards(
  manualNames: readonly string[],
  grid: ArcanaGrid,
): { manual: string[]; awakened: string[]; active: string[] } {
  const manual = filterManualCards(manualNames);
  const awakened = computeAwakenedCards(manual, grid);
  const active = [...new Set([...manual, ...awakened])];
  return { manual, awakened, active };
}

export function sumGraspCost(
  activeNames: readonly string[],
  grid: ArcanaGrid,
): number {
  return activeNames.reduce(
    (sum, name) => sum + (grid.graspByName.get(name) ?? 0),
    0,
  );
}
