<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import cardsData from "$lib/data/hades2/arcana_cards.json";
  const cardImages = import.meta.glob("$lib/assets/cards/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  const miscImages = import.meta.glob("/src/lib/assets/misc/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  type UpgradeCostItems = { [resourceName: string]: number };
  type DescriptionRich =
    | { type: "text_normal" | "text_bold"; value: string }
    | { type: "image"; image_file: string };
  type CardDetails = {
    name: string;
    image_file: string;
    description_rich: DescriptionRich[];
    effect_values: string[];
    graspCost: string;
    upgradeCosts: UpgradeCostItems[][];
    note: string;
  };

  const cards = Object.entries(cardsData) as [string, CardDetails][];

  function toSnakeCase(str: string) {
    return str.toLowerCase().replace(/\s+/g, "_");
  }
</script>

<Container>
  <div class="cardsContainer grid grid-cols-5 gap-3 max-w-4xl mx-auto">
    {#each cards as [card, details] (card)}
      <div
        class="cardContainer flex flex-col h-full p-2 border border-white/20 rounded-lg bg-black/20 hover:bg-black/40 transition-colors shadow-md"
      >
        <div class="imgsContainer relative w-full flex-none">
          <img
            src={cardImages[`/src/lib/assets/cards/${details.image_file}`]}
            alt={details.name}
            class="w-full h-auto rounded-md shadow-sm"
          />

          <div
            class="graspContainer absolute top-1 left-1 z-10 flex items-center bg-black/40 backdrop-blur-sm px-1.5 rounded-md border border-white/20 shadow-lg"
          >
            <span
              class="text-xs font-bold text-amber-400 font-mono leading-none"
            >
              {details.graspCost}
            </span>
            <img
              src={miscImages[`/src/lib/assets/misc/grasp.webp`]}
              alt="Grasp"
              class="w-6 h-6 object-contain"
            />
          </div>

          {#if details.effect_values && details.effect_values.length > 0}
            <div
              class="effectsContainer absolute bottom-1 left-1 z-10 flex flex-col items-start gap-1 bg-black/60 backdrop-blur-sm px-1.5 py-1 rounded-md border border-white/20 shadow-lg"
            >
              {#each details.effect_values as effect, index (index)}
                <span
                  class="text-xs font-bold font-mono leading-none
          {index === 0 ? 'text-white' : ''}
          {index === 1 ? 'text-blue-400' : ''}
          {index === 2 ? 'text-purple-400' : ''}
          {index === 3 ? 'text-rose-500' : ''}
        "
                >
                  {effect}
                </span>
              {/each}
            </div>
          {/if}

          {#if details.upgradeCosts && details.upgradeCosts.length > 0}
            <div
              class="upgradesContainer absolute top-1 right-1 z-10 flex flex-col items-end gap-1"
            >
              {#each details.upgradeCosts as tier, tierIndex (tierIndex)}
                <div
                  class="flex items-center w-fit pl-1 bg-black/60 backdrop-blur-sm rounded border border-white/20 shadow-sm overflow-hidden"
                >
                  {#each tier as costObject, costIndex (costIndex)}
                    {#each Object.entries(costObject) as [item, amount] (item)}
                      <div
                        class="flex items-center gap-1 px-0.5 py-0.5"
                        title={item}
                      >
                        <span
                          class="text-xs font-bold font-mono leading-none
                  {tierIndex === 0 ? 'text-white' : ''}
                  {tierIndex === 1 ? 'text-blue-400' : ''}
                  {tierIndex === 2 ? 'text-purple-400' : ''}
                "
                        >
                          {amount}
                        </span>
                        <img
                          src={miscImages[
                            `/src/lib/assets/misc/${toSnakeCase(item)}.webp`
                          ]}
                          alt={item}
                          class="w-3.5 h-3.5 object-contain"
                        />
                      </div>

                      {#if costIndex !== tier.length - 1}
                        <div class="w-px h-3.5 bg-white/20"></div>
                      {/if}
                    {/each}
                  {/each}
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <div class="textContainer flex flex-col flex-1">
          <h1
            class="text-center text-textDark font-bold text-sm sm:text-lg flex-none"
          >
            {card}
          </h1>

          <div class="flex flex-col flex-1 mt-2">
            <p
              class="text-center text-white font-extralight text-xs sm:text-sm flex-1 flex items-center justify-center px-1"
            >
              <span>
                {#each details.description_rich as part (part)}
                  {#if part.type === "text_normal"}
                    {part.value}
                  {:else if part.type === "text_bold"}
                    <span class="font-bold">{part.value}</span>
                  {:else if part.type === "image"}
                    <img
                      class="inline-block h-[1.4em] w-auto object-contain align-middle"
                      src={miscImages[
                        `/src/lib/assets/misc/${part.image_file}`
                      ]}
                      alt="{part.image_file} Icon"
                    />
                  {/if}
                {/each}
              </span>
            </p>

            {#if details.note && details.note.length > 0}
              <p
                class="text-center text-xs p-1 text-emerald-400 flex-1 flex items-center justify-center border-t border-white/10 mt-1"
              >
                {details.note}
              </p>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</Container>
