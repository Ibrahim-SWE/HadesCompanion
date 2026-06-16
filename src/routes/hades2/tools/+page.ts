import { PAGE_SEO } from "$lib/seo";
import type { PageLoad } from "./$types";

export const load: PageLoad = () => ({
  seo: PAGE_SEO.tools,
});
