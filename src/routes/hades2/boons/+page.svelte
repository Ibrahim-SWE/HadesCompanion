<script lang="ts">
  import Boon from "$lib/components/Boon.svelte";
  import Container from "$lib/components/Container.svelte";
  import boonsData from "$lib/data/hades2/boons.json";
  import godsData from "$lib/data/gods.json";

  type godsKeepsakeAndCurses = { keepsake: string; curses: string[] };

  type GodDetails = {
    title: string;
    hades_1: godsKeepsakeAndCurses | null;
    hades_2: godsKeepsakeAndCurses | null;
  };
  const gods: Record<string, GodDetails> = godsData;
  const sortedGodNames: string[] = Object.keys(gods).sort();

  let isGodsMenuOpen = $state(false);
  let selectedGods: string[] = $state([]);
  const toggleDropdown = () => {
    isGodsMenuOpen = !isGodsMenuOpen;
  };

  function clickOutside(node: HTMLElement, handler: () => void) {
    const handleClick = (event: MouseEvent) => {
      if (node && !node.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("click", handleClick, true);

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  }

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

  const boonEntries = Object.entries(boonsData) as [string, BoonData][];

  let coreFilter: boolean | null = $state(null);
  let coreStyle = $state("");

  const coreClick = () => {
    if (coreFilter == null) {
      coreFilter = true;
      coreStyle = "bg-emerald-900";
    } else if (coreFilter == true) {
      coreFilter = false;
      coreStyle = "bg-red-600/30";
    } else {
      coreFilter = null;
      coreStyle = "bg-emerald-950/50";
    }
  };
  let searchQuery: string = $state("");

  let filteredBoons = $derived(
    boonEntries.filter(([boonId, boonDetails]) => {
      const matchesGod =
        selectedGods.length === 0 ||
        boonDetails.gods.some((god) => selectedGods.includes(god));

      const searchLower = searchQuery.toLowerCase().trim();
      const searchWords = searchLower.split(/\s+/);
      const combinedText =
        `${boonDetails.name} ${boonDetails.description} ${boonDetails.effect}`.toLowerCase();

      const matchesSearch =
        searchLower === "" ||
        searchWords.every((word) => combinedText.includes(word));
      const matchesCore =
        coreFilter === null || boonDetails.is_core === coreFilter;

      return matchesGod && matchesSearch && matchesCore;
    }),
  );

  const filterStyle =
    "border border-white/25 p-2 rounded-xl text-textLight flex items-center pl-3 pr-3";
  //  bg-emerald-950/30
</script>

<Container>
  <div
    class="filtersContainer mb-1 flex flex-row items-center gap-2 text-xs sm:text-sm"
  >
    <div
      class="godsFilterContainer relative inline-block justify-center items-center"
      use:clickOutside={() => (isGodsMenuOpen = false)}
    >
      <button
        type="button"
        onclick={toggleDropdown}
        class="{filterStyle} bg-emerald-950/50"
      >
        Gods {#if selectedGods.length > 0}({selectedGods.length}){/if}
        <span class="arrow text-xs ml-1">{isGodsMenuOpen ? "▲" : "▼"}</span>
      </button>

      {#if isGodsMenuOpen}
        <div
          class="dropdownMenuGods mx-1 absolute flex flex-col z-10 left-1/2 -translate-x-1/2 w-max bg-emerald-950 border border-white/20 text-white/90 p-2 rounded-xl mt-1"
        >
          {#each sortedGodNames as god (god)}
            <label
              class="flex items-center gap-3 p-2 cursor-pointer hover:bg-white/10 rounded-lg transition-colors select-none group"
            >
              <input
                class="sr-only peer"
                type="checkbox"
                value={god}
                bind:group={selectedGods}
              />

              <div
                class="w-5 h-5 flex items-center justify-center border-2 border-white/30 rounded-md bg-emerald-950/50
                      transition-all duration-200
                      peer-checked:bg-emerald-500 peer-checked:border-emerald-400
                      group-hover:border-white/60
                      peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-400"
              >
                <svg
                  class="w-3.5 h-3.5 text-emerald-950 scale-0 transition-transform duration-200 peer-checked:scale-100"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <span
                class="godName tracking-wide text-white/80 group-hover:text-white transition-colors"
              >
                {god}
              </span>
            </label>
          {/each}
        </div>
      {/if}
    </div>
    <div class="searchboxContainer bg-emerald-950/50 {filterStyle}">
      <input
        class="focus:outline-none focus:ring-0"
        type="text"
        name=""
        bind:value={searchQuery}
        title="Search Boons"
        placeholder="Search..."
        id=""
      />
    </div>
    <div class="isCoreContainer">
      <button
        class="{coreStyle} {filterStyle} "
        name="Core?"
        title="Core"
        onclick={coreClick}>Core</button
      >
    </div>
  </div>
  <div
    class="boonsGridContainer grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1"
  >
    {#each filteredBoons as [boonId, boon] (boonId)}
      <Boon {boon} />
    {/each}
  </div>
</Container>
