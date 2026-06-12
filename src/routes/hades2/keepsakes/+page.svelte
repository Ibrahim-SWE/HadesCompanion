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
    "text-[#5bc0eb]",
    "text-[#c071ff]",
    "text-[#ff5e7e]",
  ];

  function isGodProvider(provider: string): boolean {
    return gods.includes(provider);
  }

  function keepsakeImageUrl(imageFile: string): string {
    return keepsakeImages[`/src/lib/assets/keepsakes/${imageFile}`] ?? "";
  }
</script>

{#snippet descriptionRich(
  parts: DescriptionRich[],
  effectValues: string[],
)}
  {#each parts as part, i (`${part.type}-${i}`)}
    {#if part.type === "text_normal"}
      <span>{part.value}</span>
    {:else if part.type === "text_bold"}
      <span class="font-semibold text-[#e5f4e7]">{part.value}</span>
    {:else if part.type === "effect_values"}
      <span
        class="inline-flex flex-wrap gap-0.5 align-middle mx-0.5"
        aria-label="Keepsake ranks"
      >
        {#each effectValues as effect, index (index)}
          <span
            class="bg-black px-1 py-px rounded font-mono text-[0.7rem] leading-tight {effectValueColors[
              index
            ] ?? 'text-[#b3c2b7]'}"
          >
            {effect}
          </span>
        {/each}
      </span>
    {:else if part.type === "image"}
      <img
        src={miscImages[`/src/lib/assets/misc/${part.image_file}`]}
        alt={part.image_file.replace("_icon.webp", "").replace(/_/g, " ")}
        class="inline-block h-[1.65em] w-auto object-contain align-middle mx-0.5"
        loading="lazy"
        decoding="async"
      />
    {/if}
  {/each}
{/snippet}

<Container>
  <div class="max-w-300 mx-auto text-[#e5f4e7] p-2 sm:p-3 font-serif">
    <header class="flex flex-col pb-1.5 border-b border-[#58ffa5]/25 mb-2">
      <h1
        class="text-[#ccff90] font-serif text-2xl sm:text-3xl font-normal uppercase tracking-widest m-0 drop-shadow-[0_0_10px_rgba(204,255,144,0.3)]"
      >
        Keepsakes
      </h1>
      <p class="text-[0.7rem] sm:text-xs text-[#8da693] font-sans mt-0.5 tracking-wide leading-snug">
        Gifts from allies that grow stronger as you complete runs. Rank 2 unlocks after 25
        encounters, Rank 3 after 50. The Quickening of Sentimental Value
        Incantation halves these requirements. Heroic rank requires the Cherished
        Heirloom duo boon from Demeter and Hera.
      </p>
    </header>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
      {#each keepsakes as [, details] (details.name)}
        {@const imageUrl = keepsakeImageUrl(details.image_file)}
        {@const highlighted = details.name === activeKeepsake}

        <article
          id="keepsake-{details.name}"
          aria-current={highlighted ? "true" : undefined}
          class="flex flex-col items-center bg-linear-to-r from-[#0a140d] to-[#0d1c13] border border-[#1c3623] border-l-[3px] rounded-md p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all hover:border-[#46f08f]/50 hover:shadow-[0_2px_14px_rgba(70,240,143,0.1)] group {highlighted
            ? 'highlighted-card border-[#46f08f] border-l-4 bg-[#122418] shadow-[0_0_0_2px_rgba(70,240,143,0.7),0_0_28px_rgba(70,240,143,0.45)] scale-[1.04] z-20'
            : ''}"
          style="border-left-color: #46f08f;"
        >
          <div
            class="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-[#46f08f]/80 to-transparent transition-opacity duration-300 z-10 {highlighted
              ? 'opacity-100 w-1'
              : 'opacity-0 group-hover:opacity-100'}"
          ></div>

          <div
            class="relative w-14 h-14 shrink-0 bg-black rounded border flex items-center justify-center p-1 z-10 transition-shadow {highlighted
              ? 'border-[#46f08f] shadow-[0_0_14px_rgba(70,240,143,0.55)]'
              : 'border-[#1a3a25] shadow-[0_0_8px_rgba(0,0,0,0.8)]'}"
          >
            {#if imageUrl}
              <img
                src={imageUrl}
                alt={details.name}
                class="w-full h-full object-contain drop-shadow-lg"
                loading="lazy"
                decoding="async"
              />
            {:else}
              <span
                class="text-center text-[0.55rem] text-[#8da693] font-sans leading-tight"
              >
                {details.name}
              </span>
            {/if}
            <div
              class="absolute inset-0 shadow-[inset_0_0_6px_rgba(0,0,0,0.8)] pointer-events-none rounded"
            ></div>
          </div>

          <div class="flex flex-col gap-0.5 min-w-0 w-full z-10 relative text-center mt-1">
            <span
              class="text-[0.65rem] uppercase tracking-widest text-[#46f08f] block leading-tight truncate"
            >
              {#if isGodProvider(details.provider)}
                <a
                  href={resolve(`/hades2/gods/${details.provider}`)}
                  class="hover:text-[#ccff90] transition-colors"
                >
                  {details.provider}
                </a>
              {:else}
                {details.provider}
              {/if}
            </span>
            <h2
              class="text-sm font-serif uppercase tracking-wide m-0 leading-tight {highlighted
                ? 'text-white drop-shadow-[0_0_10px_rgba(204,255,144,0.7)]'
                : 'text-[#ccff90] drop-shadow-sm'}"
            >
              {details.name}
            </h2>
            <p class="text-xs text-[#a4bea9] font-sans leading-snug">
              {@render descriptionRich(
                details.description_rich,
                details.effect_values,
              )}
            </p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</Container>

<style>
  .highlighted-card {
    animation: keepsake-highlight-pulse 2s ease-in-out infinite;
  }

  @keyframes keepsake-highlight-pulse {
    0%,
    100% {
      box-shadow:
        0 0 0 2px rgba(70, 240, 143, 0.65),
        0 0 24px rgba(70, 240, 143, 0.35);
    }
    50% {
      box-shadow:
        0 0 0 3px rgba(70, 240, 143, 0.95),
        0 0 36px rgba(70, 240, 143, 0.55);
    }
  }
</style>
