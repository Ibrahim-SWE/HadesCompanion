import {
  decodeFilterMask,
  encodeFilterMask,
  type StructuredBoonFilters,
} from "./boons-filter-codec.ts";

export type BoonFilterState = StructuredBoonFilters & {
  searchQuery: string;
};

export const EMPTY_BOON_FILTER_STATE: BoonFilterState = {
  selectedGods: [],
  selectedTypes: [],
  selectedElements: [],
  coreFilter: null,
  olympDmgFilter: null,
  duoFilter: null,
  legendaryFilter: null,
  infusionFilter: null,
  searchQuery: "",
};

const BOONS_PATH = "/hades2/boons";

/** Compact base36-encoded filter bitmask. */
export const FILTER_URL_PARAM = "f";
/** Search text. */
export const SEARCH_URL_PARAM = "q";

export function parseBoonFiltersFromSearchParams(
  params: URLSearchParams,
): BoonFilterState {
  const token = params.get(FILTER_URL_PARAM);

  return {
    ...EMPTY_BOON_FILTER_STATE,
    ...(token ? decodeFilterMask(token) : null),
    searchQuery: params.get(SEARCH_URL_PARAM) ?? "",
  };
}

export function serializeBoonFiltersToSearchParams(
  state: BoonFilterState,
): URLSearchParams {
  const params = new URLSearchParams();

  const code = encodeFilterMask(state);
  if (code) params.set(FILTER_URL_PARAM, code);

  const search = state.searchQuery.trim();
  if (search) params.set(SEARCH_URL_PARAM, search);

  return params;
}

/** Href for replaceState — pathname-only when empty so params are actually cleared. */
export function buildBoonFilterReplaceHref(
  state: BoonFilterState,
  pathname: string,
): string {
  const query = serializeBoonFiltersToSearchParams(state).toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function buildBoonFilterPath(state: BoonFilterState): string {
  return buildBoonFilterReplaceHref(state, BOONS_PATH);
}

export function boonFilterUrlMatchesState(
  state: BoonFilterState,
  url: URL,
): boolean {
  return boonFilterStatesEqual(
    state,
    parseBoonFiltersFromSearchParams(url.searchParams),
  );
}

export function buildShareUrl(state: BoonFilterState, origin: string): string {
  const path = buildBoonFilterPath(state);
  return `${origin.replace(/\/$/, "")}${path}`;
}

function triStateLabel(name: string, value: boolean | null): string | null {
  if (value === null) return null;
  return value ? name : `not ${name}`;
}

function joinCapped(values: string[], max = 3): string {
  if (values.length <= max) return values.join(", ");
  return `${values.slice(0, max).join(", ")} ...`;
}

export function buildShareSummary(
  state: BoonFilterState,
  resultCount?: number,
): string {
  const parts: string[] = [];

  if (state.selectedGods.length > 0) {
    parts.push(joinCapped(state.selectedGods));
  }
  if (state.selectedTypes.length > 0) {
    parts.push(joinCapped(state.selectedTypes));
  }
  if (state.selectedElements.length > 0) {
    parts.push(
      joinCapped(state.selectedElements.map((element) => element ?? "None")),
    );
  }

  for (const label of [
    triStateLabel("Duo", state.duoFilter),
    triStateLabel("Legendary", state.legendaryFilter),
    triStateLabel("Infusion", state.infusionFilter),
    triStateLabel("Core", state.coreFilter),
    triStateLabel("Olympian DMG", state.olympDmgFilter),
  ]) {
    if (label) parts.push(label);
  }

  const search = state.searchQuery.trim();
  if (search) parts.push(`search: ${search}`);

  const filterText = parts.length > 0 ? parts.join(" — ") : "filtered list";

  const countText =
    resultCount !== undefined ? ` — ${resultCount} results` : "";

  return `Hades 2 Boons — ${filterText}${countText}`;
}

export function boonFilterStatesEqual(
  a: BoonFilterState,
  b: BoonFilterState,
): boolean {
  return (
    a.searchQuery.trim() === b.searchQuery.trim() &&
    a.coreFilter === b.coreFilter &&
    a.olympDmgFilter === b.olympDmgFilter &&
    a.duoFilter === b.duoFilter &&
    a.legendaryFilter === b.legendaryFilter &&
    a.infusionFilter === b.infusionFilter &&
    arraysEqual(a.selectedGods, b.selectedGods) &&
    arraysEqual(a.selectedTypes, b.selectedTypes) &&
    arraysEqual(a.selectedElements, b.selectedElements)
  );
}

function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}
