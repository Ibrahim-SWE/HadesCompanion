<script lang="ts">
  import BoonImgElemIcon from "./BoonImg_ElemIcon.svelte";
  import BoonDescriptionRich from "./BoonDescriptionRich.svelte";
  import BoonPrerequisites from "./BoonPrerequisites.svelte";
  import {
    compactRarityValue,
    getBoonStyleType,
    getOrderedRarityEffects,
    isChaosBlessing,
  } from "$lib/boon-display";
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

  let chaosBlessing = $derived(isChaosBlessing(boon));
  let effectsValues = $derived(
    chaosBlessing
      ? getOrderedRarityEffects(boon)
      : Object.entries(boon.rarities_effect).filter(
          (entry): entry is [string, string] => entry[1] !== null,
        ),
  );

  const typeAccents: Record<string, string> = {
    duo: "#3e9e57",
    legendary: "#c8911f",
    infusion: "#9c37a6",
    blessing: "#d8e4da",
    curse: "#8b2d5c",
  };

  const typeCardStyles: Record<string, string> = {
    duo: "bg-linear-to-r from-[#0c1f0e] to-[#06110a] border-[#3e9e57]/60 hover:border-[#3e9e57]",
    legendary:
      "bg-linear-to-r from-[#1e1606] to-[#100d03] border-[#c8911f]/60 hover:border-[#c8911f]",
    infusion:
      "bg-linear-to-r from-[#14081a] to-[#0a0510] border-[#6b2d7a]/60 hover:border-[#9c37a6]",
    blessing:
      "bg-linear-to-r from-[#3d4842] to-[#343d38] border-[#e5f4e7]/40 hover:border-[#e5f4e7]/60",
    curse:
      "bg-linear-to-r from-[#1a0812] to-[#100509] border-[#5c1838]/70 hover:border-[#7a2248]",
  };

  const effectContainerStyles: Record<string, string> = {
    duo: "bg-[#0f2414] border-[#2d5a3c] shadow-[inset_0_1px_0_rgba(70,240,143,0.12)]",
    legendary:
      "bg-[#1a1408] border-[#5a4518] shadow-[inset_0_1px_0_rgba(200,145,31,0.12)]",
    infusion:
      "bg-[#120818] border-[#4a2458] shadow-[inset_0_1px_0_rgba(156,55,166,0.12)]",
    blessing:
      "bg-[#2a332e] border-[#6a756c] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
    curse:
      "bg-[#14060e] border-[#3d1028] shadow-[inset_0_1px_0_rgba(139,45,92,0.15)]",
  };

  const effectLabelColors: Record<string, string> = {
    duo: "text-[#46f08f]",
    legendary: "text-[#e8b84a]",
    infusion: "text-[#c071ff]",
    blessing: "text-[#e5f4e7]",
    curse: "text-[#b84a78]",
  };

  const effectDividerColors: Record<string, string> = {
    duo: "text-[#2d5a3c]",
    legendary: "text-[#5a4518]",
    infusion: "text-[#4a2458]",
    blessing: "text-[#6a756c]",
    curse: "text-[#3d1028]",
  };

  let normalizedType = $derived(getBoonStyleType(boon));
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
          : normalizedType === "blessing"
            ? "hover:shadow-[0_2px_14px_rgba(229,244,231,0.12)]"
            : normalizedType === "curse"
              ? "hover:shadow-[0_2px_14px_rgba(92,24,56,0.35)]"
            : "hover:shadow-[0_2px_12px_rgba(0,0,0,0.6)]",
  );
  let hoverAccent = $derived(
    normalizedType === "duo"
      ? "from-[#46f08f]/80"
      : normalizedType === "legendary"
        ? "from-[#c8911f]/80"
        : normalizedType === "infusion"
          ? "from-[#c071ff]/80"
          : normalizedType === "blessing"
            ? "from-[#e5f4e7]/50"
            : normalizedType === "curse"
              ? "from-[#8b2d5c]/70"
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
    blessing: "border-[#7a857c] text-[#e5f4e7] bg-[#2a332e]",
    curse: "border-[#4a1430] text-[#c45a82] bg-[#14060e]",
  };

  let badgeStyle = $derived(
    typeBadgeStyles[normalizedType] ??
      "border-[#2a2a2a] text-white bg-[#0f0f0f]",
  );

  let chaosTypeLabel = $derived.by(() => {
    const chaosType = (boon.chaosType ?? "").trim().toLowerCase();
    return chaosType === "blessing" || chaosType === "curse" ? chaosType : null;
  });

  let chaosBadgeStyle = $derived(
    chaosTypeLabel
      ? (typeBadgeStyles[chaosTypeLabel] ??
          "border-[#2a2a2a] text-white bg-[#0f0f0f]")
      : "",
  );

  function effectValueColor(rarity: string): string {
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
        <BoonDescriptionRich parts={boon.description_rich} />
      </p>
    </div>
  </div>

  {#if boon.type || chaosTypeLabel || boon.is_core || boon.deals_olympian_damage || effectsValues.length > 0 || boon.prerequisites}
    <div class="flex shrink-0 flex-col gap-1.5 z-10 relative">
    {#if boon.type || chaosTypeLabel || boon.is_core || boon.deals_olympian_damage}
      <div class="flex flex-wrap gap-1">
        {#if boon.type}
          <span
            class="text-[0.6rem] uppercase tracking-widest py-0.5 px-1.5 rounded-sm border {badgeStyle}"
          >
            {boon.type}
          </span>
        {/if}
        {#if chaosTypeLabel}
          <span
            class="text-[0.6rem] uppercase tracking-widest py-0.5 px-1.5 rounded-sm border {chaosBadgeStyle}"
          >
            {chaosTypeLabel}
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
      <div class="border rounded-md px-2 py-1.5 {effectContainerStyle}">
        {#if boon.effect}
          <div class="flex items-center gap-1.5">
            <span class="{effectLabelColor} text-[0.65rem]">▶</span>
            <span
              class="text-[0.65rem] uppercase tracking-widest font-sans font-semibold shrink-0 {effectLabelColor}"
              >{boon.effect}</span
            >
          </div>
        {/if}
        <div
          class="flex flex-wrap items-center gap-x-1 gap-y-0.5 {boon.effect
            ? 'mt-1 pl-3.5'
            : ''}"
        >
          {#each effectsValues as [rarity, value], i (rarity)}
            {#if i > 0}<span class="{effectDividerColor}">/</span>{/if}
            <span
              class="bg-black px-1 py-px rounded font-mono text-[0.7rem] font-bold leading-tight {effectValueColor(
                rarity,
              )}"
              title={value}
              >{chaosBlessing ? compactRarityValue(value) : value}</span
            >
          {/each}
        </div>
      </div>
    {/if}

    {#if boon.prerequisites}
      <BoonPrerequisites
        prerequisites={boon.prerequisites}
        containerClass={effectContainerStyle}
        labelClass={effectLabelColor}
      />
    {/if}
  </div>
  {/if}
</article>
