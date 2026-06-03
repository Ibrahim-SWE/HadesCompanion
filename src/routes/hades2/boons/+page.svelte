<script lang="ts">
  import Boon from "$lib/components/Boon.svelte";
  import boonsData from "$lib/data/hades2/boons.json";

  type DescriptionPart =
    | { type: "text_normal"; value: string }
    | { type: "text_bold"; value: string }
    | { type: "image"; name: string; img_path: string };

  type BoonData = {
    gods: string[];
    name: string;
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

  const boonEntries = Object.entries(boonsData) as [string, BoonData][];
</script>

<section
  class="max-w-7xl items-center flex flex-col bg-[#343f34] p-1 border border-[#4c5a44] mt-2"
>
  <div class="filtersContainer"></div>
  <div
    class="boonsGridContainer grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1"
  >
    {#each boonEntries as [boonId, boon] (boonId)}
      <Boon {boon} />
    {/each}
  </div>
</section>
