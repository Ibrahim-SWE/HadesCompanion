<script lang="ts">
  import BoonImgElemIcon from "./BoonImg_ElemIcon.svelte";

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

  let { boon }: { boon: BoonData } = $props();

  let boonName = $derived(boon.name);
  let desc = $derived(boon.description_rich);

  let isCore = $derived(boon.is_core);

  const rarityColors: Record<string, string> = {
    common: "text-common",
    rare: "text-rare",
    epic: "text-epic",
    heroic: "text-heroic",
  };

  // Filter out null rarities and keep [key, value] pairs
  let effectsValues = $derived(
    Object.entries(
      boon.rarities_effect as Record<string, string | null>,
    ).filter(([, v]) => v !== null) as [string, string][],
  );
  let isOlympDamage = $derived(boon.deals_olympian_damage);

  // card style varies by boon type
  const typeStyles: Record<string, string> = {
    duo: "bg-linear-to-b from-[#0c1f0e] to-[#06110a] border border-[#3e9e57] shadow-2xl shadow-green-900/50",
    legendary:
      "bg-linear-to-b from-[#1e1606] to-[#100d03] border border-[#c8911f] shadow-2xl shadow-amber-900/50",
  };
  let normalizedType = $derived((boon.type ?? "").trim().toLowerCase());
  let boonStyle = $derived(
    typeStyles[normalizedType] ??
      "border border-[#53564f] shadow-2xl shadow-black/60 bg-[#1a1c18]",
  );

  const miscImages = import.meta.glob("/src/lib/assets/misc/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;
</script>

<div
  class="boonContainer grid grid-cols-[1fr_1.8fr] w-full sm:max-w-xs text-white text-xs rounded-2xl overflow-hidden {boonStyle}"
>
  <!-- top-left: boon image + element icon -->
  <BoonImgElemIcon {boon} />

  <!-- top-right: name + description -->
  <div
    class="infoContainer col-start-2 row-start-1 flex flex-col justify-center gap-1 p-2 min-w-0 self-start border-l border-white/20 rounded-xl"
  >
    <h2 class="text-base sm:text-lg font-bold leading-tight text-[#eff7e8]">
      {boonName}
    </h2>
    <p class=" text-[#a8b59f] leading-snug">
      {#each desc as part, i (`${part.type}-${i}`)}
        {#if part.type === "text_normal"}<span>{part.value}</span>
        {:else if part.type === "text_bold"}<strong
            class="text-white font-semibold">{part.value}</strong
          >
        {:else if part.type === "image"}<img
            src={miscImages[`/src/lib/assets/misc/${part.img_path}`]}
            alt={part.name}
            class="inline-block h-[1.4em] w-auto object-contain align-middle"
            loading="lazy"
            decoding="async"
          />{/if}
      {/each}
    </p>
  </div>

  <!-- bottom-left: type / core / olympian damage badges -->
  <div
    class="detailsContainer col-start-1 row-start-2 flex flex-col gap-0.5 p-1.5"
  >
    {#if boon.type}
      <span
        class="text-center py-0.5 rounded-sm border border-[#4c5a44] text-[#d4dec8] bg-[#182118]"
      >
        {boon.type}
      </span>
    {/if}

    {#if isCore}
      <span
        class="text-center py-0.5 rounded-sm border border-[#4c5a44] bg-[#182118] text-[#e3ead8]"
      >
        Core
      </span>
    {/if}

    {#if isOlympDamage}
      <span
        class="text-center py-0.5 rounded-sm border border-[#4c5a44] bg-[#182118] text-[#e3ead8] truncate"
        title="Olympian Damage"
      >
        Olympian DMG
      </span>
    {/if}
  </div>

  <!-- bottom-right: effect label + rarity values -->
  {#if effectsValues.length > 0}
    <div
      class="effectsContainer col-start-2 row-start-2 flex flex-col justify-center text-xs gap-y-0.5 self-start"
    >
      <div class="flex items-center gap-1">
        <span class="text-[#8aa377]">▶</span>
        <span class="text-[#d7e6cf]">{boon.effect}</span>
      </div>
      <div class="ml-3.5 flex flex-wrap items-center gap-x-1 gap-y-0.5">
        {#each effectsValues as [rarity, value], i (rarity)}
          {#if i > 0}<span class="text-[#4f5d47]">/</span>{/if}
          <span
            class="effectText font-extrabold {rarityColors[rarity] ??
              'text-otherRarities'}">{value}</span
          >
        {/each}
      </div>
    </div>
  {/if}
</div>
