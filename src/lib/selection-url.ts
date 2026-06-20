export function parseSelectionFromSearchParams(
  params: URLSearchParams,
  paramName: string,
  validKeys: readonly string[],
  defaultKey: string,
): string {
  const value = params.get(paramName);
  if (!value) return defaultKey;
  return validKeys.includes(value) ? value : defaultKey;
}

export function buildSelectionReplaceHref(
  selectedKey: string,
  paramName: string,
  pathname: string,
  defaultKey: string,
): string {
  if (selectedKey === defaultKey) return pathname;

  const params = new URLSearchParams();
  params.set(paramName, selectedKey);
  return `${pathname}?${params.toString()}`;
}

export function selectionUrlMatchesState(
  selectedKey: string,
  paramName: string,
  url: URL,
  validKeys: readonly string[],
  defaultKey: string,
): boolean {
  return (
    parseSelectionFromSearchParams(
      url.searchParams,
      paramName,
      validKeys,
      defaultKey,
    ) === selectedKey
  );
}
