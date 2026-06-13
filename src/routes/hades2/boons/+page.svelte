<script lang="ts">
  import Boon from "$lib/components/Boon.svelte";
  import Container from "$lib/components/Container.svelte";
  import FilterCheckbox from "$lib/components/FilterCheckbox.svelte";
  import boonsData from "$lib/data/hades2/boons.json";
  import { page } from "$app/state";

  type DescriptionPart =
    | { type: "text_normal"; value: string }
    | { type: "text_bold"; value: string }
    | { type: "image"; name: string; img_path: string };

  type BoonData = {
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

  type BoonIndexEntry = {
    id: string;
    boon: BoonData;
    searchText: string;
  };

  const boonIndex: BoonIndexEntry[] = Object.entries(boonsData).map(
    ([id, boon]) => ({
      id,
      boon: boon as BoonData,
      searchText: `${boon.name} ${boon.description} ${boon.effect}`.toLowerCase(),
    }),
  );

  const sortedGodNames = [
    ...new Set(boonIndex.flatMap((entry) => entry.boon.gods)),
  ].sort();

  const boonTypes = ["Attack", "Special", "Cast", "Sprint", "Magick"];
  const boonElements = ["Earth", "Water", "Air", "Fire", "Aether", "None"];

  let isBoonTypeOpen = $state(false);
  let isGodsMenuOpen = $state(false);
  let isElementMenuOpen = $state(false);

  let selectedGods: string[] = $state([]);
  let selectedTypes: string[] = $state([]);
  let selectedElements: string[] = $state([]);
  let coreFilter: boolean | null = $state(null);
  let olympDmgFilter: boolean | null = $state(null);
  let duoFilter: boolean | null = $state(null);
  let legendaryFilter: boolean | null = $state(null);
  let infusionFilter: boolean | null = $state(null);
  let searchQuery = $state(page.url.searchParams.get("search") ?? "");

  $effect(() => {
    const query = page.url.searchParams.get("search");
    if (query) searchQuery = query;
  });

  function clickOutside(node: HTMLElement, handler: () => void) {
    const handleClick = (event: MouseEvent) => {
      if (!node.contains(event.target as Node)) handler();
    };

    document.addEventListener("click", handleClick, true);
    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  }

  function closeAllDropdowns() {
    isGodsMenuOpen = false;
    isBoonTypeOpen = false;
    isElementMenuOpen = false;
  }

  function toggleDropdown(menu: "gods" | "type" | "elements") {
    const wasOpen =
      menu === "gods"
        ? isGodsMenuOpen
        : menu === "type"
          ? isBoonTypeOpen
          : isElementMenuOpen;

    closeAllDropdowns();

    if (menu === "gods") isGodsMenuOpen = !wasOpen;
    if (menu === "type") isBoonTypeOpen = !wasOpen;
    if (menu === "elements") isElementMenuOpen = !wasOpen;
  }

  function cycleState(currentState: boolean | null): boolean | null {
    if (currentState === null) return true;
    if (currentState === true) return false;
    return null;
  }

  function getToggleStyles(state: boolean | null): string {
    if (state === true)
      return "bg-[#153320] border-[#46f08f]/70 text-[#ccff90] shadow-[inset_0_1px_0_rgba(70,240,143,0.15)]";
    if (state === false)
      return "bg-[#1a0d0d] border-[#5a2d2d] text-[#8da693] line-through opacity-70";
    return "bg-[#0d1c13] border-[#2d5a3c] text-[#b3c2b7] hover:border-[#46f08f]/40";
  }

  const filterChip =
    "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs sm:text-sm font-sans transition-all";

  let filteredBoons = $derived.by(() => {
    const godsSet = selectedGods.length > 0 ? new Set(selectedGods) : null;
    const typesSet = selectedTypes.length > 0 ? new Set(selectedTypes) : null;
    const elementsSet =
      selectedElements.length > 0 ? new Set(selectedElements) : null;

    const searchLower = searchQuery.toLowerCase().trim();
    const searchWords =
      searchLower.length > 0 ? searchLower.split(/\s+/) : null;

    return boonIndex.filter(({ boon, searchText }) => {
      if (godsSet && !boon.gods.some((god) => godsSet.has(god))) return false;
      if (typesSet && !typesSet.has(boon.type as string)) return false;
      if (elementsSet && !elementsSet.has(boon.element as string)) return false;
      if (coreFilter !== null && boon.is_core !== coreFilter) return false;
      if (
        olympDmgFilter !== null &&
        boon.deals_olympian_damage !== olympDmgFilter
      )
        return false;
      if (duoFilter !== null && (boon.type === "Duo") !== duoFilter)
        return false;
      if (
        legendaryFilter !== null &&
        (boon.type === "Legendary") !== legendaryFilter
      )
        return false;
      if (
        infusionFilter !== null &&
        (boon.type === "Infusion") !== infusionFilter
      )
        return false;
      if (
        searchWords &&
        !searchWords.every((word) => searchText.includes(word))
      )
        return false;
      return true;
    });
  });

  let hasActiveFilters = $derived(
    selectedGods.length > 0 ||
      selectedTypes.length > 0 ||
      selectedElements.length > 0 ||
      coreFilter !== null ||
      olympDmgFilter !== null ||
      duoFilter !== null ||
      legendaryFilter !== null ||
      infusionFilter !== null ||
      searchQuery.trim().length > 0,
  );

  function clearFilters() {
    selectedGods = [];
    selectedTypes = [];
    selectedElements = [];
    coreFilter = null;
    olympDmgFilter = null;
    duoFilter = null;
    legendaryFilter = null;
    infusionFilter = null;
    searchQuery = "";
    closeAllDropdowns();
  }
</script>

<Container>
  <div class="w-full max-w-300 mx-auto text-[#e5f4e7] p-2 sm:p-3 font-serif">
    <header class="flex flex-col pb-1.5 border-b border-[#58ffa5]/25 mb-2">
      <h1
        class="text-[#ccff90] font-serif text-2xl sm:text-3xl font-normal uppercase tracking-widest m-0 drop-shadow-[0_0_10px_rgba(204,255,144,0.3)]"
      >
        Boons
      </h1>
      <p
        class="text-[0.7rem] sm:text-xs text-[#8da693] font-sans mt-0.5 tracking-wide leading-snug"
      >
        Browse and filter all boons in Hades II. Use search or filters to narrow
        results.
      </p>
    </header>

    <div class="mb-2 flex justify-center">
      <div
        class="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-md border border-[#1c3623] border-l-[3px] bg-linear-to-r from-[#0a140d] to-[#0d1c13] p-2 shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
        style="border-left-color: #46f08f;"
      >
        <div
          class="relative"
          use:clickOutside={() => (isGodsMenuOpen = false)}
        >
          <button
            type="button"
            onclick={() => toggleDropdown("gods")}
            class="{filterChip} {selectedGods.length > 0
              ? 'bg-[#153320] border-[#46f08f]/60 text-[#ccff90]'
              : 'bg-[#0d1c13] border-[#2d5a3c] text-[#b3c2b7] hover:border-[#46f08f]/40'}"
          >
            <span class="text-[0.65rem] uppercase tracking-widest text-[#46f08f]"
              >Gods</span
            >
            {#if selectedGods.length > 0}
              <span class="text-[#ccff90]">({selectedGods.length})</span>
            {/if}
            <span class="text-[0.55rem] opacity-60">{isGodsMenuOpen ? "▲" : "▼"}</span>
          </button>

          {#if isGodsMenuOpen}
            <div
              class="absolute left-1/2 z-30 mt-1.5 flex max-h-56 w-44 -translate-x-1/2 flex-col overflow-y-auto rounded-md border border-[#2d5a3c] bg-[#0a140d] p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.7)]"
            >
              {#each sortedGodNames as god (god)}
                <FilterCheckbox label={god} value={god} bind:group={selectedGods} />
              {/each}
            </div>
          {/if}
        </div>

        <label
          class="inline-flex min-w-28 items-center gap-2 rounded-md border border-[#2d5a3c] bg-[#153320] px-2.5 py-1.5 shadow-[inset_0_1px_0_rgba(70,240,143,0.08)] sm:min-w-40"
        >
          <span class="text-[#46f08f] text-xs" aria-hidden="true">⌕</span>
          <input
            class="min-w-0 w-full bg-transparent text-sm text-[#e5f4e7] placeholder:text-[#8da693] focus:outline-none font-sans"
            type="search"
            bind:value={searchQuery}
            placeholder="Search boons..."
          />
        </label>

        <div
          class="relative"
          use:clickOutside={() => (isBoonTypeOpen = false)}
        >
          <button
            type="button"
            onclick={() => toggleDropdown("type")}
            class="{filterChip} {selectedTypes.length > 0
              ? 'bg-[#153320] border-[#46f08f]/60 text-[#ccff90]'
              : 'bg-[#0d1c13] border-[#2d5a3c] text-[#b3c2b7] hover:border-[#46f08f]/40'}"
          >
            <span class="text-[0.65rem] uppercase tracking-widest text-[#46f08f]"
              >Type</span
            >
            {#if selectedTypes.length > 0}
              <span class="text-[#ccff90]">({selectedTypes.length})</span>
            {/if}
            <span class="text-[0.55rem] opacity-60">{isBoonTypeOpen ? "▲" : "▼"}</span>
          </button>

          {#if isBoonTypeOpen}
            <div
              class="absolute left-1/2 z-30 mt-1.5 flex w-40 -translate-x-1/2 flex-col rounded-md border border-[#2d5a3c] bg-[#0a140d] p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.7)]"
            >
              {#each boonTypes as type (type)}
                <FilterCheckbox label={type} value={type} bind:group={selectedTypes} />
              {/each}
            </div>
          {/if}
        </div>

        <div
          class="relative"
          use:clickOutside={() => (isElementMenuOpen = false)}
        >
          <button
            type="button"
            onclick={() => toggleDropdown("elements")}
            class="{filterChip} {selectedElements.length > 0
              ? 'bg-[#153320] border-[#46f08f]/60 text-[#ccff90]'
              : 'bg-[#0d1c13] border-[#2d5a3c] text-[#b3c2b7] hover:border-[#46f08f]/40'}"
          >
            <span class="text-[0.65rem] uppercase tracking-widest text-[#46f08f]"
              >Element</span
            >
            {#if selectedElements.length > 0}
              <span class="text-[#ccff90]">({selectedElements.length})</span>
            {/if}
            <span class="text-[0.55rem] opacity-60"
              >{isElementMenuOpen ? "▲" : "▼"}</span
            >
          </button>

          {#if isElementMenuOpen}
            <div
              class="absolute left-1/2 z-30 mt-1.5 flex w-36 -translate-x-1/2 flex-col rounded-md border border-[#2d5a3c] bg-[#0a140d] p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.7)]"
            >
              {#each boonElements as element (element)}
                <FilterCheckbox
                  label={element}
                  value={element === "None" ? null : element}
                  bind:group={selectedElements}
                />
              {/each}
            </div>
          {/if}
        </div>

        <button
          type="button"
          class="{filterChip} {getToggleStyles(duoFilter)}"
          onclick={() => (duoFilter = cycleState(duoFilter))}
        >
          <span class="text-[0.65rem] uppercase tracking-widest">Duo</span>
        </button>

        <button
          type="button"
          class="{filterChip} {getToggleStyles(legendaryFilter)}"
          onclick={() => (legendaryFilter = cycleState(legendaryFilter))}
        >
          <span class="text-[0.65rem] uppercase tracking-widest">Legendary</span>
        </button>

        <button
          type="button"
          class="{filterChip} {getToggleStyles(infusionFilter)}"
          onclick={() => (infusionFilter = cycleState(infusionFilter))}
        >
          <span class="text-[0.65rem] uppercase tracking-widest">Infusion</span>
        </button>

        <button
          type="button"
          class="{filterChip} {getToggleStyles(coreFilter)}"
          onclick={() => (coreFilter = cycleState(coreFilter))}
        >
          <span class="text-[0.65rem] uppercase tracking-widest">Core</span>
        </button>

        <button
          type="button"
          class="{filterChip} {getToggleStyles(olympDmgFilter)}"
          onclick={() => (olympDmgFilter = cycleState(olympDmgFilter))}
        >
          <span class="text-[0.65rem] uppercase tracking-widest"
            >Olympian DMG</span
          >
        </button>

        <button
          type="button"
          class="{filterChip} {hasActiveFilters
            ? 'border-[#2d5a3c] bg-transparent text-[#46f08f] hover:bg-[#153320] hover:border-[#46f08f]/50'
            : 'border-[#1c3623] bg-transparent text-[#4a5a4e] opacity-50 cursor-default'}"
          disabled={!hasActiveFilters}
          onclick={clearFilters}
        >
          <span class="text-[0.65rem] uppercase tracking-widest">Clear</span>
        </button>
      </div>
    </div>

    <p
      class="mb-2 text-center text-[0.65rem] uppercase tracking-widest text-[#8da693] font-sans"
    >
      Showing {filteredBoons.length} of {boonIndex.length}
    </p>

    {#if filteredBoons.length === 0}
      <div
        class="rounded-md border border-[#1c3623] border-l-[3px] bg-linear-to-r from-[#0a140d] to-[#0d1c13] px-4 py-10 text-center shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
        style="border-left-color: #46f08f;"
      >
        <p
          class="text-[#ccff90] font-serif text-lg uppercase tracking-wide m-0"
        >
          No boons match
        </p>
        <p class="mt-1.5 text-sm text-[#8da693] font-sans">
          Try adjusting your search or filters.
        </p>
      </div>
    {:else}
      <div
        class="grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1.5 items-stretch"
      >
        {#each filteredBoons as { id, boon } (id)}
          <Boon {boon} />
        {/each}
      </div>
    {/if}
  </div>
</Container>
