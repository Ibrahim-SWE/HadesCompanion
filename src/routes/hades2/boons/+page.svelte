<script lang="ts">
  import Boon from "$lib/components/Boon.svelte";
  import Container from "$lib/components/Container.svelte";
  import FilterCheckbox from "$lib/components/FilterCheckbox.svelte";
  import {
    boonFilterUrlMatchesState,
    buildBoonFilterReplaceHref,
    buildShareSummary,
    buildShareUrl,
    parseBoonFiltersFromSearchParams,
    type BoonFilterState,
  } from "$lib/boons-filter-url";
  import {
    BOON_ELEMENTS,
    BOON_GODS,
    BOON_TYPES,
  } from "$lib/boons-filter-registry";
  import boonsData from "$lib/data/hades2/boons.json";
  import { SITE_ORIGIN } from "$lib/seo";
  import { browser } from "$app/environment";
  import { replaceState } from "$app/navigation";
  import { page } from "$app/state";
  import type { BoonData } from "$lib/types/hades2";
  import { onMount } from "svelte";

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

  type MenuKey = "gods" | "type" | "elements" | "share";
  let openMenu = $state<MenuKey | null>(null);
  let linkCopied = $state(false);

  let selectedGods: string[] = $state([]);
  let selectedTypes: string[] = $state([]);
  let selectedElements: (string | null)[] = $state([]);
  let coreFilter: boolean | null = $state(null);
  let olympDmgFilter: boolean | null = $state(null);
  let duoFilter: boolean | null = $state(null);
  let legendaryFilter: boolean | null = $state(null);
  let infusionFilter: boolean | null = $state(null);
  let searchQuery = $state("");
  let urlSyncSearchQuery = $state("");
  let syncingFromUrl = false;
  let syncingToUrl = false;
  let searchDebounceTimer: ReturnType<typeof setTimeout> | undefined;

  function getFilterState(search = urlSyncSearchQuery): BoonFilterState {
    return {
      selectedGods,
      selectedTypes,
      selectedElements,
      coreFilter,
      olympDmgFilter,
      duoFilter,
      legendaryFilter,
      infusionFilter,
      searchQuery: search,
    };
  }

  function applyFilterState(state: BoonFilterState) {
    selectedGods = state.selectedGods;
    selectedTypes = state.selectedTypes;
    selectedElements = state.selectedElements;
    coreFilter = state.coreFilter;
    olympDmgFilter = state.olympDmgFilter;
    duoFilter = state.duoFilter;
    legendaryFilter = state.legendaryFilter;
    infusionFilter = state.infusionFilter;
    searchQuery = state.searchQuery;
    urlSyncSearchQuery = state.searchQuery;
  }

  function isBoonsPath(pathname: string): boolean {
    return pathname === "/hades2/boons" || pathname.endsWith("/hades2/boons");
  }

  function hydrateFromPageUrl() {
    if (!browser || syncingToUrl) return;

    const location = new URL(window.location.href);
    if (!isBoonsPath(location.pathname)) return;

    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = undefined;
    }

    syncingFromUrl = true;
    applyFilterState(parseBoonFiltersFromSearchParams(location.searchParams));
    syncingFromUrl = false;
  }

  $effect(() => {
    if (!browser || syncingToUrl) return;
    page.url.pathname;
    page.url.search;
    hydrateFromPageUrl();
  });

  onMount(() => {
    hydrateFromPageUrl();

    const onPopState = () => {
      queueMicrotask(() => {
        if (isBoonsPath(window.location.pathname)) {
          hydrateFromPageUrl();
        }
      });
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  });

  function pushFiltersToUrl() {
    if (!browser || syncingFromUrl || syncingToUrl) return;

    const state = getFilterState();
    const location = new URL(window.location.href);
    if (!isBoonsPath(location.pathname)) return;
    if (boonFilterUrlMatchesState(state, location)) return;

    syncingToUrl = true;
    replaceState(buildBoonFilterReplaceHref(state, location.pathname), {});
    syncingToUrl = false;
  }

  function syncSearchNow() {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = undefined;
    }
    urlSyncSearchQuery = searchQuery;
  }

  $effect(() => {
    if (!browser) return;

    const query = searchQuery;
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      urlSyncSearchQuery = query;
      searchDebounceTimer = undefined;
      if (!syncingFromUrl) pushFiltersToUrl();
    }, 300);

    return () => {
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = undefined;
      }
    };
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

  function closeMenus() {
    openMenu = null;
  }

  function closeMenu(menu: MenuKey) {
    if (openMenu === menu) openMenu = null;
  }

  function toggleMenu(menu: MenuKey) {
    openMenu = openMenu === menu ? null : menu;
  }

  function getLiveShareState(): BoonFilterState {
    return getFilterState(searchQuery);
  }

  async function copyShareLink() {
    await navigator.clipboard.writeText(
      buildShareUrl(getLiveShareState(), SITE_ORIGIN),
    );
    linkCopied = true;
    closeMenus();
    setTimeout(() => {
      linkCopied = false;
    }, 2000);
  }

  function shareOn(target: "reddit" | "x") {
    const state = getLiveShareState();
    const url = buildShareUrl(state, SITE_ORIGIN);
    const text = buildShareSummary(state, filteredBoons.length);
    const shareUrl =
      target === "reddit"
        ? `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
        : `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${text} ${url}`)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    closeMenus();
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

  function commitFilterChange(mutate: () => void) {
    syncSearchNow();
    mutate();
    pushFiltersToUrl();
  }

  function toggleInList<T>(list: T[], value: T): T[] {
    return list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];
  }

  function cycleTriState(
    current: boolean | null,
    set: (value: boolean | null) => void,
  ) {
    commitFilterChange(() =>
      set(current === null ? true : current === true ? false : null),
    );
  }

  function clearFilters() {
    commitFilterChange(() => {
      selectedGods = [];
      selectedTypes = [];
      selectedElements = [];
      coreFilter = null;
      olympDmgFilter = null;
      duoFilter = null;
      legendaryFilter = null;
      infusionFilter = null;
      searchQuery = "";
    });
    closeMenus();
  }

  function addGodFilter(god: string) {
    if (selectedGods.includes(god)) return;
    commitFilterChange(() => (selectedGods = [...selectedGods, god]));
  }

  function toggleGodFilter(god: string) {
    commitFilterChange(() => (selectedGods = toggleInList(selectedGods, god)));
  }

  function toggleTypeFilter(type: string) {
    commitFilterChange(
      () => (selectedTypes = toggleInList(selectedTypes, type)),
    );
  }

  function toggleElementFilter(element: string | null) {
    commitFilterChange(
      () => (selectedElements = toggleInList(selectedElements, element)),
    );
  }

  let godOptions = $derived(
    BOON_GODS.map((god) => ({
      label: god,
      checked: selectedGods.includes(god),
      onToggle: () => toggleGodFilter(god),
    })),
  );
  let typeOptions = $derived(
    BOON_TYPES.map((type) => ({
      label: type,
      checked: selectedTypes.includes(type),
      onToggle: () => toggleTypeFilter(type),
    })),
  );
  let elementOptions = $derived(
    BOON_ELEMENTS.map((element) => {
      const value = element === "None" ? null : element;
      return {
        label: element,
        checked: selectedElements.includes(value),
        onToggle: () => toggleElementFilter(value),
      };
    }),
  );
</script>

{#snippet filterMenu(
  key: MenuKey,
  label: string,
  widthClass: string,
  options: { label: string; checked: boolean; onToggle: () => void }[],
)}
  {@const count = options.filter((option) => option.checked).length}
  <div class="relative" use:clickOutside={() => closeMenu(key)}>
    <button
      type="button"
      onclick={() => toggleMenu(key)}
      class="{filterChip} {count > 0
        ? 'bg-[#153320] border-[#46f08f]/60 text-[#ccff90]'
        : 'bg-[#0d1c13] border-[#2d5a3c] text-[#b3c2b7] hover:border-[#46f08f]/40'}"
    >
      <span class="text-[0.65rem] uppercase tracking-widest text-[#46f08f]"
        >{label}</span
      >
      {#if count > 0}
        <span class="text-[#ccff90]">({count})</span>
      {/if}
      <span class="text-[0.55rem] opacity-60">{openMenu === key ? "▲" : "▼"}</span
      >
    </button>

    {#if openMenu === key}
      <div
        class="absolute left-1/2 z-30 mt-1.5 flex max-h-56 {widthClass} -translate-x-1/2 flex-col overflow-y-auto rounded-md border border-[#2d5a3c] bg-[#0a140d] p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.7)]"
      >
        {#each options as option (option.label)}
          <FilterCheckbox
            label={option.label}
            checked={option.checked}
            onToggle={option.onToggle}
          />
        {/each}
      </div>
    {/if}
  </div>
{/snippet}

{#snippet triFilter(
  label: string,
  value: boolean | null,
  set: (value: boolean | null) => void,
)}
  <button
    type="button"
    class="{filterChip} {getToggleStyles(value)}"
    onclick={() => cycleTriState(value, set)}
  >
    <span class="text-[0.65rem] uppercase tracking-widest">{label}</span>
  </button>
{/snippet}

{#snippet shareItem(label: string, onclick: () => void)}
  <button
    type="button"
    class="rounded-md px-2 py-1.5 text-left text-sm text-[#b3c2b7] transition-colors hover:bg-[#153320] hover:text-[#e5f4e7]"
    {onclick}
  >
    {label}
  </button>
{/snippet}

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
        Browse and filter all boons in Hades 2. Use search or filters to narrow
        results.
      </p>
    </header>

    <div class="mb-2 flex justify-center">
      <div
        class="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-md border border-[#1c3623] border-l-[3px] bg-linear-to-r from-[#0a140d] to-[#0d1c13] p-2 shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
        style="border-left-color: #46f08f;"
      >
        {@render filterMenu("gods", "Gods & Characters", "w-44", godOptions)}

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

        {@render filterMenu("type", "Type", "w-40", typeOptions)}
        {@render filterMenu("elements", "Element", "w-36", elementOptions)}

        {@render triFilter("Duo", duoFilter, (v) => (duoFilter = v))}
        {@render triFilter(
          "Legendary",
          legendaryFilter,
          (v) => (legendaryFilter = v),
        )}
        {@render triFilter(
          "Infusion",
          infusionFilter,
          (v) => (infusionFilter = v),
        )}
        {@render triFilter("Core", coreFilter, (v) => (coreFilter = v))}
        {@render triFilter(
          "Olympian DMG",
          olympDmgFilter,
          (v) => (olympDmgFilter = v),
        )}

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

        <div class="relative" use:clickOutside={() => closeMenu("share")}>
          <button
            type="button"
            onclick={() => toggleMenu("share")}
            class="{filterChip} bg-[#0d1c13] border-[#2d5a3c] text-[#b3c2b7] hover:border-[#46f08f]/40"
          >
            <span class="text-[0.65rem] uppercase tracking-widest text-[#46f08f]"
              >{linkCopied ? "Copied!" : "Share"}</span
            >
            <span class="text-[0.55rem] opacity-60"
              >{openMenu === "share" ? "▲" : "▼"}</span
            >
          </button>

          {#if openMenu === "share"}
            <div
              class="absolute right-0 z-30 mt-1.5 flex w-44 flex-col rounded-md border border-[#2d5a3c] bg-[#0a140d] p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.7)]"
            >
              {@render shareItem("Copy link", copyShareLink)}
              {@render shareItem("Share on Reddit", () => shareOn("reddit"))}
              {@render shareItem("Share on X", () => shareOn("x"))}
            </div>
          {/if}
        </div>
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
          <Boon {boon} onGodFilter={addGodFilter} />
        {/each}
      </div>
    {/if}
  </div>
</Container>
