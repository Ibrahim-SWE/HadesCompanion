export type DescriptionPart =
  | { type: "text_normal"; value: string }
  | { type: "text_bold"; value: string }
  | { type: "image"; name: string; img_path: string }
  | {
      type: "range";
      value: string;
      rangeStart: number;
      rangeEnd: number;
    };

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
  effect: string | null;
  image_path: string;
  element: string | null;
  type: string | null;
  chaosType?: "blessing" | "curse" | null;
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
  type?: "god" | "character";
  hades_1: GodKeepsakeAndCurses | null;
  hades_2: GodKeepsakeAndCurses | null;
};

export type ResourceCost = {
  name: string;
  title: string;
  amount: number;
  image_path: string;
};

export type AlchemyRecipe = {
  name: string;
  image_path: string;
  description: string;
  description_rich: DescriptionPart[];
  cost: ResourceCost[];
  preparation_time: number;
};

export type Incantation = {
  name: string;
  image_path: string;
  description: string;
  description_rich: DescriptionPart[];
  unlock_requirements: ResourceCost[];
  prerequisites_rich: DescriptionPart[] | null;
};
