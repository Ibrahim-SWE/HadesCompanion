<script module lang="ts">
  let tooltipSeq = 0;
</script>

<script lang="ts">
  import { browser } from "$app/environment";
  import { portal } from "$lib/actions/portal";
  import { getBoonByName } from "$lib/boon-lookup";
  import BoonDescriptionRich from "./BoonDescriptionRich.svelte";
  import BoonImgElemIcon from "./BoonImg_ElemIcon.svelte";
  import type { BoonData } from "$lib/types/hades2";
  import type { Attachment } from "svelte/attachments";
  import type { Snippet } from "svelte";

  const tooltipId = `boon-tooltip-${++tooltipSeq}`;

  let {
    boon: boonProp,
    name,
    class: className = "",
    nested = false,
    children,
  }: {
    boon?: BoonData;
    name?: string;
    class?: string;
    /** Use inside clickable parents — stops click propagation. */
    nested?: boolean;
    children: Snippet;
  } = $props();

  let trigger: HTMLSpanElement | undefined = $state();
  let showPreview = $state(false);
  let previewTop = $state(0);
  let previewLeft = $state(0);

  let resolvedBoon = $derived(boonProp ?? (name ? getBoonByName(name) : undefined));

  let godLabel = $derived(
    resolvedBoon
      ? resolvedBoon.gods.length > 1
        ? resolvedBoon.gods.join(" · ")
        : resolvedBoon.gods[0]
      : "",
  );

  function updatePreviewPosition() {
    if (!trigger || !browser) return;

    const rect = trigger.getBoundingClientRect();
    const previewWidth = 260;
    const previewHeight = 160;
    const gap = 6;

    let top = rect.bottom + gap;
    if (top + previewHeight > window.innerHeight - 8) {
      top = rect.top - previewHeight - gap;
    }

    let left = rect.left;
    if (left + previewWidth > window.innerWidth - 8) {
      left = window.innerWidth - previewWidth - 8;
    }
    left = Math.max(8, left);

    previewTop = top;
    previewLeft = left;
  }

  function openPreview() {
    if (!resolvedBoon) return;
    updatePreviewPosition();
    showPreview = true;
  }

  function closePreview() {
    showPreview = false;
  }

  function captureTrigger(): Attachment<HTMLSpanElement> {
    return (element) => {
      trigger = element;
      return () => {
        trigger = undefined;
      };
    };
  }

  function stopParentActivation(event: Event) {
    event.stopPropagation();
  }

  const triggerClass =
    "inline select-text cursor-help font-inherit text-inherit underline decoration-dotted decoration-[#46f08f]/50 underline-offset-2 " +
    className;
</script>

{#if resolvedBoon}
  <span
    {@attach captureTrigger()}
    class={triggerClass}
    aria-describedby={showPreview ? tooltipId : undefined}
    onmouseenter={openPreview}
    onmouseleave={closePreview}
    onclick={nested ? stopParentActivation : undefined}
    onmousedown={nested ? stopParentActivation : undefined}
  >
    {@render children()}
  </span>

  {#if showPreview && browser}
    <div
      use:portal
      id={tooltipId}
      class="pointer-events-none fixed z-9999 w-[260px] rounded-md border border-[#2a2a2a] bg-[#080808] p-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
      style="top: {previewTop}px; left: {previewLeft}px;"
      role="tooltip"
    >
      <div class="flex items-start gap-2">
        <BoonImgElemIcon boon={resolvedBoon} />
        <div class="min-w-0 flex-1">
          <span
            class="mb-0.5 block truncate text-[0.6rem] uppercase tracking-widest text-[#46f08f]"
          >
            {godLabel}
          </span>
          <p
            class="m-0 font-serif text-xs uppercase tracking-wide text-[#ccff90] leading-tight"
          >
            {resolvedBoon.name}
          </p>
          <p class="mt-1 font-sans text-[0.65rem] leading-snug text-[#b3c2b7]">
            <BoonDescriptionRich
              parts={resolvedBoon.description_rich}
              imageClass="inline-block h-[1.2em] w-auto align-middle object-contain"
              rangeClass="font-mono text-[0.95em] font-semibold text-[#e5f4e7] tabular-nums"
            />
          </p>
        </div>
      </div>
    </div>
  {/if}
{:else}
  <span class={className}>{@render children()}</span>
{/if}
