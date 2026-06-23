import {
  BOON_ELEMENTS,
  BOON_GODS,
  BOON_TYPES,
  ELEMENT_TO_INDEX,
  GOD_TO_INDEX,
  TYPE_TO_INDEX,
} from "./boons-filter-registry.ts";

/** Structured boon filters that pack into the compact `?f=` bitmask (no search). */
export type StructuredBoonFilters = {
  selectedGods: string[];
  selectedTypes: string[];
  selectedElements: (string | null)[];
  coreFilter: boolean | null;
  olympDmgFilter: boolean | null;
  duoFilter: boolean | null;
  legendaryFilter: boolean | null;
  infusionFilter: boolean | null;
};

/**
 * Bit layout (42 bits total):
 *   0–20   gods       (21)
 *   21–25  types      (5)
 *   26–31  elements   (6, index 5 = "None" → null)
 *   32–41  tri-states (5 × 2 bits)
 */
const GODS_OFFSET = 0n;
const TYPES_OFFSET = 21n;
const ELEMENTS_OFFSET = 26n;
const TRISTATE_OFFSET = 32n;

/** Tri-state order — index drives the bit pair within the tri-state region. */
const TRI_STATE_KEYS = [
  "coreFilter",
  "olympDmgFilter",
  "duoFilter",
  "legendaryFilter",
  "infusionFilter",
] as const satisfies readonly (keyof StructuredBoonFilters)[];

const TOTAL_BITS = TRISTATE_OFFSET + BigInt(TRI_STATE_KEYS.length * 2);
export const FILTER_MASK_MAX = (1n << TOTAL_BITS) - 1n;

function triStateToBits(value: boolean | null): bigint {
  if (value === true) return 1n;
  if (value === false) return 2n;
  return 0n;
}

function triStateFromBits(bits: bigint): boolean | null {
  if (bits === 1n) return true;
  if (bits === 2n) return false;
  return null;
}

export function filterMaskFromState(filters: StructuredBoonFilters): bigint {
  let mask = 0n;

  for (const god of filters.selectedGods) {
    const index = GOD_TO_INDEX.get(god);
    if (index !== undefined) mask |= 1n << (GODS_OFFSET + BigInt(index));
  }

  for (const type of filters.selectedTypes) {
    const index = TYPE_TO_INDEX.get(type);
    if (index !== undefined) mask |= 1n << (TYPES_OFFSET + BigInt(index));
  }

  for (const element of filters.selectedElements) {
    const index = ELEMENT_TO_INDEX.get(element ?? "None");
    if (index !== undefined) mask |= 1n << (ELEMENTS_OFFSET + BigInt(index));
  }

  TRI_STATE_KEYS.forEach((key, index) => {
    const bits = triStateToBits(filters[key]);
    mask |= bits << (TRISTATE_OFFSET + BigInt(index * 2));
  });

  return mask;
}

export function stateFromFilterMask(mask: bigint): StructuredBoonFilters {
  const selectedGods: string[] = [];
  BOON_GODS.forEach((god, index) => {
    if (mask & (1n << (GODS_OFFSET + BigInt(index)))) selectedGods.push(god);
  });

  const selectedTypes: string[] = [];
  BOON_TYPES.forEach((type, index) => {
    if (mask & (1n << (TYPES_OFFSET + BigInt(index)))) selectedTypes.push(type);
  });

  const selectedElements: (string | null)[] = [];
  BOON_ELEMENTS.forEach((element, index) => {
    if (mask & (1n << (ELEMENTS_OFFSET + BigInt(index)))) {
      selectedElements.push(element === "None" ? null : element);
    }
  });

  const triStates = {} as Record<(typeof TRI_STATE_KEYS)[number], boolean | null>;
  TRI_STATE_KEYS.forEach((key, index) => {
    const bits = (mask >> (TRISTATE_OFFSET + BigInt(index * 2))) & 3n;
    triStates[key] = triStateFromBits(bits);
  });

  return {
    selectedGods,
    selectedTypes,
    selectedElements,
    ...triStates,
  };
}

function base36ToBigInt(token: string): bigint {
  let result = 0n;
  for (const char of token) {
    result = result * 36n + BigInt(parseInt(char, 36));
  }
  return result;
}

/** Base36 bitmask — empty string when no structured filters are active. */
export function encodeFilterMask(filters: StructuredBoonFilters): string {
  const mask = filterMaskFromState(filters);
  return mask === 0n ? "" : mask.toString(36);
}

export function decodeFilterMask(token: string): StructuredBoonFilters | null {
  const trimmed = token.trim().toLowerCase();
  if (!trimmed || !/^[0-9a-z]+$/.test(trimmed)) return null;

  const mask = base36ToBigInt(trimmed);
  if (mask > FILTER_MASK_MAX) return null;

  return stateFromFilterMask(mask);
}
