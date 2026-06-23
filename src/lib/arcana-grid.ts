export const GRID_COLS = 5;
export const GRID_ROWS = 5;
export const CARD_COUNT = GRID_COLS * GRID_ROWS;

export type ArcanaCardMeta = {
  name: string;
  /** 1-based grid position (row-major: 1–5 row 1, 6–10 row 2, …) */
  number: number;
  index: number;
  row: number;
  col: number;
  graspCost: number;
  note: string;
};

export type ArcanaGrid = {
  cards: ArcanaCardMeta[];
  nameToIndex: ReadonlyMap<string, number>;
  nameToNumber: ReadonlyMap<string, number>;
  numberToName: ReadonlyMap<number, string>;
  graspByName: ReadonlyMap<string, number>;
};

export function cardNumberFromIndex(index: number): number {
  return index + 1;
}

export function indexFromCardNumber(cardNumber: number): number | null {
  if (!Number.isInteger(cardNumber) || cardNumber < 1 || cardNumber > CARD_COUNT) {
    return null;
  }
  return cardNumber - 1;
}

export function buildArcanaGrid(
  cardsData: Record<
    string,
    { image_file: string; graspCost: string; note: string; name: string }
  >,
): ArcanaGrid {
  const cards: ArcanaCardMeta[] = Object.entries(cardsData).map(
    ([name, details], index) => {
      const row = Math.floor(index / GRID_COLS);
      const col = index % GRID_COLS;
      return {
        name,
        number: cardNumberFromIndex(index),
        index,
        row,
        col,
        graspCost: parseInt(details.graspCost, 10) || 0,
        note: details.note ?? "",
      };
    },
  );

  const nameToIndex = new Map(cards.map((card) => [card.name, card.index]));
  const nameToNumber = new Map(cards.map((card) => [card.name, card.number]));
  const numberToName = new Map(cards.map((card) => [card.number, card.name]));
  const graspByName = new Map(cards.map((card) => [card.name, card.graspCost]));

  return {
    cards,
    nameToIndex,
    nameToNumber,
    numberToName,
    graspByName,
  };
}

export function indexToRowCol(index: number): { row: number; col: number } {
  return { row: Math.floor(index / GRID_COLS), col: index % GRID_COLS };
}

export function rowColToIndex(row: number, col: number): number {
  return row * GRID_COLS + col;
}

export function getNeighborIndices(index: number): number[] {
  const { row, col } = indexToRowCol(index);
  const neighbors: number[] = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS) {
        neighbors.push(rowColToIndex(nr, nc));
      }
    }
  }

  return neighbors;
}

export function getRowIndices(row: number): number[] {
  return Array.from({ length: GRID_COLS }, (_, col) =>
    rowColToIndex(row, col),
  );
}

export function getColumnIndices(col: number): number[] {
  return Array.from({ length: GRID_ROWS }, (_, row) =>
    rowColToIndex(row, col),
  );
}

export function isLineActive(
  indices: number[],
  indexToName: readonly string[],
  activeNames: ReadonlySet<string>,
): boolean {
  return indices.every((index) => activeNames.has(indexToName[index]!));
}

export function namesAtIndices(
  indices: number[],
  indexToName: readonly string[],
): string[] {
  return indices.map((index) => indexToName[index]!);
}
