import { error } from "@sveltejs/kit";
import { loadGodImage } from "$lib/assets/godImages";
import godsData from "$lib/data/gods.json";
import { absoluteUrl, godPageSeo } from "$lib/seo";
import type { GodDetails } from "$lib/types/hades2";
import type { EntryGenerator, PageLoad } from "./$types";

export const entries: EntryGenerator = () =>
  Object.keys(godsData).map((god) => ({ god }));

export const load: PageLoad = async ({ params }) => {
  const godName = params.god;

  if (!(godName in godsData)) {
    error(404, "Lost in the Underworld");
  }

  const godData = (godsData as Record<string, GodDetails>)[godName];
  const picture = await loadGodImage(godName);
  const ogImage = picture ? absoluteUrl(picture.img.src) : undefined;

  return {
    godName,
    seo: godPageSeo(godName, godData.title, ogImage),
  };
};
