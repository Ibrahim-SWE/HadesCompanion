import {
  buildSelectionReplaceHref,
  parseSelectionFromSearchParams,
  selectionUrlMatchesState,
} from "$lib/selection-url";

export const ALL_WEAPONS_KEY = "all";
export const WEAPON_URL_PARAM = "weapon";

export function parseWeaponFromSearchParams(
  params: URLSearchParams,
  validKeys: readonly string[],
  defaultKey: string = ALL_WEAPONS_KEY,
): string {
  return parseSelectionFromSearchParams(
    params,
    WEAPON_URL_PARAM,
    validKeys,
    defaultKey,
  );
}

export function buildWeaponReplaceHref(
  weaponKey: string,
  pathname: string,
  defaultKey: string = ALL_WEAPONS_KEY,
): string {
  return buildSelectionReplaceHref(
    weaponKey,
    WEAPON_URL_PARAM,
    pathname,
    defaultKey,
  );
}

export function weaponUrlMatchesState(
  weaponKey: string,
  url: URL,
  validKeys: readonly string[],
  defaultKey: string = ALL_WEAPONS_KEY,
): boolean {
  return selectionUrlMatchesState(
    weaponKey,
    WEAPON_URL_PARAM,
    url,
    validKeys,
    defaultKey,
  );
}
