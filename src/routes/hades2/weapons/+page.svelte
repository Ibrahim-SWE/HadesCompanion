<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import LazyEnhancedImg from "$lib/components/LazyEnhancedImg.svelte";
  import LazyMiscImg from "$lib/components/LazyMiscImg.svelte";
  import { loadWeaponImage } from "$lib/assets/weaponImages";
  import weaponsData from "$lib/data/hades2/weapons.json";
  import {
    ALL_WEAPONS_KEY,
    buildWeaponReplaceHref,
    parseWeaponFromSearchParams,
    weaponUrlMatchesState,
  } from "$lib/weapons-url";
  import { browser } from "$app/environment";
  import { replaceState } from "$app/navigation";
  import { page } from "$app/state";
  import { onMount } from "svelte";

  type RichTextNode = {
    type: "text_normal" | "text_bold" | "image";
    value?: string;
    name?: string;
    img_path?: string;
  };

  type WeaponUpgrade = {
    name: string;
    image_path: string;
    description_rich: RichTextNode[];
  };

  type EffectRank = {
    effect_value: string;
    upgrade_cost: Record<string, number> | string;
  };

  type WeaponAspect = {
    name: string;
    image_path: string;
    description_rich: RichTextNode[];
    effect: string;
    effect_ranks: EffectRank[];
  };

  type WeaponDetails = {
    name: string;
    image_path: string;
    book_of_shadows: string;
    aspects: WeaponAspect[];
    upgrades: WeaponUpgrade[];
  };

  const weapons = Object.entries(weaponsData as Record<string, WeaponDetails>);
  const weaponKeys = [ALL_WEAPONS_KEY, ...weapons.map(([key]) => key)];
  const defaultWeaponKey = ALL_WEAPONS_KEY;

  let activeTab = $state(defaultWeaponKey);
  let syncingFromUrl = false;
  let syncingToUrl = false;

  function isWeaponsPath(pathname: string): boolean {
    return pathname === "/hades2/weapons" || pathname.endsWith("/hades2/weapons");
  }

  function hydrateFromPageUrl() {
    if (!browser || syncingToUrl) return;

    const location = new URL(window.location.href);
    if (!isWeaponsPath(location.pathname)) return;

    syncingFromUrl = true;
    activeTab = parseWeaponFromSearchParams(
      location.searchParams,
      weaponKeys,
      defaultWeaponKey,
    );
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
        if (isWeaponsPath(window.location.pathname)) {
          hydrateFromPageUrl();
        }
      });
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  });

  function pushWeaponToUrl() {
    if (!browser || syncingFromUrl || syncingToUrl) return;

    const location = new URL(window.location.href);
    if (!isWeaponsPath(location.pathname)) return;
    if (
      weaponUrlMatchesState(
        activeTab,
        location,
        weaponKeys,
        defaultWeaponKey,
      )
    ) {
      return;
    }

    syncingToUrl = true;
    replaceState(
      buildWeaponReplaceHref(activeTab, location.pathname, defaultWeaponKey),
      {},
    );
    syncingToUrl = false;
  }

  function selectWeapon(weaponKey: string) {
    activeTab = weaponKey;
    pushWeaponToUrl();
  }

  function toSnakeCase(str: string) {
    return str.toLowerCase().replace(/\s+/g, "_");
  }

  // Rank value colors: Common, Rare, Epic, Heroic, Legendary, Max
  const rankColors = [
    "text-white",
    "text-[#5bc0eb]",
    "text-[#c071ff]",
    "text-[#ff5e7e]",
    "text-[#ffb454]",
    "text-[#46f08f]",
  ];

  const rankLabels = [
    "Rank I",
    "Rank II",
    "Rank III",
    "Rank IV",
    "Rank V",
    "Rank VI",
  ];
</script>

{#snippet richText(parts: RichTextNode[])}
  {#each parts as part, i (i)}
    {#if part.type === "text_normal"}
      <span>{part.value}</span>
    {:else if part.type === "text_bold"}
      <span class="font-semibold text-[#e5f4e7]">{part.value}</span>
    {:else if part.type === "image"}
      {#if part.img_path}
        <LazyMiscImg
          file={part.img_path}
          alt={part.name ?? part.img_path}
          class="inline h-[1.2em] object-contain align-text-bottom mx-0.5"
        />
      {/if}
    {/if}
  {/each}
{/snippet}

{#snippet costChips(cost: Record<string, number> | string)}
  {#if typeof cost === "string"}
    <span class="text-[#8da693] italic">{cost}</span>
  {:else}
    <div class="flex flex-wrap gap-1">
      {#each Object.entries(cost) as [resName, amt] (resName)}
        <div
          class="flex items-center gap-1 bg-[#1a3a25] px-1.5 py-0.5 rounded border border-[#2d5a3c]"
          title={resName}
        >
          <span class="text-xs font-bold text-[#ccff90] font-mono leading-none">
            {amt}
          </span>
          <LazyMiscImg
            file="{toSnakeCase(resName)}.webp"
            alt={resName}
            class="w-4 h-4 object-contain"
          />
        </div>
      {/each}
    </div>
  {/if}
{/snippet}

{#snippet weaponArticle(weapon: WeaponDetails, eagerImages: boolean)}
  <article
    class="flex flex-col gap-4 bg-linear-to-r from-[#0a140d] to-[#0d1c13] border border-[#1c3623] border-l-4 rounded-xl p-3 sm:p-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)] relative overflow-hidden"
    style="border-left-color: #46f08f;"
  >
    <header class="flex items-start gap-3 sm:gap-4">
      <div
        class="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-black rounded-lg border border-[#1a3a25] flex items-center justify-center p-2 shadow-[0_0_15px_rgba(0,0,0,0.8)]"
      >
        <LazyEnhancedImg
          load={() => loadWeaponImage(weapon.image_path)}
          alt={weapon.name}
          class="w-full h-full object-contain drop-shadow-lg"
          placeholderClass="w-full h-full"
          sizes="80px"
          eager={eagerImages}
        />
        <div
          class="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] pointer-events-none rounded-lg"
        ></div>
      </div>
      <div class="flex-1 min-w-0">
        <span
          class="text-[0.6rem] uppercase tracking-widest text-[#46f08f] block leading-tight mb-0.5"
          >Nocturnal Arm</span
        >
        <h2
          class="text-lg sm:text-2xl font-serif text-[#ccff90] uppercase tracking-wider m-0 drop-shadow-sm"
        >
          {weapon.name}
        </h2>
        <p
          class="text-[0.75rem] sm:text-xs text-[#8da693] font-sans italic leading-snug mt-1 whitespace-pre-line"
        >
          {weapon.book_of_shadows}
        </p>
      </div>
    </header>

    <section aria-label="Aspects">
      <h3
        class="text-sm font-bold uppercase tracking-widest text-[#46f08f] border-b border-[#1c3623] pb-1.5 mb-3"
      >
        Aspects
      </h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {#each weapon.aspects as aspect (aspect.name)}
          <div
            class="flex flex-col gap-2.5 bg-black/20 border border-white/5 rounded-lg p-3"
          >
            <div class="flex items-start gap-3">
              <div
                class="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-black rounded-lg border border-[#2a4030] flex items-center justify-center p-1.5 shadow-inner"
              >
                <LazyEnhancedImg
                  load={() => loadWeaponImage(aspect.image_path)}
                  alt={aspect.name}
                  class="w-full h-full object-contain drop-shadow-lg"
                  placeholderClass="w-full h-full"
                  sizes="56px"
                />
              </div>
              <div class="min-w-0">
                <h4
                  class="text-base font-medium text-[#e5f4e7] tracking-wide m-0"
                >
                  {aspect.name}
                </h4>
                <p
                  class="text-xs text-[#a4bea9] font-sans leading-snug mt-1"
                >
                  {@render richText(aspect.description_rich)}
                </p>
              </div>
            </div>

            <div class="mt-auto pt-2 border-t border-white/5">
              <div
                class="text-xs text-[#46f08f] font-sans font-semibold mb-1"
              >
                {aspect.effect}
              </div>
              <table
                class="w-full text-xs text-left text-[#b3c2b7] font-sans"
              >
                <thead>
                  <tr
                    class="border-b border-white/5 text-[#8da693] text-[0.65rem] uppercase tracking-wider"
                  >
                    <th class="py-1 font-normal w-16">Rank</th>
                    <th class="py-1 font-normal w-18">Value</th>
                    <th class="py-1 font-normal">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {#each aspect.effect_ranks as rank, rankIdx (rankIdx)}
                    <tr class="border-b border-white/5 last:border-0">
                      <td class="py-1 text-[#8da693] text-[0.65rem] uppercase tracking-wide">
                        {rankLabels[rankIdx] ?? `Rank ${rankIdx + 1}`}
                      </td>
                      <td
                        class="py-1 font-bold font-mono {rankColors[
                          rankIdx
                        ] || 'text-white'}"
                      >
                        {rank.effect_value}
                      </td>
                      <td class="py-1">
                        {@render costChips(rank.upgrade_cost)}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <section aria-label="Daedalus Hammer upgrades">
      <h3
        class="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#ccff90] border-b border-[#1c3623] pb-1.5 mb-3"
      >
        <LazyMiscImg
          file="daedalus_hammer.webp"
          alt=""
          class="w-5 h-5 object-contain"
        />
        Daedalus Upgrades
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
        {#each weapon.upgrades as upgrade (upgrade.name)}
          <div
            class="flex gap-2.5 bg-black/20 border border-white/5 rounded-lg p-2.5 transition-colors hover:border-[#46f08f]/30"
          >
            <div
              class="w-10 h-10 shrink-0 bg-black rounded border border-[#2a4030] flex items-center justify-center p-1 shadow-inner"
            >
              <LazyEnhancedImg
                load={() => loadWeaponImage(upgrade.image_path)}
                alt={upgrade.name}
                class="w-full h-full object-contain"
                placeholderClass="w-full h-full"
                sizes="40px"
              />
            </div>
            <div class="min-w-0">
              <h4
                class="text-sm font-medium text-[#e5f4e7] tracking-wide leading-tight m-0"
              >
                {upgrade.name}
              </h4>
              <p class="text-xs text-[#a4bea9] font-sans leading-snug mt-0.5">
                {@render richText(upgrade.description_rich)}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </section>
  </article>
{/snippet}

<Container>
  <div class="max-w-300 mx-auto text-[#e5f4e7] p-2 sm:p-3 font-serif">
    <header class="flex flex-col pb-1.5 border-b border-[#58ffa5]/25 mb-2">
      <h1
        class="text-[#ccff90] font-serif text-2xl sm:text-3xl font-normal uppercase tracking-widest m-0 drop-shadow-[0_0_10px_rgba(204,255,144,0.3)]"
      >
        Nocturnal Arms
      </h1>
      <p
        class="text-[0.7rem] sm:text-xs text-[#8da693] font-sans mt-0.5 tracking-wide leading-snug"
      >
        The weapons of Melinoë, their Aspects, and Daedalus Hammer upgrades.
      </p>
    </header>

    <nav class="flex gap-2 mb-4 flex-wrap" aria-label="Select weapon">
      <button
        type="button"
        class="bg-[#0d1a12] border px-2.5 py-1 rounded text-xs sm:text-sm uppercase tracking-wider cursor-pointer transition-all duration-200 {activeTab ===
        ALL_WEAPONS_KEY
          ? 'border-[#46f08f] text-[#ccff90] shadow-[0_0_8px_rgba(77,252,142,0.2)] bg-[#153320]'
          : 'border-[#1a3a25] text-[#8da693] hover:bg-[#153320] hover:text-[#ccff90] hover:border-[#46f08f]'}"
        onclick={() => selectWeapon(ALL_WEAPONS_KEY)}
      >
        All
      </button>
      {#each weapons as [weaponKey, weapon] (weaponKey)}
        <button
          type="button"
          class="bg-[#0d1a12] border px-2.5 py-1 rounded text-xs sm:text-sm uppercase tracking-wider cursor-pointer transition-all duration-200 {activeTab ===
          weaponKey
            ? 'border-[#46f08f] text-[#ccff90] shadow-[0_0_8px_rgba(77,252,142,0.2)] bg-[#153320]'
            : 'border-[#1a3a25] text-[#8da693] hover:bg-[#153320] hover:text-[#ccff90] hover:border-[#46f08f]'}"
          onclick={() => selectWeapon(weaponKey)}
        >
          {weapon.name}
        </button>
      {/each}
    </nav>

    <div class="flex flex-col gap-4">
      {#each weapons as [weaponKey, weapon] (weaponKey)}
        {#if activeTab === ALL_WEAPONS_KEY || activeTab === weaponKey}
          {@render weaponArticle(
            weapon,
            activeTab === weaponKey,
          )}
        {/if}
      {/each}
    </div>
  </div>
</Container>
