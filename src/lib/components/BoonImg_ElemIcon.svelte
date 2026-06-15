<script lang="ts">
  import { miscImage } from "$lib/assets/miscImages";
  import { loadBoonImage, resolveBoonImagePath } from "$lib/assets/boonImages";
  import type { Picture } from "@sveltejs/enhanced-img";
  import type { BoonData } from "$lib/types/hades2";

  let { boon }: { boon: Pick<BoonData, "gods" | "name" | "image_path" | "element"> } = $props();

  const elementIconFiles: Record<string, string> = {
    air: "air_element_icon.webp",
    earth: "earth_element_icon.webp",
    water: "water_element_icon.webp",
    fire: "fire_element_icon.webp",
    aether: "aether_element_icon.webp",
  };

  let image = $state<Picture | null>(null);
  let shouldLoad = $state(false);
  let container: HTMLDivElement | undefined = $state();

  let godFolder = $derived(
    boon.gods.length > 1 ? "shared_boons" : boon.gods[0],
  );
  let fullImagePath = $derived(
    resolveBoonImagePath(godFolder, boon.image_path),
  );
  let icon = $derived(
    boon.element
      ? (miscImage(elementIconFiles[boon.element.toLowerCase()] ?? "") ?? null)
      : null,
  );

  $effect(() => {
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          shouldLoad = true;
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  });

  $effect(() => {
    if (!shouldLoad) return;

    const path = fullImagePath;
    let cancelled = false;

    loadBoonImage(path).then((picture) => {
      if (!cancelled) image = picture;
    });

    return () => {
      cancelled = true;
    };
  });
</script>

<div
  bind:this={container}
  class="relative shrink-0 pt-1.5 pr-1.5"
>
  <div class="relative w-14 h-14 sm:w-16 sm:h-16">
    <div
      class="absolute inset-0 bg-black rounded-lg overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.8)]"
    >
      {#if image}
        <enhanced:img
          src={image}
          alt="{boon.name} Boon Image"
          class="w-full h-full object-cover object-top"
          loading="lazy"
          decoding="async"
        />
      {:else}
        <div
          class="w-full h-full bg-[#0d1c13] animate-pulse"
          aria-hidden="true"
        ></div>
      {/if}
      <div
        class="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] pointer-events-none rounded-lg"
      ></div>
    </div>
    {#if icon}
      <enhanced:img
        class="absolute -top-1.5 -right-1.5 w-5 h-5 object-contain drop-shadow-md z-10"
        src={icon}
        alt="{boon.element} Element Icon"
      />
    {/if}
  </div>
</div>
