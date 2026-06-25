<script lang="ts">
  import BoonDescriptionRich from "$lib/components/BoonDescriptionRich.svelte";
  import Container from "$lib/components/Container.svelte";
  import LazyEnhancedImg from "$lib/components/LazyEnhancedImg.svelte";
  import LazyMiscImg from "$lib/components/LazyMiscImg.svelte";
  import { loadAlchemyImage } from "$lib/assets/alchemyImages";
  import { loadIncantationImage } from "$lib/assets/incantationImages";
  import alchemyData from "$lib/data/hades2/alchemy.json";
  import incantationsData from "$lib/data/hades2/incantations.json";
  import type {
    AlchemyRecipe,
    DescriptionPart,
    Incantation,
    ResourceCost,
  } from "$lib/types/hades2";
  import type { Snippet } from "svelte";

  const alchemyRecipes = Object.entries(alchemyData) as [
    string,
    AlchemyRecipe,
  ][];

  const incantations = Object.entries(incantationsData) as [
    string,
    Incantation,
  ][];

  function richPartsSearchText(parts: DescriptionPart[] | null): string {
    if (!parts) return "";

    return parts
      .map((part) => (part.type === "image" ? part.name : part.value))
      .join(" ");
  }

  let searchQuery = $state("");

  const incantationIndex = incantations.map(([id, item]) => ({
    id,
    item,
    searchText: [
      item.name,
      item.description,
      richPartsSearchText(item.prerequisites_rich),
      ...item.unlock_requirements.map((req) => req.title),
    ]
      .join(" ")
      .toLowerCase(),
  }));

  const filteredIncantations = $derived.by(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return incantationIndex;

    const words = query.split(/\s+/);
    return incantationIndex.filter((entry) =>
      words.every((word) => entry.searchText.includes(word)),
    );
  });
</script>

{#snippet resourceChips(costs: ResourceCost[], align: "start" | "center" = "center")}
  <div
    class="flex flex-wrap gap-1 {align === 'start'
      ? 'justify-start'
      : 'justify-center'}"
  >
    {#each costs as req, i (i)}
      <span
        class="inline-flex items-center gap-1 bg-[#1a3a25] px-1.5 py-0.5 lg:px-2 lg:py-1 rounded border border-[#2d5a3c] shrink-0"
        title={req.title}
      >
        <span
          class="text-xs lg:text-sm font-bold text-[#ccff90] font-mono leading-none"
        >
          {req.amount}
        </span>
        <LazyMiscImg
          file={req.image_path}
          alt={req.title}
          class="w-4 h-4 lg:w-5 lg:h-5 object-contain"
        />
      </span>
    {/each}
  </div>
{/snippet}

{#snippet itemIcon(
  name: string,
  imagePath: string,
  loadImage: (path: string) => ReturnType<typeof loadAlchemyImage>,
)}
  <div class="flex items-center gap-3 min-w-0">
    <div
      class="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-24 lg:h-24 shrink-0 bg-black rounded-lg border border-[#1a3a25] flex items-center justify-center p-1.5 sm:p-2 shadow-[0_0_15px_rgba(0,0,0,0.8)]"
    >
      <LazyEnhancedImg
        load={() => loadImage(imagePath)}
        alt={name}
        class="w-full h-full object-contain drop-shadow-lg"
        placeholderClass="w-full h-full"
        sizes="96px"
      />
      <div
        class="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] pointer-events-none rounded-lg"
      ></div>
    </div>
    <span
      class="text-[#ccff90] font-serif text-xs sm:text-sm lg:text-base uppercase tracking-wide leading-tight break-words min-w-0"
    >
      {name}
    </span>
  </div>
{/snippet}

{#snippet mobileCardHeader(
  name: string,
  imagePath: string,
  loadImage: (path: string) => ReturnType<typeof loadAlchemyImage>,
  descriptionRich: DescriptionPart[],
)}
  <div class="flex items-center gap-3">
    <div
      class="relative w-14 h-14 shrink-0 bg-black rounded-lg border border-[#1a3a25] flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(0,0,0,0.8)]"
    >
      <LazyEnhancedImg
        load={() => loadImage(imagePath)}
        alt={name}
        class="w-full h-full object-contain drop-shadow-lg"
        placeholderClass="w-full h-full"
        sizes="56px"
      />
      <div
        class="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] pointer-events-none rounded-lg"
      ></div>
    </div>
    <div class="flex-1 min-w-0">
      <h3
        class="text-[#ccff90] font-serif text-sm uppercase tracking-wide m-0 leading-tight"
      >
        {name}
      </h3>
      <p class="text-[#e5f4e7] font-sans leading-snug mt-1 m-0">
        <BoonDescriptionRich
          parts={descriptionRich}
          imageClass="inline-block h-[1.45em] w-auto object-contain align-middle"
        />
      </p>
    </div>
  </div>
{/snippet}

{#snippet mobileMetaLabel(label: string)}
  <span
    class="text-[0.65rem] uppercase tracking-wider text-[#8da693] font-sans block mb-1"
  >
    {label}
  </span>
{/snippet}

{#snippet mobileCardShell(children: Snippet)}
  <article
    class="bg-linear-to-r from-[#0a140d] to-[#0d1c13] border border-[#1c3623] border-l-[3px] rounded-md p-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
    style="border-left-color: #46f08f;"
  >
    {@render children()}
  </article>
{/snippet}

{#snippet prerequisitesRich(parts: DescriptionPart[] | null)}
  {#if parts}
    <BoonDescriptionRich
      {parts}
      imageClass="inline-block h-[1.45em] w-auto object-contain align-middle"
    />
  {:else}
    <span class="text-[#8da693]">—</span>
  {/if}
{/snippet}

{#snippet timeValue(time: number)}
  <span
    class="inline-flex items-center justify-center gap-1 text-[#ccff90] font-mono text-xs sm:text-sm lg:text-base"
  >
    {time}
    <LazyMiscImg
      file="whiles_time.webp"
      alt="Nights"
      title="Nights"
      class="w-4 h-4 lg:w-5 lg:h-5 object-contain"
    />
  </span>
{/snippet}

<Container>
  <div class="max-w-300 mx-auto text-[#e5f4e7] p-2 sm:p-3 font-serif">
    <header class="flex flex-col pb-1.5 border-b border-[#58ffa5]/25 mb-2">
      <h1
        class="text-[#ccff90] font-serif text-2xl sm:text-3xl font-normal uppercase tracking-widest m-0 drop-shadow-[0_0_10px_rgba(204,255,144,0.3)]"
      >
        The Cauldron
      </h1>
      <p
        class="text-[0.7rem] sm:text-xs text-[#8da693] font-sans mt-0.5 tracking-wide leading-snug"
      >
        Alchemy recipes and incantations brewed at The Cauldron. See information, costs,
        effects, and unlock requirements.
      </p>
    </header>

    <section class="mb-3">
      <h2
        class="text-[#ccff90] text-base uppercase tracking-widest m-0 mb-2 font-normal"
      >
        Alchemy
      </h2>
      <div
        class="lg:border lg:border-[#1c3623] lg:border-l-[3px] lg:bg-linear-to-r lg:from-[#0a140d] lg:to-[#0d1c13] lg:rounded-md lg:shadow-[0_2px_10px_rgba(0,0,0,0.5)] lg:overflow-hidden"
        style="border-left-color: #46f08f;"
      >
        <div class="lg:hidden p-1.5 space-y-1.5 text-xs sm:text-sm leading-snug">
          {#each alchemyRecipes as [, recipe] (recipe.name)}
            {@render mobileCardShell(alchemyCard)}
            {#snippet alchemyCard()}
              {@render mobileCardHeader(
                recipe.name,
                recipe.image_path,
                loadAlchemyImage,
                recipe.description_rich,
              )}
              <div class="w-full h-px bg-white/5 my-2.5"></div>
              <div class="grid grid-cols-[1fr_auto] gap-3 items-end">
                <div class="min-w-0">
                  {@render mobileMetaLabel("Cost")}
                  {@render resourceChips(recipe.cost, "start")}
                </div>
                <div class="shrink-0 text-right">
                  <span
                    class="text-[0.65rem] uppercase tracking-wider text-[#8da693] font-sans block mb-1"
                  >
                    Time
                  </span>
                  {@render timeValue(recipe.preparation_time)}
                </div>
              </div>
            {/snippet}
          {/each}
        </div>

        <table
          class="hidden lg:table w-full table-fixed text-xs lg:text-sm text-left text-[#b3c2b7] font-sans leading-snug"
        >
          <colgroup>
            <col class="w-[40%]" />
            <col class="w-[28%]" />
            <col class="w-[24%]" />
            <col class="w-[8%]" />
          </colgroup>
          <thead>
            <tr
              class="border-b border-white/5 text-[#8da693] text-[0.7rem] lg:text-xs uppercase tracking-wider"
            >
              <th class="py-2 px-2.5 font-normal">Recipe</th>
              <th class="py-2 px-2.5 font-normal text-center">Effect</th>
              <th class="py-2 px-2.5 font-normal text-center">Cost</th>
              <th class="py-2 px-2.5 font-normal text-center">Time</th>
            </tr>
          </thead>
          <tbody>
            {#each alchemyRecipes as [, recipe] (recipe.name)}
              <tr class="border-b border-white/5 last:border-0">
                <td class="py-2 px-2.5 align-middle min-w-0">
                  {@render itemIcon(
                    recipe.name,
                    recipe.image_path,
                    loadAlchemyImage,
                  )}
                </td>
                <td class="py-2 px-2.5 align-middle text-center leading-snug min-w-0 text-[#e5f4e7]">
                  <BoonDescriptionRich
                    parts={recipe.description_rich}
                    imageClass="inline-block h-[1.45em] w-auto object-contain align-middle"
                  />
                </td>
                <td class="py-2 px-2.5 align-middle text-center">
                  {@render resourceChips(recipe.cost)}
                </td>
                <td class="py-2 px-2.5 align-middle text-center whitespace-nowrap">
                  {@render timeValue(recipe.preparation_time)}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2
        class="text-[#ccff90] text-base uppercase tracking-widest m-0 mb-2 font-normal"
      >
        Incantations
      </h2>
      <div class="flex flex-col items-center gap-1.5 mb-2">
        <label
          class="flex w-full items-center gap-2 rounded-md border border-[#2d5a3c] bg-[#153320] px-3 py-2 shadow-[inset_0_1px_0_rgba(70,240,143,0.08)]"
        >
          <span class="text-[#46f08f] text-sm shrink-0" aria-hidden="true">⌕</span>
          <input
            class="min-w-0 w-full bg-transparent text-sm sm:text-base text-[#e5f4e7] placeholder:text-[#8da693] focus:outline-none font-sans"
            type="search"
            bind:value={searchQuery}
            placeholder="Search incantations..."
          />
        </label>
        {#if searchQuery.trim()}
          <span class="text-xs text-[#8da693] font-sans">
            {filteredIncantations.length} of {incantations.length}
          </span>
        {/if}
      </div>
      <div
        class="lg:border lg:border-[#1c3623] lg:border-l-[3px] lg:bg-linear-to-r lg:from-[#0a140d] lg:to-[#0d1c13] lg:rounded-md lg:shadow-[0_2px_10px_rgba(0,0,0,0.5)] lg:overflow-hidden"
        style="border-left-color: #46f08f;"
      >
        <div class="lg:hidden p-1.5 space-y-1.5 text-xs sm:text-sm leading-snug">
          {#each filteredIncantations as { item } (item.name)}
            {@render mobileCardShell(incantationCard)}
            {#snippet incantationCard()}
              {@render mobileCardHeader(
                item.name,
                item.image_path,
                loadIncantationImage,
                item.description_rich,
              )}
              <div class="w-full h-px bg-white/5 my-2.5"></div>
              <div class="space-y-2.5">
                <div class="min-w-0">
                  {@render mobileMetaLabel("Requirements")}
                  {@render resourceChips(item.unlock_requirements, "start")}
                </div>
                <div class="min-w-0">
                  {@render mobileMetaLabel("Prerequisites")}
                  <p class="m-0 text-[#e5f4e7] font-sans leading-snug">
                    {@render prerequisitesRich(item.prerequisites_rich)}
                  </p>
                </div>
              </div>
            {/snippet}
          {:else}
            <p class="py-6 px-3 text-center text-[#8da693] font-sans m-0">
              No incantations match your search.
            </p>
          {/each}
        </div>

        <table
          class="hidden lg:table w-full table-fixed text-xs lg:text-sm text-left text-[#b3c2b7] font-sans leading-snug"
        >
          <colgroup>
            <col class="w-[36%]" />
            <col class="w-[22%]" />
            <col class="w-[18%]" />
            <col class="w-[24%]" />
          </colgroup>
          <thead>
            <tr
              class="border-b border-white/5 text-[#8da693] text-[0.7rem] lg:text-xs uppercase tracking-wider"
            >
              <th class="py-2 px-2.5 font-normal">Incantation</th>
              <th class="py-2 px-2.5 font-normal text-center">Effect</th>
              <th class="py-2 px-2.5 font-normal text-center">Requirements</th>
              <th class="py-2 px-2.5 font-normal text-center">Prerequisites</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredIncantations as { item } (item.name)}
              <tr class="border-b border-white/5 last:border-0">
                <td class="py-2 px-2.5 align-middle min-w-0">
                  {@render itemIcon(
                    item.name,
                    item.image_path,
                    loadIncantationImage,
                  )}
                </td>
                <td class="py-2 px-2.5 align-middle text-center leading-snug min-w-0 text-[#e5f4e7]">
                  <BoonDescriptionRich
                    parts={item.description_rich}
                    imageClass="inline-block h-[1.45em] w-auto object-contain align-middle"
                  />
                </td>
                <td class="py-2 px-2.5 align-middle text-center">
                  {@render resourceChips(item.unlock_requirements)}
                </td>
                <td
                  class="py-2 px-2.5 align-middle text-center min-w-0 text-[#e5f4e7] leading-snug"
                >
                  {@render prerequisitesRich(item.prerequisites_rich)}
                </td>
              </tr>
            {:else}
              <tr>
                <td
                  colspan="4"
                  class="py-6 px-3 text-center text-[#8da693] font-sans"
                >
                  No incantations match your search.
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>
  </div>
</Container>
