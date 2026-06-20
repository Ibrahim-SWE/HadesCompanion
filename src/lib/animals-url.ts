import {
  buildSelectionReplaceHref,
  parseSelectionFromSearchParams,
  selectionUrlMatchesState,
} from "$lib/selection-url";

export const ALL_PETS_KEY = "all";
export const PET_URL_PARAM = "pet";

export function parsePetFromSearchParams(
  params: URLSearchParams,
  validKeys: readonly string[],
  defaultKey: string = ALL_PETS_KEY,
): string {
  return parseSelectionFromSearchParams(
    params,
    PET_URL_PARAM,
    validKeys,
    defaultKey,
  );
}

export function buildPetReplaceHref(
  petKey: string,
  pathname: string,
  defaultKey: string = ALL_PETS_KEY,
): string {
  return buildSelectionReplaceHref(
    petKey,
    PET_URL_PARAM,
    pathname,
    defaultKey,
  );
}

export function petUrlMatchesState(
  petKey: string,
  url: URL,
  validKeys: readonly string[],
  defaultKey: string = ALL_PETS_KEY,
): boolean {
  return selectionUrlMatchesState(
    petKey,
    PET_URL_PARAM,
    url,
    validKeys,
    defaultKey,
  );
}
