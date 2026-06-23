<script lang="ts">
  import LazyEnhancedImg from "$lib/components/LazyEnhancedImg.svelte";
  import LazyMiscImg from "$lib/components/LazyMiscImg.svelte";
  import { loadCardImage } from "$lib/assets/cardImages";
  import type { Snippet } from "svelte";

  let {
    card,
    cardNumber,
    imageFile,
    graspCost,
    isManual = false,
    isAwakened = false,
    isAwakening = false,
    showOverBudget = false,
    onclick,
    children,
    overlays,
  }: {
    card: string;
    cardNumber: number;
    imageFile: string;
    graspCost: string;
    isManual?: boolean;
    isAwakened?: boolean;
    isAwakening?: boolean;
    showOverBudget?: boolean;
    onclick?: () => void;
    children?: Snippet;
    overlays?: Snippet;
  } = $props();

  let textContent: HTMLDivElement | undefined = $state();

  const loadImage = () => loadCardImage(imageFile);

  const cardShellClass =
    "group flex w-full cursor-pointer flex-col gap-2 overflow-hidden rounded-md border p-1.5 text-left shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-all duration-200 sm:p-2 lg:gap-2.5 lg:p-2.5";

  const cardStateClass = $derived(
    isManual
      ? showOverBudget
        ? "border-2 border-[#ff5e7e] bg-linear-to-b from-[#3a1a22] to-[#2a1218] shadow-[0_0_0_2px_rgba(255,94,126,0.55),0_0_24px_rgba(255,94,126,0.35)] z-10"
        : "border-2 border-[#6affab] bg-linear-to-b from-[#1f6b42] to-[#164d30] shadow-[0_0_0_2px_rgba(106,255,171,0.75),0_0_32px_rgba(70,240,143,0.55)] ring-1 ring-[#6affab]/50 z-10"
      : isAwakened
        ? "border-2 border-[#e5a3ff] bg-linear-to-b from-[#3d2458] to-[#2a1a45] shadow-[0_0_0_2px_rgba(229,163,255,0.65),0_0_28px_rgba(192,113,255,0.45)] ring-1 ring-[#e5a3ff]/40 z-10"
        : isAwakening
          ? "border border-[#1c3623]/80 bg-linear-to-b from-[#0a140d] to-[#0d1c13] hover:border-[#c071ff]/40"
          : "border border-[#1c3623] bg-linear-to-b from-[#0a140d] to-[#0d1c13] hover:border-[#46f08f]/50 hover:shadow-[0_2px_14px_rgba(70,240,143,0.1)]",
  );

  function selectionWithinText(): boolean {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.toString().length === 0) {
      return false;
    }
    if (!textContent) return true;

    const { anchorNode, focusNode } = selection;
    return (
      (anchorNode !== null && textContent.contains(anchorNode)) ||
      (focusNode !== null && textContent.contains(focusNode))
    );
  }

  function handleActivate() {
    if (selectionWithinText()) return;
    onclick?.();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleActivate();
  }
</script>

<div
  id="card-{cardNumber}"
  role="button"
  tabindex="0"
  aria-label="{card}{isManual ? ' — in build' : isAwakened ? ' — awakened' : ''}"
  aria-pressed={isManual || isAwakened}
  class="{cardShellClass} {cardStateClass}"
  onclick={handleActivate}
  onkeydown={handleKeydown}
>
  <div class="relative aspect-3/4 w-full shrink-0">
    <LazyEnhancedImg
      load={loadImage}
      alt={card}
      eager
      class="pointer-events-none absolute inset-0 h-full w-full rounded-sm object-contain shadow-sm"
      sizes="(max-width: 640px) 20vw, 120px"
    />
    <div
      class="absolute top-0.5 left-0.5 z-10 flex items-center gap-0.5 rounded-sm border bg-black/85 px-0.5 py-px shadow-[0_0_10px_rgba(70,240,143,0.35)] backdrop-blur-sm sm:top-1 sm:left-1 sm:gap-1 sm:rounded-md sm:px-1 sm:py-0.5 md:py-1 md:pr-1 md:pl-1.5
        {showOverBudget
        ? 'border-[#ff5e7e]/70'
        : isAwakened
          ? 'border-[#e5a3ff]/70'
          : isManual
            ? 'border-[#6affab]/80'
            : 'border-[#46f08f]/60'}"
      title="Grasp cost"
    >
      <span
        class="font-mono text-[0.6rem] leading-none font-bold drop-shadow-[0_0_6px_rgba(204,255,144,0.5)] sm:text-xs md:text-sm {isAwakened
          ? 'text-[#f0d4ff]'
          : isManual
            ? 'text-[#e8ffd0]'
            : 'text-[#ccff90]'}"
      >
        {graspCost}
      </span>
      <LazyMiscImg
        file="grasp.webp"
        alt="Grasp"
        class="h-3 w-3 shrink-0 object-contain sm:h-4 sm:w-4 md:h-5 md:w-5"
      />
    </div>
    {#if isAwakened}
      <span
        class="absolute top-0.5 right-0.5 z-20 text-xs text-[#e5a3ff] drop-shadow-[0_0_8px_rgba(229,163,255,0.9)] sm:top-1 sm:right-1 sm:text-sm lg:top-1 lg:left-1/2 lg:right-auto lg:-translate-x-1/2"
        title="Awakened"
        aria-hidden="true">✦</span
      >
    {:else if isAwakening}
      <span
        class="absolute top-0.5 right-0.5 z-20 rounded bg-black/75 px-1 font-sans text-[0.6rem] tracking-wider text-[#8da693] uppercase sm:top-1 sm:right-1 sm:text-xs lg:top-1 lg:left-1/2 lg:right-auto lg:-translate-x-1/2"
        title="Awakening card"
        >Auto</span
      >
    {/if}

    {#if overlays}
      <div class="pointer-events-none absolute inset-0 z-10 hidden lg:block">
        {@render overlays()}
      </div>
    {/if}
  </div>

  <div
    bind:this={textContent}
    class="hidden min-h-0 flex-1 cursor-text select-text flex-col lg:flex"
  >
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>
