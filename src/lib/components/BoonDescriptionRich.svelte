<script lang="ts">
  import LazyMiscImg from "./LazyMiscImg.svelte";
  import type { DescriptionPart } from "$lib/types/hades2";

  let {
    parts,
    imageClass = "inline-block h-[1.4em] w-auto object-contain align-middle",
    rangeClass = "font-mono text-[0.95em] font-semibold text-[#e5f4e7] tabular-nums",
  }: {
    parts: DescriptionPart[];
    imageClass?: string;
    rangeClass?: string;
  } = $props();
</script>

{#each parts as part, i (`${part.type}-${i}`)}
  {#if part.type === "text_normal"}
    <span>{part.value}</span>
  {:else if part.type === "text_bold"}
    <strong class="font-semibold text-[#e5f4e7]">{part.value}</strong>
  {:else if part.type === "range"}
    <span class={rangeClass}>{part.value}</span>
  {:else if part.type === "image"}
    <LazyMiscImg file={part.img_path} alt={part.name} class={imageClass} />
  {/if}
{/each}
