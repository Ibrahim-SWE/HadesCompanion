<script lang="ts">
  import LazyEnhancedImg from "./LazyEnhancedImg.svelte";
  import { loadMiscImage } from "$lib/assets/miscImages";

  let {
    file,
    alt,
    class: className = "",
  }: {
    file: string;
    alt?: string;
    class?: string;
  } = $props();
</script>

<LazyEnhancedImg
  load={() => loadMiscImage(file)}
  alt={alt ?? file.replace(/\.webp$/, "").replace(/_/g, " ")}
  class={className}
  sizes="24px"
  rootMargin="100px"
/>
