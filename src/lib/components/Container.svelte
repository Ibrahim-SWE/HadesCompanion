<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<section
  class="max-w-300 mx-auto w-full items-center flex flex-col bg-[#343f34] p-1 border border-[#4c5a44] mt-2"
>
  {@render children()}
</section>
