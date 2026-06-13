<script lang="ts">
  import BoonImgElemIcon from "./BoonImg_ElemIcon.svelte";
  import { miscImageUrl } from "$lib/assets/miscImages";
  import type { BoonData } from "$lib/types/hades2";

  let {
    boon,
    onGodFilter,
  }: {
    boon: BoonData;
    onGodFilter?: (god: string) => void;
  } = $props();

  const rarityColors: Record<string, string> = {
    common: "text-[#d6d1c2]",
    rare: "text-[#3f35ec]",
    epic: "text-[#9c37a6]",
    heroic: "text-[#d0102b]",
    duo: "text-[#46f08f]",
    legendary: "text-[#e8b84a]",
    infusion: "text-[#c071ff]",
  };

  let effectsValues = $derived(
    Object.entries(boon.rarities_effect).filter(
      (entry): entry is [string, string] => entry[1] !== null,
    ),
  );

  const typeAccents: Record<string, string> = {
    duo: "#3e9e57",
    legendary: "#c8911f",
    infusion: "#9c37a6",
  };

  const typeCardStyles: Record<string, string> = {
    duo: "bg-linear-to-r from-[#0c1f0e] to-[#06110a] border-[#3e9e57]/60 hover:border-[#3e9e57]",
    legendary:
      "bg-linear-to-r from-[#1e1606] to-[#100d03] border-[#c8911f]/60 hover:border-[#c8911f]",
    infusion:
      "bg-linear-to-r from-[#14081a] to-[#0a0510] border-[#6b2d7a]/60 hover:border-[#9c37a6]",
  };

  const effectContainerStyles: Record<string, string> = {
    duo: "bg-[#0f2414] border-[#2d5a3c] shadow-[inset_0_1px_0_rgba(70,240,143,0.12)]",
    legendary:
      "bg-[#1a1408] border-[#5a4518] shadow-[inset_0_1px_0_rgba(200,145,31,0.12)]",
    infusion:
      "bg-[#120818] border-[#4a2458] shadow-[inset_0_1px_0_rgba(156,55,166,0.12)]",
  };

  const effectLabelColors: Record<string, string> = {
    duo: "text-[#46f08f]",
    legendary: "text-[#e8b84a]",
    infusion: "text-[#c071ff]",
  };

  const effectDividerColors: Record<string, string> = {
    duo: "text-[#2d5a3c]",
    legendary: "text-[#5a4518]",
    infusion: "text-[#4a2458]",
  };

  let normalizedType = $derived((boon.type ?? "").trim().toLowerCase());
  let accentColor = $derived(typeAccents[normalizedType] ?? "#3a3a3a");
  let cardStyle = $derived(
    typeCardStyles[normalizedType] ??
      "bg-[#080808] border-[#252525] hover:border-[#383838]",
  );
  let effectContainerStyle = $derived(
    effectContainerStyles[normalizedType] ??
      "bg-[#0f0f0f] border-[#2a2a2a] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
  );
  let effectLabelColor = $derived(
    effectLabelColors[normalizedType] ?? "text-white",
  );
  let effectDividerColor = $derived(
    effectDividerColors[normalizedType] ?? "text-[#555555]",
  );
  let hoverShadow = $derived(
    normalizedType === "duo"
      ? "hover:shadow-[0_2px_14px_rgba(62,158,87,0.15)]"
      : normalizedType === "legendary"
        ? "hover:shadow-[0_2px_14px_rgba(200,145,31,0.15)]"
        : normalizedType === "infusion"
          ? "hover:shadow-[0_2px_14px_rgba(156,55,166,0.15)]"
          : "hover:shadow-[0_2px_12px_rgba(0,0,0,0.6)]",
  );
  let hoverAccent = $derived(
    normalizedType === "duo"
      ? "from-[#46f08f]/80"
      : normalizedType === "legendary"
        ? "from-[#c8911f]/80"
        : normalizedType === "infusion"
          ? "from-[#c071ff]/80"
          : "from-white/20",
  );

  let godLabel = $derived(
    boon.gods.length > 1 ? boon.gods.join(" · ") : boon.gods[0],
  );

  function handleGodFilter(god: string) {
    onGodFilter?.(god);
  }

  const typeBadgeStyles: Record<string, string> = {
    duo: "border-[#2d5a3c] text-[#46f08f] bg-[#0f2414]",
    legendary: "border-[#5a4518] text-[#e8b84a] bg-[#1a1408]",
    infusion: "border-[#4a2458] text-[#c071ff] bg-[#120818]",
  };

  let badgeStyle = $derived(
    typeBadgeStyles[normalizedType] ??
      "border-[#2a2a2a] text-white bg-[#0f0f0f]",
  );

  let isRegularBoon = $derived(
    normalizedType !== "duo" &&
      normalizedType !== "legendary" &&
      normalizedType !== "infusion",
  );

  function effectValueColor(rarity: string): string {
    if (!isRegularBoon) return "text-white";
    return rarityColors[rarity] ?? "text-[#c071ff]";
  }
</script>

<article
  class="flex h-full flex-col gap-2 {cardStyle} border border-l-[3px] rounded-md p-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all {hoverShadow} group"
  style="border-left-color: {accentColor};"
>
  <div
    class="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b {hoverAccent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
  ></div>

  <div class="flex flex-1 items-start gap-2.5 z-10 relative min-w-0">
    <BoonImgElemIcon {boon} />

    <div class="flex-1 min-w-0">
      <span
        class="text-[0.65rem] uppercase tracking-widest text-[#46f08f] block leading-tight mb-0.5 truncate"
      >
        {#if onGodFilter}
          {#each boon.gods as god, i (god)}
            {#if i > 0}<span class="opacity-60"> · </span>{/if}
            <button
              type="button"
              class="hover:text-[#ccff90] transition-colors hover:underline underline-offset-2"
              onclick={() => handleGodFilter(god)}
            >
              {god}
            </button>
          {/each}
        {:else}
          {godLabel}
        {/if}
      </span>
      <h2
        class="text-sm sm:text-base font-serif text-[#ccff90] uppercase tracking-wide m-0 drop-shadow-sm leading-tight"
      >
        {boon.name}
      </h2>
      <p class="text-xs text-[#b3c2b7] font-sans leading-snug mt-1">
        {#each boon.description_rich as part, i (`${part.type}-${i}`)}
          {#if part.type === "text_normal"}<span>{part.value}</span>
          {:else if part.type === "text_bold"}<strong class="text-[#e5f4e7] font-semibold"
              >{part.value}</strong
            >
          {:else if part.type === "image"}<img
              src={miscImageUrl(part.img_path)}
              alt={part.name}
              class="inline-block h-[1.4em] w-auto object-contain align-middle"
              loading="lazy"
              decoding="async"
            />{/if}
        {/each}
      </p>
    </div>
  </div>

  {#if boon.type || boon.is_core || boon.deals_olympian_damage || effectsValues.length > 0}
    <div class="flex shrink-0 flex-col gap-1.5 z-10 relative">
    {#if boon.type || boon.is_core || boon.deals_olympian_damage}
      <div class="flex flex-wrap gap-1">
        {#if boon.type}
          <span
            class="text-[0.6rem] uppercase tracking-widest py-0.5 px-1.5 rounded-sm border {badgeStyle}"
          >
            {boon.type}
          </span>
        {/if}
        {#if boon.is_core}
          <span
            class="text-[0.6rem] uppercase tracking-widest py-0.5 px-1.5 rounded-sm border {badgeStyle}"
          >
            Core
          </span>
        {/if}
        {#if boon.deals_olympian_damage}
          <span
            class="text-[0.6rem] uppercase tracking-widest py-0.5 px-1.5 rounded-sm border {badgeStyle}"
            title="Olympian Damage"
          >
            Olympian DMG
          </span>
        {/if}
      </div>
    {/if}

    {#if effectsValues.length > 0}
      <div
        class="border rounded-md px-2 py-1.5 {effectContainerStyle}"
      >
        <div class="flex items-center gap-1.5">
          <span class="{effectLabelColor} text-[0.65rem]">▶</span>
          <span
            class="text-[0.65rem] uppercase tracking-widest font-sans font-semibold shrink-0 {effectLabelColor}"
            >{boon.effect}</span
          >
        </div>
        <div class="mt-1 flex flex-wrap items-center gap-x-1 gap-y-0.5 pl-3.5">
          {#each effectsValues as [rarity, value], i (rarity)}
            {#if i > 0}<span class="{effectDividerColor}">/</span>{/if}
            <span
              class="bg-black px-1 py-px rounded font-mono text-[0.7rem] font-bold leading-tight {effectValueColor(
                rarity,
              )}">{value}</span
            >
          {/each}
        </div>
      </div>
    {/if}
  </div>
  {/if}
</article>
