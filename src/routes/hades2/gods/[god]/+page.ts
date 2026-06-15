import { error } from "@sveltejs/kit";
import godsData from "$lib/data/gods.json";
import type { EntryGenerator, PageLoad } from "./$types";

export const entries: EntryGenerator = () =>
  Object.keys(godsData).map((god) => ({ god }));

export const load: PageLoad = ({ params }) => {
  const godName = params.god;

  if (!(godName in godsData)) {
    error(404, "God not found");
  }

  return { godName };
};
