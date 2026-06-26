<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import Container from "$lib/components/Container.svelte";
  import LazyEnhancedImg from "$lib/components/LazyEnhancedImg.svelte";
  import LazyMiscImg from "$lib/components/LazyMiscImg.svelte";
  import BoonHover from "$lib/components/BoonHover.svelte";
  import { loadKeepsakeImage } from "$lib/assets/keepsakeImages";
  import keepsakesData from "$lib/data/hades2/keepsakes.json";
  import godsData from "$lib/data/gods.json";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  const UNLOCKED_STORAGE_KEY = "hades2:unlocked-keepsakes";
  const FILTER_STORAGE_KEY = "hades2:keepsakes-filter";

  type KeepsakeFilter = "all" | "locked" | "unlocked";

  let unlockedKeepsakes = $state<string[]>([]);
  let unlockedSet = $derived(new Set(unlockedKeepsakes));
  let keepsakeFilter = $state<KeepsakeFilter>("all");
  let searchQuery = $state("");

  onMount(() => {
    try {
      const raw = localStorage.getItem(UNLOCKED_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          unlockedKeepsakes = parsed.filter((v): v is string => typeof v === "string");
        }
      }
    } catch {
    }
    try {
      const filterRaw = localStorage.getItem(FILTER_STORAGE_KEY);
      if (
        filterRaw === "all" ||
        filterRaw === "locked" ||
        filterRaw === "unlocked"
      ) {
        keepsakeFilter = filterRaw;
      }
    } catch {
    }
  });

  $effect(() => {
    if (!browser) return;
    try {
      localStorage.setItem(UNLOCKED_STORAGE_KEY, JSON.stringify(unlockedKeepsakes));
    } catch {
    }
  });

  $effect(() => {
    if (!browser) return;
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, keepsakeFilter);
    } catch {
    }
  });

  function toggleKeepsake(name: string) {
    if (unlockedSet.has(name)) {
      unlockedKeepsakes = unlockedKeepsakes.filter((n) => n !== name);
    } else {
      unlockedKeepsakes = [...unlockedKeepsakes, name];
    }
  }

  let showResetConfirm = $state(false);

  function requestReset() {
    showResetConfirm = true;
  }

  function confirmReset() {
    unlockedKeepsakes = [];
    showResetConfirm = false;
  }

  function cancelReset() {
    showResetConfirm = false;
  }

  function handleKeepsakeKeydown(event: KeyboardEvent, name: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleKeepsake(name);
    }
  }

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

  let visibleKeepsakes = $derived(
    keepsakes.filter(([, details]) => {
      if (keepsakeFilter === "locked" && unlockedSet.has(details.name)) return false;
      if (keepsakeFilter === "unlocked" && !unlockedSet.has(details.name)) return false;
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const effectText = details.description_rich
          .map((part) =>
            part.type === "text_normal" || part.type === "text_bold"
              ? part.value
              : "",
          )
          .join(" ");
        const haystack =
          `${details.name} ${details.provider} ${effectText}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    }),
  );

  let unlockedCount = $derived(unlockedKeepsakes.length);
  let totalCount = $derived(keepsakes.length);
  let progressPercent = $derived(
    totalCount === 0 ? 0 : Math.round((unlockedCount / totalCount) * 100),
  );

  let progressFromColor = $derived(
    `hsl(140 ${50 + progressPercent * 0.4}% ${22 + progressPercent * 0.3}%)`,
  );
  let progressToColor = $derived(
    `hsl(140 ${65 + progressPercent * 0.3}% ${35 + progressPercent * 0.35}%)`,
  );
  let progressGlow = $derived(
    `0 0 ${2 + progressPercent * 0.4}px hsla(140, 90%, 55%, ${progressPercent * 0.006})`,
  );

  const effectValueColors = [
    "text-white",
    "text-[#5bc0eb]",
    "text-[#c071ff]",
    "text-[#ff5e7e]",
  ];

  function isGodProvider(provider: string): boolean {
    return gods.includes(provider);
  }

  const filterButtons: { id: KeepsakeFilter; label: string }[] = [
    { id: "all", label: "Show All" },
    { id: "locked", label: "Show Locked" },
    { id: "unlocked", label: "Show Unlocked" },
  ];
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
      <LazyMiscImg
        file={part.image_file}
        alt={part.image_file.replace("_icon.webp", "").replace(/_/g, " ")}
        class="inline-block h-[1.65em] w-auto object-contain align-middle mx-0.5"
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
        Incantation halves these requirements. Heroic rank requires the
        <BoonHover name="Cherished Heirloom">Cherished Heirloom</BoonHover> duo
        boon from Demeter and Hera.
      </p>
      <p class="text-[0.7rem] sm:text-xs text-[#a4bea9] font-sans mt-0.5 tracking-wide leading-snug">
        Click a keepsake if you already unlocked it.
      </p>
      <div class="flex flex-wrap gap-1.5 mt-2 justify-center" role="group" aria-label="Keepsake filters">
        {#each filterButtons as filter, i (filter.id)}
          <button
            type="button"
            onclick={() => (keepsakeFilter = filter.id)}
            aria-pressed={keepsakeFilter === filter.id ? "true" : "false"}
            class="px-2.5 py-1 rounded border text-[0.7rem] uppercase tracking-widest font-sans transition-all {keepsakeFilter ===
            filter.id
              ? 'border-[#46f08f] bg-[#46f08f]/15 text-[#ccff90] shadow-[0_0_10px_rgba(70,240,143,0.25)]'
              : 'border-[#1c3623] bg-[#0a140d] text-[#8da693] hover:border-[#46f08f]/50 hover:text-[#ccff90]'}"
          >
            {filter.label}
          </button>
          {#if i === 0}
            <input
              type="search"
              value={searchQuery}
              oninput={(e) => (searchQuery = e.currentTarget.value)}
              placeholder="Search keepsakes…"
              aria-label="Search keepsakes by name or provider"
              class="px-2.5 py-1 rounded border border-[#1c3623] bg-[#0a140d] text-[0.7rem] font-sans text-[#e5f4e7] placeholder:text-[#5f7a66] focus:outline-none focus:border-[#46f08f] focus:shadow-[0_0_10px_rgba(70,240,143,0.25)] transition-all w-40 sm:w-52"
            />
          {/if}
        {/each}
        <button
          type="button"
          onclick={requestReset}
          class="px-2.5 py-1 rounded border border-[#ff5e7e]/40 text-[0.7rem] uppercase tracking-widest font-sans bg-[#2a0d12] text-[#ff8aa0] transition-all hover:border-[#ff5e7e] hover:text-[#ffadb8] hover:shadow-[0_0_10px_rgba(255,94,126,0.25)]"
        >
          Reset Progress
        </button>
      </div>
      <div class="mt-2 flex items-center gap-2.5">
        <div
          class="flex-1 h-2 rounded-full bg-[#0a140d] border border-[#1c3623] overflow-hidden"
          role="progressbar"
          aria-valuenow={unlockedCount}
          aria-valuemin="0"
          aria-valuemax={totalCount}
          aria-label="Keepsake unlock progress"
        >
          <div
            class="h-full transition-all duration-500"
            style="width: {progressPercent}%; background: linear-gradient(to right, {progressFromColor}, {progressToColor}); box-shadow: {progressGlow};"
          ></div>
        </div>
        <span class="text-[0.7rem] font-sans text-[#a4bea9] tabular-nums whitespace-nowrap tracking-wide">
          {unlockedCount} / {totalCount} unlocked ({progressPercent}%)
        </span>
      </div>
    </header>

    {#if visibleKeepsakes.length === 0}
      <p class="text-center text-[#8da693] font-sans text-sm py-8 tracking-wide">
        {#if searchQuery.trim()}
          No keepsakes match "{searchQuery.trim()}".
        {:else if keepsakeFilter === "unlocked"}
          No unlocked keepsakes yet. Click a keepsake above to mark it as unlocked.
        {:else if keepsakeFilter === "locked"}
          Every keepsake is unlocked. Nice work.
        {:else}
          No keepsakes to show.
        {/if}
      </p>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
        {#each visibleKeepsakes as [, details] (details.name)}
          {@const highlighted = details.name === activeKeepsake}
          {@const isUnlocked = unlockedSet.has(details.name)}

          <div
            id="keepsake-{details.name}"
            aria-current={highlighted ? "true" : undefined}
            role="button"
            tabindex="0"
            aria-pressed={isUnlocked ? "true" : "false"}
            aria-label="{details.name} keepsake — {isUnlocked ? 'unlocked, click to mark as locked' : 'locked, click to mark as unlocked'}"
            onclick={() => toggleKeepsake(details.name)}
            onkeydown={(e) => handleKeepsakeKeydown(e, details.name)}
            class="flex flex-col items-center bg-linear-to-r border border-[#1c3623] border-l-[3px] rounded-md p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all hover:border-[#46f08f]/50 hover:shadow-[0_2px_14px_rgba(70,240,143,0.1)] group cursor-pointer {isUnlocked
              ? 'from-[#163020] to-[#1a3a25] brightness-125 shadow-[0_2px_10px_rgba(0,0,0,0.5),0_0_18px_rgba(70,240,143,0.35)]'
              : 'from-[#0c100d] to-[#0f140f] opacity-85 saturate-75'} {highlighted
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
            <LazyEnhancedImg
              load={() => loadKeepsakeImage(details.image_file)}
              alt={details.name}
              class="w-full h-full object-contain drop-shadow-lg"
              placeholderClass="w-full h-full"
              sizes="56px"
            />
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
                  onclick={(e) => e.stopPropagation()}
                  onkeydown={(e) => e.stopPropagation()}
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
        </div>
        {/each}
      </div>
    {/if}
  </div>
</Container>

<svelte:window
  onkeydown={(e) => {
    if (showResetConfirm && e.key === "Escape") cancelReset();
  }}
/>

{#if showResetConfirm}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-[fade-in_0.15s_ease-out]"
    role="presentation"
    onclick={cancelReset}
    onkeydown={(e) => {
      if (e.key === "Escape") cancelReset();
    }}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-confirm-title"
      aria-describedby="reset-confirm-body"
      tabindex="-1"
      class="bg-linear-to-b from-[#0a140d] to-[#0d1c13] border border-[#ff5e7e]/40 rounded-lg p-4 sm:p-5 max-w-sm w-full shadow-[0_0_30px_rgba(255,94,126,0.25),0_8px_30px_rgba(0,0,0,0.6)] animate-[pop-in_0.18s_ease-out] focus:outline-none"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => {
        if (e.key === "Escape") cancelReset();
      }}
    >
      <div class="flex items-start gap-3 mb-3">
        <div
          class="w-9 h-9 shrink-0 rounded-full border border-[#ff5e7e]/50 bg-[#2a0d12] flex items-center justify-center text-[#ff8aa0] text-lg font-serif"
          aria-hidden="true"
        >
          !
        </div>
        <div class="min-w-0">
          <h2
            id="reset-confirm-title"
            class="text-[#ffadb8] font-serif text-base sm:text-lg uppercase tracking-widest m-0 leading-tight"
          >
            Are you sure?
          </h2>
          <p
            id="reset-confirm-body"
            class="text-[#a4bea9] font-sans text-xs sm:text-sm leading-snug m-0 mt-1"
          >
            This will clear all unlocked keepsakes. This cannot be undone.
          </p>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onclick={cancelReset}
          class="px-3 py-1.5 rounded border border-[#1c3623] text-[0.7rem] uppercase tracking-widest font-sans bg-[#0a140d] text-[#8da693] cursor-pointer transition-all hover:border-[#46f08f]/50 hover:text-[#ccff90]"
        >
          Cancel
        </button>
        <button
          type="button"
          onclick={confirmReset}
          class="px-3 py-1.5 rounded border border-[#ff5e7e] text-[0.7rem] uppercase tracking-widest font-sans bg-[#2a0d12] text-[#ffadb8] cursor-pointer transition-all hover:bg-[#3a1018] hover:shadow-[0_0_12px_rgba(255,94,126,0.4)]"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes pop-in {
    from {
      opacity: 0;
      transform: scale(0.94);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
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
