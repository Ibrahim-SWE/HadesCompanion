<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import LazyEnhancedImg from "$lib/components/LazyEnhancedImg.svelte";
  import { loadGodImage } from "$lib/assets/godImages";
  import { getGodTypeLabel } from "$lib/god-display";
  import godsData from "$lib/data/gods.json";
  import { resolve } from "$app/paths";
  import type { GodDetails } from "$lib/types/hades2";

  const gods = godsData as Record<string, GodDetails>;
  const sortedGodsArray: [string, GodDetails][] = Object.entries(gods).sort(
    (a, b) => a[0].localeCompare(b[0]),
  );
</script>

<Container>
  <div class="w-full max-w-300 mx-auto text-[#e5f4e7] p-2 sm:p-3 font-serif">
    <header class="flex flex-col pb-1.5 border-b border-[#58ffa5]/25 mb-2">
      <h1
        class="text-[#ccff90] font-serif text-2xl sm:text-3xl font-normal uppercase tracking-widest m-0 drop-shadow-[0_0_10px_rgba(204,255,144,0.3)]"
      >
        Gods & Characters
      </h1>
      <p
        class="text-[0.7rem] sm:text-xs text-[#8da693] font-sans mt-0.5 tracking-wide leading-snug"
      >
        Gods and characters who grant boons and offerings in Hades 2. Click for
        full details, or jump to a keepsake or curse below.
      </p>
    </header>

    <div
      class="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1.5"
    >
      {#each sortedGodsArray as [god, godData] (god)}
        {@const h2 = godData.hades_2}

        <article
          class="flex w-full min-w-0 flex-col gap-1.5 bg-linear-to-r from-[#0a140d] to-[#0d1c13] border border-[#1c3623] border-l-[3px] rounded-md p-2 shadow-[0_2px_10px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all hover:border-[#46f08f]/50 hover:shadow-[0_2px_14px_rgba(70,240,143,0.1)] group"
          style="border-left-color: #46f08f;"
        >
          <a
            href={resolve(`/hades2/gods/${god}`)}
            class="absolute inset-0 z-0"
            aria-label={`View ${god}`}
          ></a>

          <div
            class="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-[#46f08f]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          ></div>

          <div
            class="relative w-full shrink-0 aspect-3/4 bg-black rounded-lg border border-[#1a3a25] overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10 pointer-events-none"
          >
            <LazyEnhancedImg
              load={() => loadGodImage(god)}
              alt={god}
              class="w-full h-full object-cover object-top"
              placeholderClass="w-full h-full bg-[#0d1c13]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 220px"
            />
            <div
              class="absolute inset-0 shadow-[inset_0_0_12px_rgba(0,0,0,0.8)] pointer-events-none rounded-lg"
            ></div>
          </div>

          <div
            class="flex flex-1 min-w-0 flex-col gap-1.5 z-10 relative pointer-events-none"
          >
            <div>
              <span
                class="text-[0.65rem] uppercase tracking-widest text-[#46f08f] block leading-tight mb-0.5"
              >
                {getGodTypeLabel(godData)}
              </span>
              <h2
                class="text-base sm:text-lg font-serif text-[#ccff90] uppercase tracking-wide m-0 drop-shadow-sm leading-tight"
              >
                {god}
              </h2>
              <p class="text-xs sm:text-sm text-[#b3c2b7] font-sans leading-snug mt-0.5 line-clamp-2">
                {godData.title}
              </p>
            </div>

            {#if h2 && (h2.keepsake || h2.curses.length > 0)}
              <div class="w-full h-px bg-white/5"></div>

              <div class="flex flex-col gap-1 mt-auto pointer-events-auto">
                {#if h2.keepsake}
                  <a
                    href={`${resolve("/hades2/keepsakes")}#keepsake-${encodeURIComponent(h2.keepsake)}`}
                    class="flex items-center justify-between gap-1.5 bg-[#153320] border border-[#2d5a3c] rounded px-2 py-1.5 shadow-[inset_0_1px_0_rgba(70,240,143,0.1)] hover:border-[#46f08f]/60 hover:bg-[#1a3f28] transition-colors relative z-20 min-w-0"
                  >
                    <span
                      class="text-[0.65rem] uppercase tracking-widest text-[#46f08f] font-sans font-semibold shrink-0"
                    >
                      Keepsake
                    </span>
                    <span
                      class="text-sm text-[#ccff90] font-sans font-medium text-right leading-tight truncate"
                    >
                      {h2.keepsake}
                    </span>
                  </a>
                {/if}

                {#if h2.curses.length > 0}
                  <div
                    class="bg-[#153320] border border-[#2d5a3c] rounded px-2 py-1.5 shadow-[inset_0_1px_0_rgba(70,240,143,0.1)]"
                  >
                    <span
                      class="text-[0.65rem] uppercase tracking-widest text-[#46f08f] font-sans font-semibold block leading-tight mb-1"
                    >
                      Curses
                    </span>
                    <div class="flex flex-wrap gap-1.5">
                      {#each h2.curses as curse (curse)}
                        <a
                          href={resolve(
                            `/hades2/curses#curse-${encodeURIComponent(curse)}` as `/hades2/curses#${string}`,
                          )}
                          class="text-sm text-[#ccff90] bg-black/40 border border-[#1c3623] rounded px-2 py-0.5 font-sans hover:border-[#46f08f]/50 hover:text-white transition-colors relative z-20"
                        >
                          {curse}
                        </a>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  </div>
</Container>
