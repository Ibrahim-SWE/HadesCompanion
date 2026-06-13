export type DescriptionPart =
  | { type: "text_normal"; value: string }
  | { type: "text_bold"; value: string }
  | { type: "image"; name: string; img_path: string };

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
  prerequisites: object | null;
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
