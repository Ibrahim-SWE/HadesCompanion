import assert from "node:assert/strict";
import { buildArcanaGrid } from "../src/lib/arcana-grid.ts";
import {
  AWAKENING_CARD_NAMES,
  computeActiveCards,
  computeAwakenedCards,
  filterManualCards,
  isAwakeningCard,
} from "../src/lib/arcana-awakening.ts";
import cardsData from "../src/lib/data/hades2/arcana_cards.json";

const grid = buildArcanaGrid(
  cardsData as Record<
    string,
    { image_file: string; graspCost: string; note: string; name: string }
  >,
);

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

test("isAwakeningCard identifies the six awakening cards", () => {
  for (const name of AWAKENING_CARD_NAMES) {
    assert.equal(isAwakeningCard(name), true);
  }
  assert.equal(isAwakeningCard("The Sorceress"), false);
});

test("filterManualCards strips awakening cards", () => {
  assert.deepEqual(
    filterManualCards(["The Sorceress", "The Moon", "Death"]),
    ["The Sorceress", "Death"],
  );
});

test("The Moon awakens when a neighbor is active", () => {
  const awakened = computeAwakenedCards(["Eternity"], grid);
  assert.ok(awakened.includes("The Moon"));
});

test("The Moon does not awaken without neighbors", () => {
  const awakened = computeAwakenedCards(["The Sorceress"], grid);
  assert.ok(!awakened.includes("The Moon"));
});

test("The Fates requires all neighbors active", () => {
  const partial = computeAwakenedCards(["The Enchantress"], grid);
  assert.ok(!partial.includes("The Fates"));

  const full = computeAwakenedCards(
    ["The Enchantress", "The Boatman", "The Champions"],
    grid,
  );
  assert.ok(full.includes("The Fates"));
});

test("Divinity awakens when another row is fully active", () => {
  const row0 = grid.cards.filter((c) => c.row === 0).map((c) => c.name);
  const awakened = computeAwakenedCards(row0, grid);
  assert.ok(awakened.includes("Divinity"));
});

test("Divinity awakens when another column is fully active", () => {
  const col1 = grid.cards.filter((c) => c.col === 1).map((c) => c.name);
  const awakened = computeAwakenedCards(col1, grid);
  assert.ok(awakened.includes("Divinity"));
});

test("The Centaur requires grasp tiers 1 through 5", () => {
  const partial = computeAwakenedCards(
    ["The Sorceress", "The Huntress", "Eternity", "Death"],
    grid,
  );
  assert.ok(!partial.includes("The Centaur"));

  const full = computeAwakenedCards(
    [
      "The Sorceress",
      "The Huntress",
      "Eternity",
      "Death",
      "The Unseen",
    ],
    grid,
  );
  assert.ok(full.includes("The Centaur"));
});

test("The Queen does not awaken when three cards share a grasp tier", () => {
  const awakened = computeAwakenedCards(
    ["The Sorceress", "The Wayward Son", "The Messenger"],
    grid,
  );
  assert.ok(!awakened.includes("The Queen"));
});

test("The Queen awakens when no grasp tier exceeds two", () => {
  const awakened = computeAwakenedCards(
    ["The Sorceress", "The Huntress", "Death"],
    grid,
  );
  assert.ok(awakened.includes("The Queen"));
});

test("Judgement awakens with one to three manual cards only", () => {
  assert.ok(
    computeAwakenedCards(["The Sorceress", "Death"], grid).includes(
      "Judgement",
    ),
  );
  assert.ok(!computeAwakenedCards([], grid).includes("Judgement"));
  assert.ok(
    !computeAwakenedCards(
      ["The Sorceress", "The Huntress", "Death", "The Unseen"],
      grid,
    ).includes("Judgement"),
  );
});

test("The Queen does not awaken with an empty build", () => {
  assert.ok(!computeAwakenedCards([], grid).includes("The Queen"));
});

test("computeActiveCards merges manual and awakened", () => {
  const result = computeActiveCards(["Eternity"], grid);
  assert.deepEqual(result.manual, ["Eternity"]);
  assert.ok(result.awakened.includes("The Moon"));
  assert.ok(result.active.includes("The Moon"));
});

test("awakening cards cannot be passed as manual selections", () => {
  const result = computeActiveCards(["The Moon", "Eternity"], grid);
  assert.ok(!result.manual.includes("The Moon"));
  assert.ok(result.awakened.includes("The Moon"));
});

console.log("\nAll arcana awakening tests passed.");
