import assert from "node:assert/strict";
import { buildArcanaGrid } from "../src/lib/arcana-grid.ts";
import {
  buildMaskFromManualCards,
  decodeBuildMask,
  encodeBuildMask,
  manualCardsFromBuildMask,
} from "../src/lib/cards-url-codec.ts";
import {
  buildCardBuildReplaceHref,
  parseCardBuildFromSearchParams,
} from "../src/lib/cards-url.ts";
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

test("encode cards 1, 3, 11 as short base36 code", () => {
  const mask = buildMaskFromManualCards(
    ["The Sorceress", "The Huntress", "The Swift Runner"],
    grid.nameToNumber,
  );
  const code = encodeBuildMask(mask);
  assert.equal(code, "sl");
  assert.deepEqual(
    manualCardsFromBuildMask(decodeBuildMask(code)!, grid.numberToName),
    ["The Sorceress", "The Huntress", "The Swift Runner"],
  );
});

test("four manual cards in row 1 encode to one character", () => {
  const row1Manual = grid.cards
    .filter((c) => c.row === 0 && c.name !== "The Moon")
    .map((c) => c.name);
  const code = encodeBuildMask(buildMaskFromManualCards(row1Manual, grid.nameToNumber));
  assert.equal(code, "f");
});

test("URL uses b and g params without commas", () => {
  const href = buildCardBuildReplaceHref(
    {
      manualCards: ["The Sorceress", "The Huntress", "The Swift Runner"],
      graspBudget: 25,
    },
    "/hades2/cards",
    grid.nameToNumber,
  );
  assert.equal(href, "/hades2/cards?b=sl&g=25");

  const parsed = parseCardBuildFromSearchParams(
    new URL(href, "https://example.com").searchParams,
    grid.numberToName,
    grid.nameToNumber,
  );
  assert.deepEqual(parsed.manualCards, [
    "The Sorceress",
    "The Huntress",
    "The Swift Runner",
  ]);
  assert.equal(parsed.graspBudget, 25);
});

test("legacy cards=1,3,11 still parses", () => {
  const params = new URLSearchParams("cards=1,3,11&grasp=25");
  const parsed = parseCardBuildFromSearchParams(params, grid.numberToName, grid.nameToNumber);
  assert.deepEqual(parsed.manualCards, [
    "The Sorceress",
    "The Huntress",
    "The Swift Runner",
  ]);
});

test("empty build clears all URL params", () => {
  const href = buildCardBuildReplaceHref(
    { manualCards: [], graspBudget: 30 },
    "/hades2/cards",
    grid.nameToNumber,
  );
  assert.equal(href, "/hades2/cards");
});

console.log("\nAll cards URL codec tests passed.");
