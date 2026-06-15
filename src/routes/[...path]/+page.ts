import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const prerender = false;

export const load: PageLoad = () => {
  error(404, "Lost in the Underworld");
};
