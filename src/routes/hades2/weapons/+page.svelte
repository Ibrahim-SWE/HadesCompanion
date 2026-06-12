<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import weaponsData from "$lib/data/hades2/weapons.json";

  const weaponImages = import.meta.glob("/src/lib/assets/weapons/**/*.webp", {
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

  let activeTab = $state(weapons[0][0]);
  let activeWeapon = $derived(
    weapons.find(([key]) => key === activeTab)?.[1] ?? weapons[0][1],
  );

  function weaponImage(path: string) {
    return weaponImages[`/src/lib/assets/weapons/${path}`] ?? "";
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
</script>

{#snippet richText(parts: RichTextNode[])}
  {#each parts as part, i (i)}
    {#if part.type === "text_normal"}
      <span>{part.value}</span>
    {:else if part.type === "text_bold"}
      <span class="font-semibold text-[#e5f4e7]">{part.value}</span>
    {:else if part.type === "image"}
      <img
        src={miscImages[`/src/lib/assets/misc/${part.img_path}`]}
        alt={part.name}
        class="inline h-[1.2em] object-contain align-text-bottom mx-0.5"
        loading="lazy"
        decoding="async"
      />
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
          <img
            src={miscImages[`/src/lib/assets/misc/${toSnakeCase(resName)}.webp`]}
            alt={resName}
            class="w-4 h-4 object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
      {/each}
    </div>
  {/if}
{/snippet}

<Container>
  <div class="max-w-300 mx-auto text-[#e5f4e7] p-2 sm:p-4 font-serif">
    <header class="flex flex-col pb-2 border-b border-[#58ffa5]/25 mb-4">
      <h1
        class="text-[#ccff90] font-serif text-2xl sm:text-3xl font-normal uppercase tracking-widest m-0 drop-shadow-[0_0_10px_rgba(204,255,144,0.3)]"
      >
        Nocturnal Arms
      </h1>
      <p class="text-xs sm:text-sm text-[#8da693] font-sans mt-1 tracking-wide">
        The weapons of Melinoë, their Aspects, and Daedalus Hammer upgrades.
      </p>
    </header>

    <nav class="flex gap-2 mb-4 flex-wrap" aria-label="Select weapon">
      {#each weapons as [weaponKey, weapon] (weaponKey)}
        <button
          type="button"
          class="flex items-center gap-2 bg-[#0d1a12] border px-3 py-1.5 rounded text-xs sm:text-sm uppercase tracking-wider cursor-pointer transition-all duration-200 {activeTab ===
          weaponKey
            ? 'border-[#46f08f] text-[#ccff90] shadow-[0_0_8px_rgba(77,252,142,0.2)] bg-[#153320]'
            : 'border-[#1a3a25] text-[#8da693] hover:bg-[#153320] hover:text-[#ccff90] hover:border-[#46f08f]'}"
          onclick={() => (activeTab = weaponKey)}
        >
          <img
            src={weaponImage(weapon.image_path)}
            alt=""
            class="w-5 h-5 object-contain"
            loading="lazy"
            decoding="async"
          />
          {weapon.name}
        </button>
      {/each}
    </nav>

    {#key activeTab}
      <article
        class="flex flex-col gap-4 bg-linear-to-r from-[#0a140d] to-[#0d1c13] border border-[#1c3623] border-l-4 rounded-xl p-3 sm:p-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)] relative overflow-hidden"
        style="border-left-color: #46f08f;"
      >
        <header class="flex items-start gap-3 sm:gap-4">
          <div
            class="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-black rounded-lg border border-[#1a3a25] flex items-center justify-center p-2 shadow-[0_0_15px_rgba(0,0,0,0.8)]"
          >
            <img
              src={weaponImage(activeWeapon.image_path)}
              alt={activeWeapon.name}
              class="w-full h-full object-contain drop-shadow-lg"
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
              {activeWeapon.name}
            </h2>
            <p
              class="text-[0.75rem] sm:text-xs text-[#8da693] font-sans italic leading-snug mt-1 whitespace-pre-line"
            >
              {activeWeapon.book_of_shadows}
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
            {#each activeWeapon.aspects as aspect (aspect.name)}
              <div
                class="flex flex-col gap-2.5 bg-black/20 border border-white/5 rounded-lg p-3"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-black rounded-lg border border-[#2a4030] flex items-center justify-center p-1.5 shadow-inner"
                  >
                    <img
                      src={weaponImage(aspect.image_path)}
                      alt={aspect.name}
                      class="w-full h-full object-contain drop-shadow-lg"
                      loading="lazy"
                      decoding="async"
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
                        <th class="py-1 font-normal w-12">Rank</th>
                        <th class="py-1 font-normal w-18">Value</th>
                        <th class="py-1 font-normal">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each aspect.effect_ranks as rank, rankIdx (rankIdx)}
                        <tr class="border-b border-white/5 last:border-0">
                          <td class="py-1 text-[#8da693]">{rankIdx + 1}</td>
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
            <img
              src={miscImages["/src/lib/assets/misc/daedalus_hammer.webp"]}
              alt=""
              class="w-5 h-5 object-contain"
              loading="lazy"
              decoding="async"
            />
            Daedalus Upgrades
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
            {#each activeWeapon.upgrades as upgrade (upgrade.name)}
              <div
                class="flex gap-2.5 bg-black/20 border border-white/5 rounded-lg p-2.5 transition-colors hover:border-[#46f08f]/30"
              >
                <div
                  class="w-10 h-10 shrink-0 bg-black rounded border border-[#2a4030] flex items-center justify-center p-1 shadow-inner"
                >
                  <img
                    src={weaponImage(upgrade.image_path)}
                    alt={upgrade.name}
                    class="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
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
    {/key}
  </div>
</Container>
