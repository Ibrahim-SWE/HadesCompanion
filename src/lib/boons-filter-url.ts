import { SITE_ORIGIN } from "$lib/seo";

export type BoonFilterState = {
  selectedGods: string[];
  selectedTypes: string[];
  selectedElements: (string | null)[];
  coreFilter: boolean | null;
  olympDmgFilter: boolean | null;
  duoFilter: boolean | null;
  legendaryFilter: boolean | null;
  infusionFilter: boolean | null;
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

const TRI_STATE_PARAMS = [
  ["core", "coreFilter"],
  ["olymp", "olympDmgFilter"],
  ["duo", "duoFilter"],
  ["legendary", "legendaryFilter"],
  ["infusion", "infusionFilter"],
] as const;

function parseCommaSeparated(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseTriState(value: string | null): boolean | null {
  if (value === "1") return true;
  if (value === "0") return false;
  return null;
}

function serializeTriState(value: boolean | null): string | null {
  if (value === true) return "1";
  if (value === false) return "0";
  return null;
}

function serializeCommaSeparated(values: string[]): string | null {
  if (values.length === 0) return null;
  return values.join(",");
}

function elementToParam(element: string | null): string {
  return element === null ? "None" : element;
}

function elementFromParam(value: string): string | null {
  return value === "None" ? null : value;
}

export function parseBoonFiltersFromSearchParams(
  params: URLSearchParams,
): BoonFilterState {
  const elements = parseCommaSeparated(params.get("elements")).map(
    elementFromParam,
  );

  return {
    selectedGods: parseCommaSeparated(params.get("gods")),
    selectedTypes: parseCommaSeparated(params.get("types")),
    selectedElements: elements,
    coreFilter: parseTriState(params.get("core")),
    olympDmgFilter: parseTriState(params.get("olymp")),
    duoFilter: parseTriState(params.get("duo")),
    legendaryFilter: parseTriState(params.get("legendary")),
    infusionFilter: parseTriState(params.get("infusion")),
    searchQuery: params.get("search") ?? "",
  };
}

export function serializeBoonFiltersToSearchParams(
  state: BoonFilterState,
): URLSearchParams {
  const params = new URLSearchParams();

  const search = state.searchQuery.trim();
  if (search) params.set("search", search);

  const gods = serializeCommaSeparated(state.selectedGods);
  if (gods) params.set("gods", gods);

  const types = serializeCommaSeparated(state.selectedTypes);
  if (types) params.set("types", types);

  if (state.selectedElements.length > 0) {
    params.set(
      "elements",
      state.selectedElements.map(elementToParam).join(","),
    );
  }

  for (const [param, key] of TRI_STATE_PARAMS) {
    const value = serializeTriState(state[key]);
    if (value !== null) params.set(param, value);
  }

  return params;
}

export function buildBoonFilterPath(state: BoonFilterState): string {
  const query = serializeBoonFiltersToSearchParams(state).toString();
  return query ? `${BOONS_PATH}?${query}` : BOONS_PATH;
}

export function buildBoonFilterUrl(
  state: BoonFilterState,
  currentUrl: URL,
): URL {
  const url = new URL(currentUrl);
  const query = serializeBoonFiltersToSearchParams(state).toString();
  url.search = query ? `?${query}` : "";
  return url;
}

/** Href for replaceState — pathname-only when empty so params are actually cleared. */
export function buildBoonFilterReplaceHref(
  state: BoonFilterState,
  pathname: string,
): string {
  const query = serializeBoonFiltersToSearchParams(state).toString();
  return query ? `${pathname}?${query}` : pathname;
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

export function buildShareUrl(
  state: BoonFilterState,
  origin: string = SITE_ORIGIN,
): string {
  const path = buildBoonFilterPath(state);
  return `${origin.replace(/\/$/, "")}${path}`;
}

function triStateLabel(name: string, value: boolean | null): string | null {
  if (value === null) return null;
  return value ? name : `not ${name}`;
}

export function buildShareSummary(
  state: BoonFilterState,
  resultCount?: number,
): string {
  const parts: string[] = [];

  if (state.selectedGods.length > 0) {
    parts.push(state.selectedGods.join(", "));
  }
  if (state.selectedTypes.length > 0) {
    parts.push(state.selectedTypes.join(", "));
  }
  if (state.selectedElements.length > 0) {
    parts.push(
      state.selectedElements.map((element) => element ?? "None").join(", "),
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

  const filterText =
    parts.length > 0 ? parts.join(" · ") : "filtered list";

  const countText =
    resultCount !== undefined ? ` · ${resultCount} results` : "";

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
