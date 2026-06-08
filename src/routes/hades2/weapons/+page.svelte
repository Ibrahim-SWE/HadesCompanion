<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import weaponsData from "$lib/data/hades2/weapons.json";

  const upgradeImages = import.meta.glob("$lib/assets/weaponupgrades/*.webp", {
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

  type WeaponsDatabase = Record<string, WeaponDetails>;
  const weapons = weaponsData as WeaponsDatabase;
</script>

<Container>
  <div class="weaponsContainer text-textLight">
    {#each Object.entries(weapons) as [weaponName, details] (weaponName)}
      <div class="weaponContainer p-2 border border-white/20">
        <div class="infoContainer p-2">
          <h1 class="text-textDark text-2xl">{weaponName}</h1>
          <!-- <h2 class="ml-4">Book of Shadows Entry:</h2> -->
          <p class="ml-6 italic font-extralight text-sm indent-5">
            {details.entry}
          </p>
        </div>
        <h2 class="text-center border-t border-white/20 pt-0.5 pb-0.5">
          Upgrades
        </h2>
        <div
          class="upgradesContainer grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {#each details.upgrades as upgrade (upgrade.name)}
            <div
              class="upgradeContainer bg-black/40 grid grid-cols-[1fr_1.5fr] justify-items-center items-center border border-white/20 p-1 rounded-xl"
            >
              <img
                src={upgradeImages[
                  `/src/lib/assets/weaponupgrades/${upgrade.image_path}`
                ]}
                alt="Upgrade Icon"
                class="inline-block h-[3.4em] w-auto object-contain align-middle outline-2 -outline-offset-2 outline-white/30 rounded-2xl"
              />
              <h1 class="upgradeName justify-self-start text-xl">
                {upgrade.name}
              </h1>
              <div
                class="descriptionContainer ml-3 mr-3 mt-2 text-center col-span-2 italic font-light text-sm"
              >
                {#each upgrade.description_rich as part, i (i)}
                  {#if part.type === "text_normal"}
                    <span>{part.value}</span>
                  {/if}
                  {#if part.type === "text_bold"}
                    <span class="font-bold">{part.value}</span>
                  {/if}
                  {#if part.type === "image"}
                    <span class="inline-block">
                      <img
                        src={miscImages[
                          `/src/lib/assets/misc/${part.img_path}`
                        ]}
                        alt={part.name}
                        class="inline-block h-[1.4em] w-auto object-contain align-middle"
                      />
                    </span>
                  {/if}
                {/each}
              </div>
            </div>
          {/each}
        </div>
        <h2 class="text-center border-t border-white/20 pt-0.5 pb-0.5">
          Aspects
        </h2>
        <div class="aspectsContainer">
          {#each details.aspects as aspect (aspect)}
            <div class="aspectContainer">
              <h2>{aspect.name}</h2>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</Container>
