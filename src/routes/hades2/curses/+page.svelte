<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import cursesData from "$lib/data/hades2/curses.json";

  type CurseDetails = { effect: string; duration: string; source: string };

  const curses: Record<string, CurseDetails> = cursesData;
</script>

<Container>
  <div class="max-w-300 mx-auto text-[#e5f4e7] p-2 sm:p-3 font-serif">
    <header class="flex flex-col pb-1.5 border-b border-[#58ffa5]/25 mb-2">
      <h1
        class="text-[#ccff90] font-serif text-2xl sm:text-3xl font-normal uppercase tracking-widest m-0 drop-shadow-[0_0_10px_rgba(204,255,144,0.3)]"
      >
        Curses & Status Effects
      </h1>
      <p
        class="text-[0.7rem] sm:text-xs text-[#8da693] font-sans mt-0.5 tracking-wide leading-snug"
      >
        A list of all curses and status effects in Hades II. Click a curse to
        find its boons.
      </p>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5">
      {#each Object.entries(curses) as [curse, details] (curse)}
        <a
          href="/hades2/boons?search={curse}"
          class="flex flex-col h-full bg-linear-to-r from-[#0a140d] to-[#0d1c13] border border-[#1c3623] border-l-[3px] rounded-md p-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all hover:border-[#46f08f]/50 hover:shadow-[0_2px_14px_rgba(70,240,143,0.1)] group"
          style="border-left-color: #46f08f;"
        >
          <div
            class="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-[#46f08f]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          ></div>

          <div class="flex flex-col flex-1 min-w-0 h-full z-10 relative">
            <span
              class="text-xs uppercase tracking-widest text-[#46f08f] block leading-tight mb-0.5 truncate"
              >{details.source}</span
            >
            <h2
              class="text-lg sm:text-xl font-serif text-[#ccff90] uppercase tracking-wide m-0 drop-shadow-sm leading-tight"
            >
              {curse}
            </h2>
            <p class="text-sm text-[#b3c2b7] font-sans leading-snug mt-1">
              {details.effect}
            </p>
            {#if details.duration && details.duration !== "N/A"}
              <div class="mt-auto w-full">
                <div
                  class="mt-2 flex items-center justify-between gap-2 bg-[#153320] border border-[#2d5a3c] rounded-md px-2 py-1.5 shadow-[inset_0_1px_0_rgba(70,240,143,0.1)]"
                >
                  <span
                    class="text-[0.65rem] uppercase tracking-widest text-[#46f08f] font-sans font-semibold shrink-0"
                  >
                    Duration
                  </span>
                  <span class="text-xs text-[#ccff90] font-sans font-medium text-right leading-tight">
                    {details.duration}
                  </span>
                </div>
              </div>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  </div>
</Container>
