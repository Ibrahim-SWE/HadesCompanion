<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import LazyEnhancedImg from "$lib/components/LazyEnhancedImg.svelte";
  import LazyMiscImg from "$lib/components/LazyMiscImg.svelte";
  import BoonHover from "$lib/components/BoonHover.svelte";
  import { loadPetImage } from "$lib/assets/petImages";
  import petsData from "$lib/data/hades2/pets.json";
  import {
    ALL_PETS_KEY,
    buildPetReplaceHref,
    parsePetFromSearchParams,
    petUrlMatchesState,
  } from "$lib/animals-url";
  import { browser } from "$app/environment";
  import { replaceState } from "$app/navigation";
  import { page } from "$app/state";
  import { onMount } from "svelte";

  type DescriptionRich =
    | { type: "text_normal"; value: string }
    | { type: "image"; image_file: string }
    | { type: "effect_values" };

  type BondDetails = {
    bondName: string;
    imageFile: string;
    description_rich: DescriptionRich[];
    effects: string[];
    note?: string;
  };

  type PetDetails = {
    name: string;
    bond1: BondDetails;
    bond2: BondDetails;
    bond3: BondDetails;
  };

  type PetTheme = {
    accent: string;
    accentSoft: string;
    accentDim: string;
    ink: string;
  };

  const pets = Object.entries(petsData) as [string, PetDetails][];
  const petKeys = [ALL_PETS_KEY, ...pets.map(([key]) => key)];
  const defaultPetKey = ALL_PETS_KEY;

  let activeTab = $state(defaultPetKey);
  let syncingFromUrl = false;
  let syncingToUrl = false;

  const UNLOCKED_PETS_KEY = "hades2:unlocked-pets";
  const BOND_LEVELS_KEY = "hades2:pet-bond-levels";
  const MAX_BOND_LEVEL = 3;

  let unlockedPets = $state<string[]>([]);
  let unlockedPetsSet = $derived(new Set(unlockedPets));
  let bondLevels = $state<Record<string, number>>({});

  onMount(() => {
    try {
      const raw = localStorage.getItem(UNLOCKED_PETS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          unlockedPets = parsed.filter((v): v is string => typeof v === "string");
        }
      }
    } catch {
    }
    try {
      const rawLevels = localStorage.getItem(BOND_LEVELS_KEY);
      if (rawLevels) {
        const parsed = JSON.parse(rawLevels);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const cleaned: Record<string, number> = {};
          for (const [k, v] of Object.entries(parsed)) {
            if (typeof v === "number" && v >= 0 && v <= MAX_BOND_LEVEL) {
              cleaned[k] = Math.floor(v);
            }
          }
          bondLevels = cleaned;
        }
      }
    } catch {
    }
  });

  $effect(() => {
    if (!browser) return;
    try {
      localStorage.setItem(UNLOCKED_PETS_KEY, JSON.stringify(unlockedPets));
    } catch {
    }
  });

  $effect(() => {
    if (!browser) return;
    try {
      localStorage.setItem(BOND_LEVELS_KEY, JSON.stringify(bondLevels));
    } catch {
    }
  });

  function togglePet(key: string) {
    if (unlockedPetsSet.has(key)) {
      unlockedPets = unlockedPets.filter((k) => k !== key);
    } else {
      unlockedPets = [...unlockedPets, key];
    }
  }

  function upgradeBond(petKey: string, bondName: string) {
    if (!unlockedPetsSet.has(petKey)) {
      unlockedPets = [...unlockedPets, petKey];
    }
    const current = bondLevels[bondName] ?? 0;
    const next = current >= MAX_BOND_LEVEL ? 0 : current + 1;
    bondLevels = { ...bondLevels, [bondName]: next };
  }

  function resetUnlockedPets() {
    unlockedPets = [];
  }

  function resetBondLevels() {
    bondLevels = {};
  }

  function handlePetKeydown(event: KeyboardEvent, key: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePet(key);
    }
  }

  function handleBondKeydown(event: KeyboardEvent, petKey: string, bondName: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      upgradeBond(petKey, bondName);
    }
  }

  function preventDoubleClickSelection(event: MouseEvent) {
    event.preventDefault();
    const selection = window.getSelection();
    if (selection && selection.type !== "None") {
      selection.removeAllRanges();
    }
  }

  let unlockedPetCount = $derived(unlockedPets.length);
  let totalPetCount = $derived(pets.length);
  let petProgressPercent = $derived(
    totalPetCount === 0 ? 0 : Math.round((unlockedPetCount / totalPetCount) * 100),
  );

  function isAnimalsPath(pathname: string): boolean {
    return pathname === "/hades2/animals" || pathname.endsWith("/hades2/animals");
  }

  function hydrateFromPageUrl() {
    if (!browser || syncingToUrl) return;

    const location = new URL(window.location.href);
    if (!isAnimalsPath(location.pathname)) return;

    syncingFromUrl = true;
    activeTab = parsePetFromSearchParams(
      location.searchParams,
      petKeys,
      defaultPetKey,
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
        if (isAnimalsPath(window.location.pathname)) {
          hydrateFromPageUrl();
        }
      });
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  });

  function pushPetToUrl() {
    if (!browser || syncingFromUrl || syncingToUrl) return;

    const location = new URL(window.location.href);
    if (!isAnimalsPath(location.pathname)) return;
    if (petUrlMatchesState(activeTab, location, petKeys, defaultPetKey)) {
      return;
    }

    syncingToUrl = true;
    replaceState(
      buildPetReplaceHref(activeTab, location.pathname, defaultPetKey),
      {},
    );
    syncingToUrl = false;
  }

  function selectPet(petKey: string) {
    activeTab = petKey;
    pushPetToUrl();
  }

  const petThemes: Record<string, PetTheme> = {
    Frinos: {
      accent: "#46f08f",
      accentSoft: "rgba(70, 240, 143, 0.18)",
      accentDim: "rgba(70, 240, 143, 0.08)",
      ink: "#d7ffe5",
    },
    Toula: {
      accent: "#2ee8c6",
      accentSoft: "rgba(46, 232, 198, 0.18)",
      accentDim: "rgba(46, 232, 198, 0.08)",
      ink: "#d4fff7",
    },
    Raki: {
      accent: "#b8d9c2",
      accentSoft: "rgba(184, 217, 194, 0.16)",
      accentDim: "rgba(184, 217, 194, 0.07)",
      ink: "#f0fff3",
    },
    Hecuba: {
      accent: "#b8ff6d",
      accentSoft: "rgba(184, 255, 109, 0.16)",
      accentDim: "rgba(184, 255, 109, 0.07)",
      ink: "#edffd7",
    },
    Gale: {
      accent: "#58ffc8",
      accentSoft: "rgba(88, 255, 200, 0.17)",
      accentDim: "rgba(88, 255, 200, 0.075)",
      ink: "#dcfff5",
    },
  };

  function themeStyle(theme: PetTheme) {
    return `--accent: ${theme.accent}; --accent-soft: ${theme.accentSoft}; --accent-dim: ${theme.accentDim}; --ink: ${theme.ink};`;
  }

  function petBonds(pet: PetDetails) {
    return [pet.bond1, pet.bond2, pet.bond3];
  }
</script>

<Container>
  <div class="max-w-300 mx-auto text-[#e5f4e7] p-2 sm:p-3 font-serif">
    <header class="flex flex-col pb-1.5 border-b border-[#58ffa5]/25 mb-2">
      <h1
        class="text-[#ccff90] font-serif text-2xl sm:text-3xl font-normal uppercase tracking-widest m-0 drop-shadow-[0_0_10px_rgba(204,255,144,0.3)]"
      >
        Animal Familiars
      </h1>
      <p
        class="text-[0.7rem] sm:text-xs text-[#8da693] font-sans mt-0.5 tracking-wide leading-snug"
      >
        Pets that join you on runs. Unlock and upgrade them with Witch's
        Delight. Each familiar grants bonuses across three bond ranks. Only one
        can be equipped at a time. Heroic rank is only achievable with the
        <BoonHover name="Primal Psychic Connection">Primal Psychic Connection</BoonHover>
        boon from Circe.
      </p>
      <p class="text-[0.7rem] sm:text-xs text-[#a4bea9] font-sans mt-0.5 tracking-wide leading-snug">
        Click an animal if unlocked. Click a bond to upgrade it.
      </p>
      <div class="mt-2 flex items-center gap-2.5">
        <div
          class="flex-1 h-2 rounded-full bg-[#0a140d] border border-[#1c3623] overflow-hidden"
          role="progressbar"
          aria-valuenow={unlockedPetCount}
          aria-valuemin="0"
          aria-valuemax={totalPetCount}
          aria-label="Animals unlocked progress"
        >
          <div
            class="h-full transition-all duration-500"
            style="width: {petProgressPercent}%; background: linear-gradient(to right, hsl(140 {50 + petProgressPercent * 0.4}% {22 + petProgressPercent * 0.3}%), hsl(140 {65 + petProgressPercent * 0.3}% {35 + petProgressPercent * 0.35}%)); box-shadow: 0 0 {2 + petProgressPercent * 0.4}px hsla(140, 90%, 55%, {petProgressPercent * 0.006});"
          ></div>
        </div>
        <span class="text-[0.7rem] font-sans text-[#a4bea9] tabular-nums whitespace-nowrap tracking-wide">
          {unlockedPetCount} / {totalPetCount} unlocked ({petProgressPercent}%)
        </span>
      </div>
    </header>

    <nav class="flex gap-1.5 mb-2 flex-wrap justify-center" aria-label="Filter familiars">
      <button
        type="button"
        class="bg-[#0d1a12] border px-2.5 py-1 rounded text-xs uppercase tracking-wider cursor-pointer transition-all duration-200 {activeTab ===
        ALL_PETS_KEY
          ? 'border-[#46f08f] text-[#ccff90] shadow-[0_0_8px_rgba(77,252,142,0.2)] bg-[#153320]'
          : 'border-[#1a3a25] text-[#8da693] hover:bg-[#153320] hover:text-[#ccff90] hover:border-[#46f08f]'}"
        onclick={() => selectPet(ALL_PETS_KEY)}
      >
        All
      </button>
      {#each pets as [petKey, pet] (petKey)}
        {@const theme = petThemes[petKey] || petThemes.Frinos}
        <button
          type="button"
          class="bg-[#0d1a12] border px-2.5 py-1 rounded text-xs uppercase tracking-wider cursor-pointer transition-all duration-200 {activeTab ===
          petKey
            ? 'bg-[#153320] text-[#ccff90] shadow-[0_0_8px_var(--accent-dim)] border-(--accent)'
            : 'border-[#1a3a25] text-[#8da693] hover:bg-[#153320] hover:text-[#ccff90] hover:border-(--accent) hover:shadow-[0_0_8px_var(--accent-dim)]'}"
          style={themeStyle(theme)}
          onclick={() => selectPet(petKey)}
        >
          {pet.name}
        </button>
      {/each}
      <button
        type="button"
        onclick={resetUnlockedPets}
        class="px-2.5 py-1 rounded border border-[#ff5e7e]/40 text-xs uppercase tracking-wider font-sans bg-[#2a0d12] text-[#ff8aa0] cursor-pointer transition-all duration-200 hover:border-[#ff5e7e] hover:text-[#ffadb8] hover:shadow-[0_0_10px_rgba(255,94,126,0.25)]"
      >
        Reset Unlocked Animals
      </button>
      <button
        type="button"
        onclick={resetBondLevels}
        class="px-2.5 py-1 rounded border border-[#ff5e7e]/40 text-xs uppercase tracking-wider font-sans bg-[#2a0d12] text-[#ff8aa0] cursor-pointer transition-all duration-200 hover:border-[#ff5e7e] hover:text-[#ffadb8] hover:shadow-[0_0_10px_rgba(255,94,126,0.25)]"
      >
        Reset Bond Levels
      </button>
    </nav>

    <div class="flex flex-col gap-2">
      {#each pets as [petKey, pet] (petKey)}
        {#if activeTab === ALL_PETS_KEY || activeTab === petKey}
          {@const theme = petThemes[petKey] || petThemes.Frinos}
          {@const isPetUnlocked = unlockedPetsSet.has(petKey)}
          {@const petBondList = petBonds(pet)}
          {@const totalBondLevels = petBondList.reduce(
            (sum, b) => sum + (bondLevels[b.bondName] ?? 0),
            0,
          )}
          {@const totalBondMax = petBondList.length * MAX_BOND_LEVEL}
          {@const bondSummaryPercent = totalBondMax === 0 ? 0 : Math.round((totalBondLevels / totalBondMax) * 100)}

          <article
            class="flex flex-col gap-2 bg-linear-to-r border border-[#1c3623] border-l-4 rounded-lg p-2 sm:p-2.5 relative overflow-hidden transition-all duration-300 {isPetUnlocked
              ? 'from-[#0c1a10] to-[#102617] brightness-110 shadow-[0_4px_10px_rgba(0,0,0,0.5),0_0_18px_var(--accent-dim)]'
              : 'from-[#070d09] to-[#0a120c] opacity-90 saturate-75 shadow-[0_4px_10px_rgba(0,0,0,0.5)]'}"
            style="border-left-color: var(--accent); {themeStyle(theme)}"
          >
            <div class="flex flex-col xl:flex-row gap-2.5">
            <div
              role="button"
              tabindex="0"
              aria-pressed={isPetUnlocked ? "true" : "false"}
              aria-label="{pet.name} familiar — {isPetUnlocked ? 'unlocked, click to mark as locked' : 'locked, click to mark as unlocked'}"
              onclick={() => togglePet(petKey)}
              onkeydown={(e) => handlePetKeydown(e, petKey)}
              ondblclick={preventDoubleClickSelection}
              class="flex flex-row xl:flex-col items-center xl:items-center justify-start xl:justify-center shrink-0 text-left xl:text-center xl:pr-3 border-b xl:border-b-0 xl:border-r border-[#1c3623] pb-2 xl:pb-0 gap-2.5 xl:gap-1 cursor-pointer rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
            >
              <div
                class="w-14 h-14 sm:w-16 sm:h-16 bg-black rounded-full border-2 flex items-center justify-center xl:mb-1 overflow-hidden shadow-[0_0_15px_var(--accent-dim)] shrink-0"
                style="border-color: var(--accent);"
              >
                <LazyEnhancedImg
                  load={() => loadPetImage(`${petKey.toLowerCase()}.webp`)}
                  alt={pet.name}
                  class="w-full h-full object-contain scale-110"
                  placeholderClass="w-full h-full"
                  sizes="64px"
                  eager
                />
              </div>

              <div class="min-w-0 flex flex-col justify-center xl:items-center">
                <span
                  class="text-[0.6rem] uppercase tracking-widest text-(--accent) block leading-tight mb-0.5"
                  >Familiar</span
                >
                <h2
                  class="text-base sm:text-lg text-white m-0 tracking-wide leading-tight"
                >
                  {pet.name}
                </h2>
              </div>
            </div>

            <section
              class="flex flex-col md:flex-row gap-2 flex-1 min-w-0"
              aria-label={`${pet.name} bonds`}
            >
              {#each petBondList as bond (bond.bondName)}
                {@const bondLevel = bondLevels[bond.bondName] ?? 0}
                {@const bondProgressPercent = Math.round((bondLevel / MAX_BOND_LEVEL) * 100)}

                <div
                  role="button"
                  tabindex="0"
                  aria-label="{bond.bondName} bond — level {bondLevel} of {MAX_BOND_LEVEL}, click to upgrade"
                  onclick={() => upgradeBond(petKey, bond.bondName)}
                  onkeydown={(e) => handleBondKeydown(e, petKey, bond.bondName)}
                  ondblclick={preventDoubleClickSelection}
                  class="flex-1 border rounded-lg p-2 flex flex-col items-center text-center min-w-0 cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) {bondLevel > 0
                    ? 'bg-black/30 border-(--accent)/40 shadow-[0_0_12px_var(--accent-dim)]'
                    : 'bg-black/20 border-white/5 hover:border-(--accent)/30'}"
                >
                  <div
                    class="flex flex-row items-center gap-2 mb-1.5 pb-1.5 border-b border-white/5 w-full"
                  >
                    <div
                      class="w-14 h-14 sm:w-16 sm:h-16 bg-black rounded-lg border border-[#2a4030] shrink-0 flex items-center justify-center p-1.5 shadow-inner"
                    >
                      <LazyEnhancedImg
                        load={() => loadPetImage(bond.imageFile)}
                        alt={bond.bondName}
                        class="w-full h-full object-contain drop-shadow-lg"
                        placeholderClass="w-full h-full"
                        sizes="64px"
                      />
                    </div>
                    <div class="flex flex-col items-start min-w-0 gap-1 text-left flex-1">
                      <div class="flex items-center gap-1.5 min-w-0">
                        <h3
                          class="text-xs sm:text-sm m-0 text-[#e5f4e7] font-medium leading-tight truncate"
                        >
                          {bond.bondName}
                        </h3>
                        {#if bondLevel > 0}
                          <span
                            class="text-[0.5rem] uppercase tracking-widest px-1 py-0.5 rounded font-sans text-(--accent) border border-(--accent)/40 bg-black/40 shrink-0"
                          >
                            Lv {bondLevel}
                          </span>
                        {/if}
                      </div>
                      <div class="flex items-center gap-1.5 w-full">
                        <div
                          class="flex-1 h-1.5 rounded-full bg-black/60 border border-white/5 overflow-hidden"
                          role="progressbar"
                          aria-valuenow={bondLevel}
                          aria-valuemin="0"
                          aria-valuemax={MAX_BOND_LEVEL}
                          aria-label="{bond.bondName} bond level"
                        >
                          <div
                            class="h-full transition-all duration-300"
                            style="width: {bondProgressPercent}%; background: linear-gradient(to right, var(--accent-dim), var(--accent)); box-shadow: 0 0 {2 + bondLevel * 2}px var(--accent-dim);"
                          ></div>
                        </div>
                        <span class="text-[0.55rem] font-sans text-[#7b9981] tabular-nums whitespace-nowrap tracking-wide">
                          {bondLevel}/{MAX_BOND_LEVEL}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p
                    class="text-[0.7rem] sm:text-xs leading-snug text-[#a4bea9] m-0 mb-1.5 flex-1 font-sans text-left w-full"
                  >
                    {#each bond.description_rich as part, index (index)}
                      {#if part.type === "text_normal"}
                        <span>{part.value}</span>
                      {:else if part.type === "effect_values"}
                        <span
                          class="inline-flex gap-1 align-middle"
                          aria-label="Bond values"
                        >
                          {#each bond.effects as effect, idx (idx)}
                            <span
                              class="bg-black px-1.5 py-0.5 rounded font-mono text-[0.75rem] transition-all {idx ===
                              bondLevel - 1
                                ? 'ring-2 ring-(--accent) text-white scale-110 shadow-[0_0_10px_var(--accent-dim)] font-semibold'
                                : idx === 1
                                  ? 'text-[#5bc0eb]'
                                  : idx === 2
                                    ? 'text-[#c071ff]'
                                    : idx === 3
                                      ? 'text-[#ff5e7e]'
                                      : 'text-white'} {bondLevel > 0 && idx > bondLevel - 1 ? 'opacity-50' : ''}"
                            >
                              {effect}
                            </span>
                          {/each}
                        </span>
                      {:else if part.type === "image"}
                        <LazyMiscImg
                          file={part.image_file}
                          alt={part.image_file
                            .replace("_icon.webp", "")
                            .replace("_", " ")}
                          class="inline-block w-4 h-4 object-contain align-middle mx-0.5"
                        />
                      {/if}
                    {/each}
                  </p>

                  {#if bond.note}
                    <p
                      class="text-[0.65rem] text-[#7b9981] italic m-0 border-l-2 pl-1.5 font-sans text-left w-full"
                      style="border-color: var(--accent);"
                    >
                      {bond.note}
                    </p>
                  {/if}
                </div>
              {/each}
            </section>
            </div>
            <div class="flex items-center gap-2.5 pt-1.5 border-t border-[#1c3623]">
              <span class="text-[0.6rem] uppercase tracking-widest text-(--accent) font-sans whitespace-nowrap">
                Bonds Levels
              </span>
              <div
                class="flex-1 h-2 rounded-full bg-black/60 border border-[#1c3623] overflow-hidden"
                role="progressbar"
                aria-valuenow={totalBondLevels}
                aria-valuemin="0"
                aria-valuemax={totalBondMax}
                aria-label="{pet.name} total bond levels"
              >
                <div
                  class="h-full transition-all duration-500"
                  style="width: {bondSummaryPercent}%; background: linear-gradient(to right, var(--accent-dim), var(--accent)); box-shadow: 0 0 {2 + bondSummaryPercent * 0.06}px var(--accent-dim);"
                ></div>
              </div>
              <span class="text-[0.65rem] font-sans text-[#a4bea9] tabular-nums whitespace-nowrap tracking-wide">
                {totalBondLevels}/{totalBondMax}
              </span>
            </div>
          </article>
        {/if}
      {/each}
    </div>
  </div>
</Container>
