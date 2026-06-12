<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import cursesData from "$lib/data/hades2/curses.json";

  type CurseDetails = { effect: string; duration: string; source: string };

  const curses: Record<string, CurseDetails> = cursesData;
</script>

<Container>
  <div class="max-w-300 mx-auto text-[#e5f4e7] p-2 sm:p-4 font-serif">
    <header class="flex flex-col pb-2 border-b border-[#58ffa5]/25 mb-4">
      <h1
        class="text-[#ccff90] font-serif text-2xl sm:text-3xl font-normal uppercase tracking-widest m-0 drop-shadow-[0_0_10px_rgba(204,255,144,0.3)]"
      >
        Curses & Status Effects
      </h1>
      <p class="text-xs sm:text-sm text-[#8da693] font-sans mt-1 tracking-wide">
        A list of all curses and status effects in Hades II.
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      {#each Object.entries(curses) as [curse, details] (curse)}
        <a
          href="/hades2/boons?search={curse}"
          class="flex flex-col bg-linear-to-r from-[#0a140d] to-[#0d1c13] border border-[#1c3623] border-l-4 rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all hover:border-[#46f08f]/50 hover:shadow-[0_4px_20px_rgba(70,240,143,0.1)] group"
          style="border-left-color: #46f08f;"
        >
          <div
            class="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-[#46f08f]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          ></div>

          <div class="flex-1 min-w-0 z-10 relative">
            <span
              class="text-[0.6rem] uppercase tracking-widest text-[#46f08f] block leading-tight mb-0.5"
              >{details.source}</span
            >
            <h2
              class="text-lg sm:text-xl font-serif text-[#ccff90] uppercase tracking-wider m-0 drop-shadow-sm"
            >
              {curse}
            </h2>
            <p class="text-sm text-[#b3c2b7] font-sans leading-snug mt-2">
              {details.effect}
            </p>
            {#if details.duration && details.duration !== "N/A"}
              <p class="text-xs text-[#8da693] font-sans leading-snug mt-2">
                <strong class="font-semibold text-[#b3c2b7]">Duration:</strong>
                {details.duration}
              </p>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  </div>
</Container>
