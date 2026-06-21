import { jsonLdForCardsList, withJsonLd } from "$lib/json-ld";
import { PAGE_SEO } from "$lib/seo";
import type { PageLoad } from "./$types";

export const load: PageLoad = () => ({
  seo: withJsonLd(PAGE_SEO.cards, jsonLdForCardsList()),
});
