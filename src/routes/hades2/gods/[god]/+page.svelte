<script lang="ts">
  import Boon from "$lib/components/Boon.svelte";
  import Container from "$lib/components/Container.svelte";
  import LazyEnhancedImg from "$lib/components/LazyEnhancedImg.svelte";
  import { loadGodImage } from "$lib/assets/godImages";
  import { getGodTypeLabel } from "$lib/god-display";
  import boonsData from "$lib/data/hades2/boons.json";
  import godsData from "$lib/data/gods.json";
  import { resolve } from "$app/paths";
  import type { PageData } from "./$types";
  import type { BoonData, GodDetails } from "$lib/types/hades2";

  let { data }: { data: PageData } = $props();

  const godName = $derived(data.godName);
  const godData = $derived((godsData as Record<string, GodDetails>)[godName]);

  const godBoons = $derived(
    (Object.values(boonsData) as BoonData[])
      .filter((boon) => boon.gods.includes(godName))
      .sort((a, b) => a.name.localeCompare(b.name)),
  );
</script>

<Container>
  <div class="max-w-300 mx-auto text-[#e5f4e7] p-2 sm:p-4 font-serif">
    <a
      href={resolve('/hades2/gods')}
      class="inline-flex items-center text-sm font-sans uppercase tracking-widest text-[#8da693] hover:text-[#46f08f] transition-colors mb-6 group"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="square"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      All Gods
    </a>

    <header
      class="flex flex-col md:flex-row gap-6 lg:gap-10 items-start md:items-stretch mb-10 bg-linear-to-r from-[#0a140d] to-[#0d1c13] border border-[#1c3623] border-l-4 rounded-xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.5)] relative overflow-hidden"
      style="border-left-color: #46f08f;"
    >
      <!-- decorative accent line -->
      <div
        class="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-[#46f08f]/80 to-transparent z-10"
      ></div>

      <div
        class="relative overflow-hidden rounded-lg border border-[#1a3a25] aspect-3/4 w-48 sm:w-56 md:w-64 shrink-0 mx-auto md:mx-0 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
      >
        <LazyEnhancedImg
          load={() => loadGodImage(godName)}
          alt={godName}
          class="h-full w-full object-cover object-center scale-105"
          placeholderClass="h-full w-full bg-linear-to-b from-[#0a140d] to-[#0d1c13]"
          sizes="256px"
          eager
        />
        <!-- inner shadow overlay -->
        <div
          class="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none"
        ></div>
      </div>

      <div class="flex flex-col gap-4 flex-1 w-full text-center md:text-left z-10 pt-2 h-full">
        <div>
          <span
            class="text-[0.7rem] uppercase tracking-widest text-[#46f08f] block leading-tight mb-2"
            >{getGodTypeLabel(godData)}</span
          >
          <h1
            class="text-4xl sm:text-5xl font-serif text-[#ccff90] uppercase tracking-wider m-0 drop-shadow-[0_0_10px_rgba(204,255,144,0.3)]"
          >
            {godName}
          </h1>
          <p class="text-lg text-[#8da693] font-sans mt-2 tracking-wide">
            {godData.title}
          </p>
        </div>

        {#if godData.hades_2}
          <div
            class="mt-auto flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 lg:gap-8 bg-black/30 border border-white/5 rounded-lg p-4"
          >
            {#if godData.hades_2.keepsake}
              <div class="flex-1">
                <span
                  class="text-[#8da693] uppercase text-xs tracking-wider block mb-1 font-sans"
                  >Keepsake</span
                >
                <a
                  href={resolve(
                    `/hades2/keepsakes#keepsake-${encodeURIComponent(godData.hades_2.keepsake)}` as `/hades2/keepsakes#${string}`,
                  )}
                  class="text-[#e5f4e7] hover:text-[#46f08f] transition-colors font-medium flex items-center justify-center md:justify-start gap-2 group"
                >
                  {godData.hades_2.keepsake}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            {/if}

            {#if godData.hades_2.curses.length > 0}
              <div
                class="flex-1 border-t sm:border-t-0 md:border-t lg:border-t-0 sm:border-l md:border-l-0 lg:border-l border-white/10 pt-3 sm:pt-0 md:pt-3 lg:pt-0 sm:pl-4 md:pl-0 lg:pl-8"
              >
                <span
                  class="text-[#8da693] uppercase text-xs tracking-wider block mb-2 font-sans"
                  >Curses</span
                >
                <div
                  class="flex flex-wrap justify-center md:justify-start gap-2 font-sans"
                >
                  {#each godData.hades_2.curses as curse (curse)}
                    <a
                      href={resolve(
                        `/hades2/curses#curse-${encodeURIComponent(curse)}` as `/hades2/curses#${string}`,
                      )}
                      class="rounded bg-[#153320] border border-[#1c3623] hover:border-[#46f08f]/50 px-2.5 py-1 text-xs text-[#ccff90] hover:shadow-[0_0_8px_rgba(70,240,143,0.15)] transition-all"
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
    </header>

    <section class="flex flex-col gap-5">
      <div
        class="flex justify-between items-center pb-2 border-b border-[#58ffa5]/25"
      >
        <h2
          class="text-2xl font-serif text-[#ccff90] uppercase tracking-widest m-0 flex items-end gap-3"
        >
          Boons
          <span
            class="text-sm font-sans tracking-normal text-[#8da693] mb-1"
          >
            ({godBoons.length})
          </span>
        </h2>
      </div>

      {#if godBoons.length > 0}
        <div
          class="grid grid-cols-1 min-[450px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {#each godBoons as boon (boon.name)}
            <Boon {boon} />
          {/each}
        </div>
      {:else}
        <div
          class="bg-black/20 border border-white/5 rounded-lg p-8 text-center text-[#8da693] font-sans"
        >
          No boons found for this god.
        </div>
      {/if}
    </section>
  </div>
</Container>
