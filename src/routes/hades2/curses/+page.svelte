<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import cursesData from "$lib/data/hades2/curses.json";
  import { page } from "$app/state";

  type CurseDetails = { effect: string; duration: string; source: string };

  const curses: Record<string, CurseDetails> = cursesData;

  let activeCurse = $derived(
    decodeURIComponent(page.url.hash).replace("#curse-", ""),
  );

  $effect(() => {
    if (activeCurse) {
      const element = document.getElementById(`curse-${activeCurse}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);
      }
    }
  });
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

    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 overflow-visible"
    >
      {#each Object.entries(curses) as [curse, details] (curse)}
        {@const highlighted = curse === activeCurse}

        <a
          id="curse-{curse}"
          href="/hades2/boons?search={encodeURIComponent(curse)}"
          aria-current={highlighted ? "true" : undefined}
          class="flex flex-col h-full bg-linear-to-r from-[#0a140d] to-[#0d1c13] border border-[#1c3623] border-l-[3px] rounded-md p-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.5)] relative transition-all hover:border-[#46f08f]/50 hover:shadow-[0_2px_14px_rgba(70,240,143,0.1)] group {highlighted
            ? 'highlighted-card overflow-visible border-[#46f08f] border-l-4 bg-[#122418] scale-[1.03] z-20'
            : 'overflow-hidden'}"
          style="border-left-color: #46f08f;"
        >
          {#if highlighted}
            <div
              class="absolute -inset-1 rounded-md bg-[#46f08f]/15 blur-md pointer-events-none z-0"
              aria-hidden="true"
            ></div>
          {/if}

          <div
            class="absolute left-0 top-0 bottom-0 bg-linear-to-b from-[#46f08f]/80 to-transparent transition-opacity duration-300 z-10 {highlighted
              ? 'opacity-100 w-1'
              : 'opacity-0 group-hover:opacity-100 w-0.5'}"
          ></div>

          <div class="flex flex-col flex-1 min-w-0 h-full z-10 relative">
            <span
              class="text-xs uppercase tracking-widest text-[#46f08f] block leading-tight mb-0.5 truncate"
              >{details.source}</span
            >
            <h2
              class="text-lg sm:text-xl font-serif uppercase tracking-wide m-0 leading-tight {highlighted
                ? 'text-white drop-shadow-[0_0_10px_rgba(204,255,144,0.7)]'
                : 'text-[#ccff90] drop-shadow-sm'}"
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
                  <span
                    class="text-xs text-[#ccff90] font-sans font-medium text-right leading-tight"
                  >
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

<style>
  .highlighted-card {
    animation: curse-highlight-pulse 2s ease-in-out infinite;
  }

  @keyframes curse-highlight-pulse {
    0%,
    100% {
      box-shadow:
        0 0 0 2px rgba(70, 240, 143, 0.7),
        0 0 20px rgba(70, 240, 143, 0.4);
    }
    50% {
      box-shadow:
        0 0 0 3px rgba(70, 240, 143, 0.9),
        0 0 32px rgba(70, 240, 143, 0.55);
    }
  }
</style>
