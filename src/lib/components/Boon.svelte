<script lang="ts">
  import airIcon from "$lib/assets/misc/air_element_icon.webp";
  import earthIcon from "$lib/assets/misc/earth_element_icon.webp";
  import waterIcon from "$lib/assets/misc/water_element_icon.webp";
  import fireIcon from "$lib/assets/misc/fire_element_icon.webp";
  import aetherIcon from "$lib/assets/misc/aether_element_icon.webp";

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

  const allBoonImages = import.meta.glob("/src/lib/assets/boons/**/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  let godFolder = $derived(
    boon.gods.length > 1 ? "shared_boons" : boon.gods[0],
  );
  let boonImagePath = $derived(
    boon.image_path.includes("/")
      ? `/src/lib/assets/boons/${boon.image_path}`
      : `/src/lib/assets/boons/${godFolder}/${boon.image_path}`,
  );
  let boonImg = $derived(allBoonImages[boonImagePath]);
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

  const elementIcons: Record<string, string> = {
    Air: airIcon,
    Earth: earthIcon,
    Water: waterIcon,
    Fire: fireIcon,
    Aether: aetherIcon,
  };

  let element = $derived(boon.element);

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
  class="boonContainer grid grid-cols-[1fr_1.8fr] w-full sm:max-w-xs text-white text-sm rounded-2xl overflow-hidden {boonStyle}"
>
  <!-- top-left: boon image + element icon -->
  <div
    class="imagesContainer col-start-1 row-start-1 shrink-0 p-2 justify-self-center"
  >
    <div class="relative inline-block w-fit">
      <img
        src={boonImg}
        alt="{boonName} Boon Image"
        class="w-16 h-16 sm:w-20 sm:h-20 object-cover"
      />
      {#if element && elementIcons[element]}
        <img
          class="absolute -top-1 -right-2 w-5 h-5 object-contain"
          src={elementIcons[element]}
          alt="{element} Element Icon"
        />
      {/if}
    </div>
  </div>

  <!-- top-right: name + description -->
  <div
    class="infoContainer col-start-2 row-start-1 flex flex-col justify-center gap-1 p-2 min-w-0 self-start"
  >
    <h2 class="text-base sm:text-lg font-bold leading-tight text-[#eff7e8]">
      {boonName}
    </h2>
    <p class="text-xs text-[#a8b59f] leading-snug">
      {#each desc as part, i (`${part.type}-${i}`)}
        {#if part.type === "text_normal"}<span>{part.value}</span>
        {:else if part.type === "text_bold"}<strong
            class="text-white font-semibold">{part.value}</strong
          >
        {:else if part.type === "image"}<img
            src={miscImages[`/src/lib/assets/misc/${part.img_path}`]}
            alt={part.name}
            class="inline-block h-[0.95em] w-auto object-contain align-middle"
          />{/if}
      {/each}
    </p>
  </div>

  <!-- bottom-left: type / core / olympian damage badges -->
  <div class="detailsContainer col-start-1 row-start-2 flex flex-col gap-1 p-2">
    {#if boon.type}
      <span
        class="text-center px-2 py-0.5 rounded-md border border-[#4c5a44] text-[11px] text-[#d4dec8] bg-[#182118]"
      >
        {boon.type}
      </span>
    {/if}

    {#if isCore}
      <span
        class="text-center px-2 py-0.5 rounded-md border border-[#4c5a44] bg-[#182118] text-[11px] text-[#e3ead8]"
      >
        Core
      </span>
    {/if}

    {#if isOlympDamage}
      <span
        class="text-center px-1 py-0.5 rounded-md border border-[#4c5a44] bg-[#182118] text-[10px] sm:text-[11px] text-[#e3ead8] truncate"
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
