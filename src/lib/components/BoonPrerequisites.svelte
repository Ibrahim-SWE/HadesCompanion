<script lang="ts">
  import BoonHover from "./BoonHover.svelte";
  import LazyMiscImg from "./LazyMiscImg.svelte";
  import type { BoonPrerequisites, ElementRequirement } from "$lib/types/hades2";

  let {
    prerequisites,
    containerClass = "bg-[#0f0f0f] border-[#2a2a2a] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
    labelClass = "text-white",
  }: {
    prerequisites: BoonPrerequisites;
    containerClass?: string;
    labelClass?: string;
  } = $props();

  let expanded = $state(false);

  const elementIconFiles: Record<string, string> = {
    air: "air_element_icon.webp",
    earth: "earth_element_icon.webp",
    water: "water_element_icon.webp",
    fire: "fire_element_icon.webp",
    aether: "aether_element_icon.webp",
  };

  function elementIconFile(element: string): string | undefined {
    return elementIconFiles[element.toLowerCase()];
  }

  function hasCondition(
    prereqs: BoonPrerequisites,
  ): prereqs is { condition: string } {
    return prereqs !== null && "condition" in prereqs;
  }

  function hasBoons(
    prereqs: BoonPrerequisites,
  ): prereqs is { boons: string[][] } {
    return prereqs !== null && "boons" in prereqs;
  }

  function hasSatisfyOne(
    prereqs: BoonPrerequisites,
  ): prereqs is { satisfy_one: ElementRequirement[] } {
    return prereqs !== null && "satisfy_one" in prereqs;
  }

  function hasSatisfyAll(
    prereqs: BoonPrerequisites,
  ): prereqs is { satisfy_all: ElementRequirement[] } {
    return prereqs !== null && "satisfy_all" in prereqs;
  }

  function isCollapsible(prereqs: BoonPrerequisites): boolean {
    if (!prereqs) return false;
    if (hasBoons(prereqs)) return true;
    if (hasSatisfyOne(prereqs)) return prereqs.satisfy_one.length > 1;
    if (hasSatisfyAll(prereqs)) return prereqs.satisfy_all.length > 1;
    return false;
  }

  function boonsLabel(groups: string[][]): string | null {
    if (groups.length === 1) {
      return groups[0].length === 1 ? null : "One of:";
    }
    return "One from each group:";
  }

  function isSingleBoonPrerequisite(groups: string[][]): boolean {
    return groups.length === 1 && groups[0].length === 1;
  }

  let collapsible = $derived(isCollapsible(prerequisites));
  let showDetails = $derived(!collapsible || expanded);

  function toggleExpanded() {
    expanded = !expanded;
  }
</script>

{#snippet elementRequirement(requirement: ElementRequirement)}
  <span class="inline-flex items-center gap-1">
    <span>{requirement.amount}</span>
    {#if elementIconFile(requirement.element)}
      <LazyMiscImg
        file={elementIconFile(requirement.element)!}
        alt="{requirement.element} element"
        class="inline-block h-[1.1em] w-auto object-contain"
      />
    {:else}
      <span>{requirement.element}</span>
    {/if}
  </span>
{/snippet}

{#snippet boonGroup(group: string[])}
  <div
    class="flex flex-wrap items-center gap-x-1 gap-y-0.5 rounded border border-[#3a3a3a]/80 px-1.5 py-1"
  >
    {#each group as boonName, nameIndex (boonName)}
      {#if nameIndex > 0}<span class="text-[#555555]">·</span>{/if}
      <BoonHover name={boonName}>{boonName}</BoonHover>
    {/each}
  </div>
{/snippet}

{#snippet prerequisiteDetails()}
  <div class="mt-1 space-y-1 pl-3.5 text-[0.7rem] leading-snug text-[#b3c2b7]">
    {#if hasCondition(prerequisites)}
      <p class="m-0">{prerequisites.condition}</p>
    {:else if hasBoons(prerequisites)}
      {@const groups = prerequisites.boons}
      {@const label = boonsLabel(groups)}
      {#if label}
        <p class="m-0 text-[0.65rem] uppercase tracking-wide text-[#8da693]">
          {label}
        </p>
      {/if}
      {#if isSingleBoonPrerequisite(groups)}
        <BoonHover name={groups[0][0]}>{groups[0][0]}</BoonHover>
      {:else}
        <div class="space-y-1">
          {#each groups as group, groupIndex (groupIndex)}
            {@render boonGroup(group)}
          {/each}
        </div>
      {/if}
    {:else if hasSatisfyOne(prerequisites)}
      <p class="m-0 text-[0.65rem] uppercase tracking-wide text-[#8da693]">
        One of:
      </p>
      <ul class="m-0 list-disc space-y-0.5 pl-4">
        {#each prerequisites.satisfy_one as requirement, i (i)}
          <li>{@render elementRequirement(requirement)}</li>
        {/each}
      </ul>
    {:else if hasSatisfyAll(prerequisites)}
      {#if prerequisites.satisfy_all.length === 1}
        {@render elementRequirement(prerequisites.satisfy_all[0])}
      {:else}
        <p class="m-0 text-[0.65rem] uppercase tracking-wide text-[#8da693]">
          All of:
        </p>
        <ul class="m-0 list-disc space-y-0.5 pl-4">
          {#each prerequisites.satisfy_all as requirement, i (i)}
            <li>{@render elementRequirement(requirement)}</li>
          {/each}
        </ul>
      {/if}
    {/if}
  </div>
{/snippet}

{#if prerequisites}
  <div class="rounded-md border px-2 py-1.5 {containerClass}">
    {#if collapsible}
      <button
        type="button"
        class="group flex w-full cursor-pointer items-center gap-1.5 rounded-sm border-0 bg-transparent p-0 text-left font-inherit transition-colors hover:text-[#ccff90]"
        aria-expanded={expanded}
        title={expanded ? "Collapse prerequisites" : "Expand prerequisites"}
        onclick={toggleExpanded}
      >
        <span
          class="{labelClass} inline-block w-2.5 text-[0.65rem] transition-transform duration-200 group-hover:text-[#ccff90] {expanded
            ? 'rotate-90'
            : ''}"
        >
          ▶
        </span>
        <span
          class="text-[0.65rem] font-sans font-semibold uppercase tracking-widest underline decoration-[#46f08f]/50 underline-offset-2 transition-colors group-hover:decoration-[#ccff90] {labelClass}"
        >
          Prerequisites
        </span>
      </button>
    {:else}
      <div class="flex items-center gap-1.5">
        <span class="{labelClass} text-[0.65rem]">▶</span>
        <span
          class="text-[0.65rem] font-sans font-semibold uppercase tracking-widest {labelClass}"
        >
          Prerequisites
        </span>
      </div>
    {/if}

    {#if showDetails}
      {@render prerequisiteDetails()}
    {/if}
  </div>
{/if}
