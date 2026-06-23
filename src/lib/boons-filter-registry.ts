/**
 * Canonical, frozen ordering for boon filters. The index of each entry is its
 * bit position in the compact `?f=` URL bitmask, so this order is permanent:
 * append new gods at the end only — never reorder or remove existing entries.
 */

export const BOON_GODS = [
  "Aphrodite",
  "Apollo",
  "Arachne",
  "Ares",
  "Artemis",
  "Athena",
  "Chaos",
  "Circe",
  "Demeter",
  "Dionysus",
  "Echo",
  "Hades",
  "Hephaestus",
  "Hera",
  "Hermes",
  "Hestia",
  "Icarus",
  "Medea",
  "Narcissus",
  "Poseidon",
  "Zeus",
] as const;

export const BOON_TYPES = [
  "Attack",
  "Special",
  "Cast",
  "Sprint",
  "Magick",
] as const;

/** "None" represents the null element (boons without an element). */
export const BOON_ELEMENTS = [
  "Earth",
  "Water",
  "Air",
  "Fire",
  "Aether",
  "None",
] as const;

function buildIndexMap(values: readonly string[]): ReadonlyMap<string, number> {
  return new Map(values.map((value, index) => [value, index]));
}

export const GOD_TO_INDEX = buildIndexMap(BOON_GODS);
export const TYPE_TO_INDEX = buildIndexMap(BOON_TYPES);
export const ELEMENT_TO_INDEX = buildIndexMap(BOON_ELEMENTS);
