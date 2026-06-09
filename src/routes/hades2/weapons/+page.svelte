<script lang="ts">
  import { slide } from "svelte/transition";
  import Container from "$lib/components/Container.svelte";
  import weaponsData from "$lib/data/hades2/weapons.json";

  const weaponImages = import.meta.glob("/src/lib/assets/weapons/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  const upgradeImages = import.meta.glob(
    "/src/lib/assets/weaponupgrades/*.webp",
    { eager: true, import: "default" },
  ) as Record<string, string>;

  const aspectImages = import.meta.glob("/src/lib/assets/weapons/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  const miscImages = import.meta.glob("/src/lib/assets/misc/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  type RichTextNode = {
    type: "text_normal" | "text_bold" | "image";
    value?: string;
    name?: string;
    img_path?: string;
  };

  type WeaponUpgrade = {
    name: string;
    description_rich: RichTextNode[];
    image_path: string;
  };

  type EffectRank = {
    effect_value: string;
    upgrade_cost: Record<string, number> | string;
  };

  type WeaponAspect = {
    name: string;
    image_file: string;
    description_rich: RichTextNode[];
    effect: string;
    effect_ranks: EffectRank[];
  };

  type WeaponDetails = {
    entry: string;
    image_path: string;
    upgrades: WeaponUpgrade[];
    aspects: WeaponAspect[];
  };

  const weapons = weaponsData as Record<string, WeaponDetails>;

  // Track expanded/collapsed states for each weapon
  let expandedStates = Object.keys(weapons).reduce(
    (acc, key) => {
      acc[key] = { upgrades: false, aspects: false };
      return acc;
    },
    {} as Record<string, { upgrades: boolean; aspects: boolean }>,
  );

  function toggleSection(weaponName: string, section: "upgrades" | "aspects") {
    expandedStates[weaponName][section] = !expandedStates[weaponName][section];
    // Reassign to trigger Svelte reactivity
    expandedStates = { ...expandedStates };
  }

  function toSnakeCase(str: string) {
    return str.toLowerCase().replace(/\s+/g, "_");
  }

  // Define the colors for each rank level (1 through 6)
  const rankColors = [
    "text-white", // 1st: Common
    "text-blue-400", // 2nd: Rare
    "text-purple-400", // 3rd: Epic
    "text-rose-500", // 4th: Heroic
    "text-orange-400", // 5th: Legendary (Gold/Orange)
    "text-green-400", // 6th: Light Green
  ];
</script>

<Container>
  <div class="max-w-6xl mx-auto flex flex-col gap-10 text-gray-200">
    {#each Object.entries(weapons) as [weaponName, details] (weaponName)}
      <div class="weapon-block">
        <header
          class="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4"
        >
          {#if details.image_path}
            <img
              src={weaponImages[
                `/src/lib/assets/weapons/${details.image_path}`
              ]}
              alt={weaponName}
              class="w-20 h-20 object-contain drop-shadow-md flex-none"
            />
          {/if}
          <div>
            <h1 class="text-3xl font-bold text-amber-400 mb-1">{weaponName}</h1>
            <p class="text-sm italic text-gray-400 leading-snug">
              "{details.entry}"
            </p>
          </div>
        </header>

        <section class="mb-4">
          <button
            class="w-full flex items-center justify-between text-left border-b border-white/10 pb-2 mb-3 hover:bg-white/5 transition-colors group cursor-pointer"
            on:click={() => toggleSection(weaponName, "upgrades")}
          >
            <h2
              class="text-sm font-bold uppercase tracking-wider text-amber-500 pl-2"
            >
              Daedalus Upgrades
            </h2>
            <div
              class="pr-2 text-amber-500 transition-transform duration-200 mr-2 {expandedStates[
                weaponName
              ].upgrades
                ? 'rotate-180'
                : ''}"
            >
              ▼
            </div>
          </button>

          {#if expandedStates[weaponName].upgrades}
            <div
              transition:slide={{ duration: 300 }}
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-hidden px-1 pb-4"
            >
              {#each details.upgrades as upgrade (upgrade.name)}
                <div
                  class="flex gap-3 bg-black/30 rounded p-3 border border-white/5"
                >
                  <img
                    src={upgradeImages[
                      `/src/lib/assets/weaponupgrades/${upgrade.image_path}`
                    ]}
                    alt={upgrade.name}
                    class="w-10 h-10 object-contain rounded bg-black/50 p-1 flex-none"
                  />
                  <div class="flex flex-col">
                    <h3 class="text-sm font-bold text-white leading-none mb-1">
                      {upgrade.name}
                    </h3>
                    <p class="text-xs text-gray-300 leading-tight">
                      {#each upgrade.description_rich as part, i (i)}
                        {#if part.type === "text_normal"}
                          <span>{part.value}</span>
                        {:else if part.type === "text_bold"}
                          <span class="font-bold text-white">{part.value}</span>
                        {:else if part.type === "image"}
                          <img
                            src={miscImages[
                              `/src/lib/assets/misc/${part.img_path}`
                            ]}
                            alt={part.name}
                            class="inline h-[1.2em] object-contain align-text-bottom mx-0.5"
                          />
                        {/if}
                      {/each}
                    </p>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </section>

        <section>
          <button
            class="w-full flex items-center justify-between text-left border-b border-white/10 pb-2 mb-3 hover:bg-white/5 transition-colors group cursor-pointer"
            on:click={() => toggleSection(weaponName, "aspects")}
          >
            <h2
              class="text-sm font-bold uppercase tracking-wider text-emerald-400 pl-2"
            >
              Aspects
            </h2>
            <div
              class="pr-2 text-emerald-400 transition-transform duration-200 mr-2 {expandedStates[
                weaponName
              ].aspects
                ? 'rotate-180'
                : ''}"
            >
              ▼
            </div>
          </button>

          {#if expandedStates[weaponName].aspects}
            <div
              transition:slide={{ duration: 300 }}
              class="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden px-1"
            >
              {#each details.aspects as aspect (aspect.name)}
                <div
                  class="bg-black/30 rounded p-4 border border-white/5 flex flex-col gap-3"
                >
                  <div class="flex items-start gap-3">
                    {#if aspect.image_file}
                      <img
                        src={aspectImages[
                          `/src/lib/assets/weapons/${aspect.image_file}`
                        ]}
                        alt={aspect.name}
                        class="w-12 h-12 object-contain rounded flex-none"
                      />
                    {/if}
                    <div>
                      <h3 class="text-base font-bold text-white">
                        {aspect.name}
                      </h3>
                      <p class="text-xs text-gray-300 mt-0.5">
                        {#each aspect.description_rich as part, i (i)}
                          {#if part.type === "text_normal"}
                            <span>{part.value}</span>
                          {:else if part.type === "text_bold"}
                            <span class="font-bold text-white"
                              >{part.value}</span
                            >
                          {:else if part.type === "image"}
                            <img
                              src={miscImages[
                                `/src/lib/assets/misc/${part.img_path}`
                              ]}
                              alt={part.name}
                              class="inline h-[1.2em] object-contain align-text-bottom mx-0.5"
                            />
                          {/if}
                        {/each}
                      </p>
                    </div>
                  </div>

                  <div class="mt-auto pt-2 border-t border-white/10">
                    <div class="text-xs text-emerald-400 font-bold mb-1">
                      {aspect.effect}
                    </div>
                    <table class="w-full text-xs text-left text-gray-300">
                      <thead>
                        <tr class="border-b border-white/5 text-gray-500">
                          <th class="py-1 font-normal w-12">Rank</th>
                          <th class="py-1 font-normal w-16">Value</th>
                          <th class="py-1 font-normal">Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each aspect.effect_ranks as rank, rankIdx (rankIdx)}
                          <tr class="border-b border-white/5 last:border-0">
                            <td class="py-1">{rankIdx + 1}</td>

                            <td
                              class="py-1 font-bold {rankColors[rankIdx] ||
                                'text-white'}"
                            >
                              {rank.effect_value}
                            </td>

                            <td class="py-1">
                              {#if typeof rank.upgrade_cost === "string"}
                                <span class="text-gray-500"
                                  >{rank.upgrade_cost}</span
                                >
                              {:else}
                                <div class="flex flex-wrap gap-1.5">
                                  {#each Object.entries(rank.upgrade_cost) as [resName, amt] (resName)}
                                    <div
                                      class="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-white/10"
                                      title={resName}
                                    >
                                      <span
                                        class="text-xs font-bold text-amber-400 font-mono leading-none"
                                      >
                                        {amt}
                                      </span>
                                      <img
                                        src={miscImages[
                                          `/src/lib/assets/misc/${toSnakeCase(resName)}.webp`
                                        ]}
                                        alt={resName}
                                        class="w-3.5 h-3.5 object-contain"
                                      />
                                    </div>
                                  {/each}
                                </div>
                              {/if}
                            </td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </section>
      </div>
    {/each}
  </div>
</Container>
