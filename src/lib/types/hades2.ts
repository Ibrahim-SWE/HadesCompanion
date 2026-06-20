export type DescriptionPart =
  | { type: "text_normal"; value: string }
  | { type: "text_bold"; value: string }
  | { type: "image"; name: string; img_path: string };

export type ElementRequirement = { element: string; amount: number };

export type BoonPrerequisites =
  | { condition: string }
  | { boons: string[][] }
  | { satisfy_one: ElementRequirement[] }
  | { satisfy_all: ElementRequirement[] }
  | null;

export type BoonData = {
  gods: string[];
  name: string;
  description: string;
  description_rich: DescriptionPart[];
  effect: string;
  image_path: string;
  element: string | null;
  type: string | null;
  is_core: boolean;
  rarities_effect: Record<string, string | null>;
  deals_olympian_damage: boolean;
  prerequisites: BoonPrerequisites;
};

export type GodKeepsakeAndCurses = {
  keepsake: string;
  curses: string[];
};

export type GodDetails = {
  title: string;
  hades_1: GodKeepsakeAndCurses | null;
  hades_2: GodKeepsakeAndCurses | null;
};
