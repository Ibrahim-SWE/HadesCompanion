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
  <div
    class="godsContainer grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-1"
  >
    {#each sortedGodsArray as [god, godData] (god)}
      {@const imageUrl = godImageUrl(god)}
      <article
        class="godContainer group relative overflow-hidden rounded-xl border border-white/20 aspect-[3/4] min-h-48 shadow-lg shadow-black/40"
      >
        {#if imageUrl}
          <img
            src={imageUrl}
            alt={god}
            class="absolute inset-0 h-full w-full object-cover object-center scale-105 transition-transform duration-300 group-hover:scale-110"
          />
        {:else}
          <div
            class="absolute inset-0 bg-linear-to-br from-emerald-950 to-[#1a1c18]"
          ></div>
        {/if}

        <div
          class="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/10"
        ></div>

        <div
          class="relative flex h-full flex-col justify-end gap-1.5 p-3 sm:p-4"
        >
          <a
            href={resolve(`/hades2/gods/${god}`)}
            class="godName text-xl sm:text-2xl font-bold text-[#eff7e8] leading-tight hover:text-textDark transition-colors w-fit"
          >
            {god}
          </a>
          <p class="godTitle text-sm text-textLight/90 leading-snug">
            {godData.title}
          </p>

          {#if godData.hades_2}
            <div
              class="mt-1 flex flex-col gap-1 border-t border-white/15 pt-2 text-xs sm:text-sm"
            >
              {#if godData.hades_2.keepsake}
                <p class="text-textLight/80">
                  <span class="text-textDark font-medium">Keepsake:</span>
                  {godData.hades_2.keepsake}
                </p>
              {/if}
              {#if godData.hades_2.curses.length > 0}
                <p class="text-textLight/80">
                  <span class="text-textDark font-medium">Curses:</span>
                  {godData.hades_2.curses.join(", ")}
                </p>
              {/if}
            </div>
          {/if}
        </div>
      </article>
    {/each}
  </div>
</Container>
