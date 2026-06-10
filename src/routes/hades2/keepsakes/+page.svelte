<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import keepsakesData from "$lib/data/hades2/keepsakes.json";
  import godsData from "$lib/data/gods.json";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  let activeKeepsake = $derived(
    decodeURIComponent(page.url.hash).replace("#keepsake-", ""),
  );

  $effect(() => {
    if (activeKeepsake) {
      const element = document.getElementById(`keepsake-${activeKeepsake}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);
      }
    }
  });

  const keepsakeImages = import.meta.glob("$lib/assets/keepsakes/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  const miscImages = import.meta.glob("/src/lib/assets/misc/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  type DescriptionRich =
    | { type: "text_normal"; value: string }
    | { type: "text_bold"; value: string }
    | { type: "image"; image_file: string }
    | { type: "effect_values" };

  type KeepsakeDetails = {
    name: string;
    image_file: string;
    provider: string;
    effect_values: string[];
    description_rich: DescriptionRich[];
  };

  const gods = Object.keys(godsData);
  const keepsakes = Object.entries(keepsakesData) as [
    string,
    KeepsakeDetails,
  ][];

  const effectValueColors = [
    "text-white",
    "text-blue-400",
    "text-purple-400",
    "text-rose-500",
  ];

  function isGodProvider(provider: string): boolean {
    return gods.includes(provider);
  }

  function keepsakeImageUrl(imageFile: string): string | undefined {
    return keepsakeImages[`/src/lib/assets/keepsakes/${imageFile}`];
  }
</script>

<Container>
  <div class="keepsakesPage w-full p-2 max-w-6xl mx-auto flex flex-col gap-3">
    <header class="text-center px-1">
      <h1 class="text-2xl sm:text-3xl font-bold text-[#eff7e8]">Keepsakes</h1>
      <p class="text-sm text-textLight/80 mt-1">
        Keepsakes can be upgraded 2 times through clearing encounters. <b
          >Rank 2</b
        >
        is gained after 25 Encounters. <b>Rank 3</b> is gained after 50 Encounters.
        The Quickening of Sentimental Value Incantation can cut these numbers by half.
      </p>
      <p class="text-sm text-textLight/80 mt-1">
        The Heroic rank is only gained through the Cherished Heirloom boon.
      </p>
    </header>

    <div
      class="keepsakesGrid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3"
    >
      {#each keepsakes as [, details] (details.name)}
        {@const imageUrl = keepsakeImageUrl(details.image_file)}
        <article
          class="keepsakeCard flex flex-col h-full rounded-xl border border-white/20 bg-[#1a221a]/80 shadow-lg shadow-black/30 overflow-hidden hover:border-[#5a7a52]/60 hover:bg-[#1f2a1f]/90 transition-colors"
        >
          <div
            class="imageWrap relative w-full flex justify-center items-center bg-[#0d140d]"
          >
            {#if imageUrl}
              <img
                src={imageUrl}
                alt={details.name}
                class="h-auto max-w-30 object-contain"
              />
            {:else}
              <div
                class="flex aspect-square items-center justify-center bg-linear-to-br from-emerald-950 to-[#0d140d] p-4"
              >
                <span
                  class="text-center text-xs text-textDark/70 font-medium leading-tight"
                >
                  {details.name}
                </span>
              </div>
            {/if}
          </div>

          <div
            class="cardBody flex flex-col flex-1 gap-2 p-2.5 min-h-0"
            id="keepsake-{details.name}"
            class:highlighted={details.name === activeKeepsake}
          >
            <div class="text-center flex flex-col gap-0.5">
              <h2
                class="text-sm sm:text-base font-bold text-textDark leading-tight"
              >
                {details.name}
              </h2>
              <p class="text-[11px] sm:text-xs text-textLight/70">
                from
                {#if isGodProvider(details.provider)}
                  <a
                    href={resolve(`/hades2/gods/${details.provider}`)}
                    class="text-textDark font-medium hover:text-[#eff7e8] transition-colors underline-offset-2 hover:underline"
                  >
                    {details.provider}
                  </a>
                {:else}
                  <span class="text-textLight font-medium"
                    >{details.provider}</span
                  >
                {/if}
              </p>
            </div>

            <p
              class="text-center text-textLight text-[11px] sm:text-xs leading-snug flex-1 font-light"
            >
              {#each details.description_rich as part, i (`${part.type}-${i}`)}
                {#if part.type === "text_normal"}
                  {part.value}
                {:else if part.type === "text_bold"}
                  <strong class="text-[#eff7e8] font-semibold"
                    >{part.value}</strong
                  >
                {:else if part.type === "effect_values"}
                  <span
                    class="effectsTextContainer bg-[#0d140d] border rounded-md border-white/20 inline-flex flex-wrap justify-center gap-x-1 p-0.5 mr-0.5 ml-0.5 gap-y-0.5 align-middle"
                  >
                    {#each details.effect_values as effect, index (index)}
                      <span
                        class="text-xs ml-0.5 mr-0.5 font-bold font-mono leading-none {effectValueColors[
                          index
                        ] ?? 'text-textLight'}"
                      >
                        {effect}
                      </span>
                    {/each}
                  </span>
                {:else if part.type === "image"}
                  <img
                    class="inline-block h-[1.55em] w-auto object-contain align-middle"
                    src={miscImages[`/src/lib/assets/misc/${part.image_file}`]}
                    alt={part.image_file}
                    title={part.image_file}
                  />
                {/if}
              {/each}
            </p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</Container>

<style>
  .highlighted {
    background-color: #5d7459;
    /* border: 2px solid #fbc02d; */
    /* box-shadow: 0 4px 12px rgba(251, 192, 45, 0.3); */
  }
</style>
