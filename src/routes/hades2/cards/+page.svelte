<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import cardsData from "$lib/data/hades2/arcana_cards.json";
  import type { Picture } from "@sveltejs/enhanced-img";
  const cardImages = import.meta.glob<Picture>("$lib/assets/cards/*.webp", {
    eager: true,
    import: "default",
    query: { enhanced: true, format: 'avif;webp' },
  }) as Record<string, Picture>;

  const miscImages = import.meta.glob<Picture>("/src/lib/assets/misc/*.webp", {
    eager: true,
    import: "default",
    query: { enhanced: true, format: 'avif;webp' },
  }) as Record<string, Picture>;

  function cardImage(file: string): Picture | undefined {
    return cardImages[`/src/lib/assets/cards/${file}`];
  }

  function miscImage(file: string): Picture | undefined {
    return miscImages[`/src/lib/assets/misc/${file}`];
  }

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

  let selected = $state<string | null>(null);

  function toggleCard(card: string) {
    selected = selected === card ? null : card;
  }

  function toSnakeCase(str: string) {
    return str.toLowerCase().replace(/\s+/g, "_");
  }

  // Rank value colors: Common, Rare, Epic, Heroic
  const effectValueColors = [
    "text-white",
    "text-[#5bc0eb]",
    "text-[#c071ff]",
    "text-[#ff5e7e]",
  ];

  // Cost to reach Rank II / III / IV
  const rankLabels = ["Rank I", "Rank II", "Rank III"];
  const tierColors = ["text-white", "text-[#5bc0eb]", "text-[#c071ff]"];
</script>

{#snippet cardInfo(card: string, details: CardDetails)}
  <h2
    class="text-sm font-serif text-[#ccff90] uppercase tracking-wide m-0 drop-shadow-sm leading-tight text-center"
  >
    {card}
  </h2>

  <p class="text-xs text-[#a4bea9] font-sans leading-snug text-center">
    {#each details.description_rich as part, i (i)}
      {#if part.type === "text_normal"}
        <span>{part.value}</span>
      {:else if part.type === "text_bold"}
        <span class="font-semibold text-[#e5f4e7]">{part.value}</span>
      {:else if part.type === "image"}
        {@const iconImg = miscImage(part.image_file)}
        {#if iconImg}
          <enhanced:img
            class="inline-block h-[1.5em] w-auto object-contain align-middle mx-0.5"
            src={iconImg}
            alt={part.image_file.replace("_icon.webp", "").replace(/_/g, " ")}
            loading="lazy"
            decoding="async"
          />
        {/if}
      {/if}
    {/each}
  </p>

  {#if details.effect_values && details.effect_values.length > 0}
    <div
      class="flex flex-wrap justify-center gap-0.5"
      aria-label="Effect per rank"
    >
      {#each details.effect_values as effect, index (index)}
        <span
          class="bg-black px-1 py-px rounded font-mono text-[0.7rem] leading-tight {effectValueColors[
            index
          ] ?? 'text-[#b3c2b7]'}"
        >
          {effect}
        </span>
      {/each}
    </div>
  {/if}

  {#if details.upgradeCosts && details.upgradeCosts.length > 0}
    <div
      class="grid grid-cols-3 gap-1 mt-auto pt-1.5 border-t border-white/5 w-full"
      aria-label="Upgrade costs"
    >
      {#each details.upgradeCosts as tier, tierIndex (tierIndex)}
        <div class="flex flex-col items-center gap-0.5 min-w-0">
          <span
            class="text-[0.6rem] uppercase tracking-wider font-sans font-semibold leading-none text-center {tierColors[
              tierIndex
            ] ?? 'text-white'}"
          >
            {rankLabels[tierIndex] ?? `Rank ${tierIndex + 1}`}
          </span>
          <div
            class="flex flex-col items-center gap-1 bg-[#1a3a25] px-1 py-1 rounded border border-[#2d5a3c] w-full"
          >
            {#each tier as costObject, costIndex (costIndex)}
              {#each Object.entries(costObject) as [item, amount] (item)}
                <span
                  class="flex items-center gap-1"
                  title={item}
                >
                  <span
                    class="text-sm font-bold font-mono leading-none {tierColors[
                      tierIndex
                    ] ?? 'text-white'}"
                  >
                    {amount}
                  </span>
                  {#if miscImage(`${toSnakeCase(item)}.webp`)}
                    {@const costImg = miscImage(`${toSnakeCase(item)}.webp`)!}
                    <enhanced:img
                      src={costImg}
                      alt={item}
                      class="w-5 h-5 object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  {/if}
                </span>
              {/each}
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}

  {#if details.note && details.note.length > 0}
    <p
      class="text-[0.7rem] text-[#7b9981] italic font-sans leading-snug text-center border-t border-white/5 pt-1"
    >
      {details.note}
    </p>
  {/if}
{/snippet}

<Container>
  <div class="max-w-300 mx-auto text-[#e5f4e7] p-2 sm:p-3 font-serif">
    <header class="flex flex-col pb-1.5 border-b border-[#58ffa5]/25 mb-3">
      <h1
        class="text-[#ccff90] font-serif text-2xl sm:text-3xl font-normal uppercase tracking-widest m-0 drop-shadow-[0_0_10px_rgba(204,255,144,0.3)]"
      >
        Arcana Cards
      </h1>
      <p
        class="text-[0.7rem] sm:text-xs text-[#8da693] font-sans mt-0.5 tracking-wide leading-snug"
      >
        The Arcana of the Altar of Ashes, shown in their in-game positions.
        <span class="lg:hidden">Tap a card to see its details.</span>
      </p>
    </header>

    <div class="grid grid-cols-5 gap-1.5 sm:gap-2">
      {#each cards as [card, details] (card)}
        {@const isSelected = selected === card}
        <button
          type="button"
          onclick={() => toggleCard(card)}
          class="flex flex-col gap-1.5 bg-linear-to-b from-[#0a140d] to-[#0d1c13] border rounded-md p-1 sm:p-1.5 lg:p-2 shadow-[0_2px_10px_rgba(0,0,0,0.5)] relative overflow-hidden cursor-pointer text-left transition-all group {isSelected
            ? 'border-[#46f08f] shadow-[0_0_0_2px_rgba(70,240,143,0.5),0_0_18px_rgba(70,240,143,0.3)] z-10'
            : 'border-[#1c3623] hover:border-[#46f08f]/50 hover:shadow-[0_2px_14px_rgba(70,240,143,0.1)]'}"
        >
          <div class="relative w-full">
            {#if cardImage(details.image_file)}
              {@const cardImg = cardImage(details.image_file)!}
              <enhanced:img
                src={cardImg}
                alt={card}
                class="w-full h-auto rounded shadow-sm"
                loading="lazy"
                decoding="async"
              />
            {/if}
            <div
              class="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 z-10 flex items-center gap-0.5 sm:gap-1 bg-black/85 backdrop-blur-sm px-0.5 py-px sm:px-1 sm:py-0.5 md:pl-1.5 md:pr-1 md:py-1 rounded-sm sm:rounded-md border border-[#46f08f]/60 shadow-[0_0_10px_rgba(70,240,143,0.35)]"
              title="Grasp cost"
            >
              <span
                class="text-[0.6rem] sm:text-xs md:text-sm font-bold text-[#ccff90] font-mono leading-none drop-shadow-[0_0_6px_rgba(204,255,144,0.5)]"
              >
                {details.graspCost}
              </span>
              {#if miscImage("grasp.webp")}
                {@const graspImg = miscImage("grasp.webp")!}
                <enhanced:img
                  src={graspImg}
                  alt="Grasp"
                  class="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 object-contain shrink-0"
                  loading="lazy"
                  decoding="async"
                />
              {/if}
            </div>
          </div>

          <div class="hidden lg:flex flex-col gap-1.5 flex-1 w-full">
            {@render cardInfo(card, details)}
          </div>
        </button>
      {/each}
    </div>

    {#if selected}
      {@const details = cardsData[selected as keyof typeof cardsData] as CardDetails}
      <div
        class="lg:hidden sticky bottom-2 z-30 mt-3 flex flex-col gap-1.5 bg-linear-to-r from-[#0a140d] to-[#0d1c13] border border-[#46f08f] border-l-4 rounded-lg p-3 shadow-[0_0_20px_rgba(70,240,143,0.25),0_4px_15px_rgba(0,0,0,0.8)]"
        style="border-left-color: #46f08f;"
      >
        <button
          type="button"
          onclick={() => (selected = null)}
          class="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded text-[#8da693] hover:text-[#ccff90] hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close card details"
        >
          ✕
        </button>
        {@render cardInfo(selected, details)}
      </div>
    {/if}
  </div>
</Container>
