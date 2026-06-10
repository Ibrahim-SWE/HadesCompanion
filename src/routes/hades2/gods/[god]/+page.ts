import { error } from "@sveltejs/kit";
import godsData from "$lib/data/gods.json";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
  const godName = params.god;

  if (!(godName in godsData)) {
    error(404, "God not found");
  }

  return { godName };
};
