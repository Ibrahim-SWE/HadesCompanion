import {
  buildMaskFromManualCards,
  decodeBuildMask,
  encodeBuildMask,
  manualCardsFromBuildMask,
} from "$lib/cards-url-codec";
import { SITE_ORIGIN } from "$lib/seo";

export const CARDS_PATH = "/hades2/cards";

export function isCardsPath(pathname: string): boolean {
  return pathname === CARDS_PATH || pathname.endsWith(CARDS_PATH);
}
/** Compact build code: base36-encoded 25-bit card bitmask */
export const BUILD_URL_PARAM = "b";
export const GRASP_URL_PARAM = "g";

/** @deprecated Legacy comma-separated card numbers — still read for old links */
const LEGACY_CARDS_URL_PARAM = "cards";
/** @deprecated Legacy grasp param — still read for old links */
const LEGACY_GRASP_URL_PARAM = "grasp";

export const DEFAULT_GRASP_BUDGET = 30;
export const MIN_GRASP_BUDGET = 10;
export const MAX_GRASP_BUDGET = 30;

export type CardBuildState = {
  manualCards: string[];
  graspBudget: number;
};

export const EMPTY_CARD_BUILD_STATE: CardBuildState = {
  manualCards: [],
  graspBudget: DEFAULT_GRASP_BUDGET,
};

function parseCommaSeparated(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function clampGraspBudget(value: number): number {
  return Math.min(MAX_GRASP_BUDGET, Math.max(MIN_GRASP_BUDGET, value));
}

function parseLegacyManualCards(
  params: URLSearchParams,
  numberToName: ReadonlyMap<number, string>,
  nameToNumber: ReadonlyMap<string, number>,
): string[] {
  const names: string[] = [];

  for (const token of parseCommaSeparated(params.get(LEGACY_CARDS_URL_PARAM))) {
    const cardNumber = parseInt(token, 10);
    if (Number.isNaN(cardNumber)) continue;

    const name = numberToName.get(cardNumber);
    if (!name || names.includes(name)) continue;
    names.push(name);
  }

  return manualCardsFromBuildMask(
    buildMaskFromManualCards(names, nameToNumber),
    numberToName,
  );
}

function parseGraspBudget(params: URLSearchParams): number {
  const raw = params.get(GRASP_URL_PARAM) ?? params.get(LEGACY_GRASP_URL_PARAM);
  if (raw === null) return DEFAULT_GRASP_BUDGET;

  const parsed = parseInt(raw, 10);
  if (Number.isNaN(parsed)) return DEFAULT_GRASP_BUDGET;
  return clampGraspBudget(parsed);
}

export function parseCardBuildFromSearchParams(
  params: URLSearchParams,
  numberToName: ReadonlyMap<number, string>,
  nameToNumber: ReadonlyMap<string, number>,
): CardBuildState {
  let manualCards: string[] = [];

  const buildToken = params.get(BUILD_URL_PARAM);
  if (buildToken) {
    const mask = decodeBuildMask(buildToken);
    if (mask !== null) {
      manualCards = manualCardsFromBuildMask(mask, numberToName);
    }
  } else if (params.has(LEGACY_CARDS_URL_PARAM)) {
    manualCards = parseLegacyManualCards(params, numberToName, nameToNumber);
  }

  return {
    manualCards,
    graspBudget: parseGraspBudget(params),
  };
}

export function serializeCardBuildToSearchParams(
  state: CardBuildState,
  nameToNumber: ReadonlyMap<string, number>,
): URLSearchParams {
  const params = new URLSearchParams();
  const code = encodeBuildMask(
    buildMaskFromManualCards(state.manualCards, nameToNumber),
  );

  if (code) params.set(BUILD_URL_PARAM, code);

  if (state.graspBudget !== DEFAULT_GRASP_BUDGET) {
    params.set(GRASP_URL_PARAM, String(state.graspBudget));
  }

  return params;
}

export function buildCardBuildReplaceHref(
  state: CardBuildState,
  pathname: string,
  nameToNumber: ReadonlyMap<string, number>,
): string {
  const query = serializeCardBuildToSearchParams(state, nameToNumber).toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function cardBuildUrlMatchesState(
  state: CardBuildState,
  url: URL,
  numberToName: ReadonlyMap<number, string>,
  nameToNumber: ReadonlyMap<string, number>,
): boolean {
  return cardBuildStatesEqual(
    state,
    parseCardBuildFromSearchParams(url.searchParams, numberToName, nameToNumber),
    nameToNumber,
  );
}

export function buildCardBuildShareUrl(
  state: CardBuildState,
  nameToNumber: ReadonlyMap<string, number>,
  origin: string = SITE_ORIGIN,
  pathname: string = CARDS_PATH,
): string {
  const path = buildCardBuildReplaceHref(state, pathname, nameToNumber);
  return `${origin.replace(/\/$/, "")}${path}`;
}

export function buildCardBuildShareSummary(
  state: CardBuildState,
  options: {
    graspUsed: number;
  },
): string {
  return `Hades 2 Arcana Build — ${options.graspUsed}/${state.graspBudget} Grasp`;
}

export function cardBuildStatesEqual(
  a: CardBuildState,
  b: CardBuildState,
  nameToNumber: ReadonlyMap<string, number>,
): boolean {
  return (
    a.graspBudget === b.graspBudget &&
    buildMaskFromManualCards(a.manualCards, nameToNumber) ===
      buildMaskFromManualCards(b.manualCards, nameToNumber)
  );
}
