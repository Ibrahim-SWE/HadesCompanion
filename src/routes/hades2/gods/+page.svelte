<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import godsData from "$lib/data/gods.json";
  import { resolve } from "$app/paths";

  type godsKeepsakeAndCurses = { keepsake: string; curses: string[] };

  type GodDetails = {
    title: string;
    hades_1: godsKeepsakeAndCurses | null;
    hades_2: godsKeepsakeAndCurses | null;
  };

  const gods: Record<string, GodDetails> = godsData;
  const sortedGodsArray: [string, GodDetails][] = Object.entries(gods).sort(
    (a, b) => a[0].localeCompare(b[0]),
  );

  const godImages = import.meta.glob("$lib/assets/gods/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  function godImageUrl(godName: string): string | undefined {
    return godImages[`/src/lib/assets/gods/${godName}.webp`];
  }
</script>

<Container>
  <div class="max-w-300 mx-auto text-[#e5f4e7] p-4 font-serif">
    <header
      class="flex justify-between items-center pb-3 border-b border-[#58ffa5]/25 mb-6"
    >
      <h1
        class="text-[#ccff90] font-serif text-3xl font-normal uppercase tracking-widest m-0 drop-shadow-[0_0_10px_rgba(204,255,144,0.3)]"
      >
        Olympian Gods
      </h1>
    </header>

    <div
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      {#each sortedGodsArray as [god, godData] (god)}
        {@const imageUrl = godImageUrl(god)}
        <a
          href="{resolve('/hades2/gods')}/{god}"
          class="group relative overflow-hidden rounded-xl border border-[#1a3a25] aspect-[3/4] shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_rgba(70,240,143,0.15)] hover:border-[#46f08f]/50 transition-all duration-300 hover:-translate-y-1 block"
        >
          {#if imageUrl}
            <img
              src={imageUrl}
              alt={god}
              class="absolute inset-0 h-full w-full object-cover object-center scale-105 transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />
          {:else}
            <div
              class="absolute inset-0 bg-linear-to-b from-[#0a140d] to-[#0d1c13]"
            ></div>
          {/if}

          <!-- Dark gradient overlay for text readability -->
          <div
            class="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"
          ></div>

          <!-- Subtle accent line on hover -->
          <div
            class="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-[#46f08f]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          ></div>

          <div
            class="relative z-10 flex h-full flex-col justify-end p-3 sm:p-4"
          >
            <h2
              class="text-xl sm:text-2xl font-serif text-[#ccff90] uppercase tracking-wider m-0 group-hover:text-[#46f08f] transition-colors duration-300 drop-shadow-sm"
            >
              {god}
            </h2>
            <p class="text-[0.8rem] sm:text-sm text-[#8da693] font-sans leading-snug mt-1">
              {godData.title}
            </p>

            {#if godData.hades_2}
              <div
                class="mt-3 flex flex-col gap-1 border-t border-[#1c3623] pt-2 text-xs font-sans"
              >
                {#if godData.hades_2.keepsake}
                  <p class="text-[#a4bea9]">
                    <span
                      class="text-[#8da693] uppercase text-[0.65rem] tracking-wider block mb-0.5"
                      >Keepsake</span
                    >
                    {godData.hades_2.keepsake}
                  </p>
                {/if}
                {#if godData.hades_2.curses.length > 0}
                  <p class="text-[#a4bea9] mt-1">
                    <span
                      class="text-[#8da693] uppercase text-[0.65rem] tracking-wider block mb-0.5"
                      >Curses</span
                    >
                    {godData.hades_2.curses.join(", ")}
                  </p>
                {/if}
              </div>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  </div>
</Container>
