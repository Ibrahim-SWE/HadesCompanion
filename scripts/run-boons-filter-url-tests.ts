import assert from "node:assert/strict";
import {
  decodeFilterMask,
  encodeFilterMask,
} from "../src/lib/boons-filter-codec.ts";
import {
  buildBoonFilterReplaceHref,
  EMPTY_BOON_FILTER_STATE,
  parseBoonFiltersFromSearchParams,
  serializeBoonFiltersToSearchParams,
  type BoonFilterState,
} from "../src/lib/boons-filter-url.ts";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

const fullState: BoonFilterState = {
  selectedGods: [
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
  ],
  selectedTypes: ["Attack", "Special", "Cast"],
  selectedElements: ["Earth", "Water", null],
  coreFilter: true,
  olympDmgFilter: false,
  duoFilter: null,
  legendaryFilter: true,
  infusionFilter: null,
  searchQuery: "lightning dash",
};

test("structured filters round-trip through the bitmask", () => {
  const code = encodeFilterMask(fullState);
  assert.ok(code.length > 0 && code.length <= 8, `unexpected token: ${code}`);

  const decoded = decodeFilterMask(code);
  assert.ok(decoded !== null);
  assert.deepEqual(decoded.selectedGods, fullState.selectedGods);
  assert.deepEqual(decoded.selectedTypes, fullState.selectedTypes);
  assert.deepEqual(decoded.selectedElements, fullState.selectedElements);
  assert.equal(decoded.coreFilter, true);
  assert.equal(decoded.olympDmgFilter, false);
  assert.equal(decoded.duoFilter, null);
  assert.equal(decoded.legendaryFilter, true);
  assert.equal(decoded.infusionFilter, null);
});

test("full state round-trips through URL params (f + q)", () => {
  const href = buildBoonFilterReplaceHref(fullState, "/hades2/boons");
  const url = new URL(href, "https://example.com");

  assert.ok(url.searchParams.has("f"));
  assert.equal(url.searchParams.get("q"), "lightning dash");

  const parsed = parseBoonFiltersFromSearchParams(url.searchParams);
  assert.deepEqual(parsed, fullState);
});

test("empty state produces a bare path with no params", () => {
  const href = buildBoonFilterReplaceHref(
    EMPTY_BOON_FILTER_STATE,
    "/hades2/boons",
  );
  assert.equal(href, "/hades2/boons");
});

test("search-only state writes just q", () => {
  const params = serializeBoonFiltersToSearchParams({
    ...EMPTY_BOON_FILTER_STATE,
    searchQuery: "hex",
  });
  assert.equal(params.get("f"), null);
  assert.equal(params.get("q"), "hex");
});

test("invalid f token falls back to empty filters", () => {
  const params = new URLSearchParams("f=!!!&q=hi");
  const parsed = parseBoonFiltersFromSearchParams(params);
  assert.deepEqual(parsed, {
    ...EMPTY_BOON_FILTER_STATE,
    searchQuery: "hi",
  });
});

test("element None maps to null and back", () => {
  const state: BoonFilterState = {
    ...EMPTY_BOON_FILTER_STATE,
    selectedElements: [null],
  };
  const code = encodeFilterMask(state);
  const decoded = decodeFilterMask(code);
  assert.deepEqual(decoded?.selectedElements, [null]);
});

console.log("\nAll boons filter URL codec tests passed.");
