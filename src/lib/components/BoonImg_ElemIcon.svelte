<script lang="ts">
  import airIcon from "$lib/assets/misc/air_element_icon.webp";
  import earthIcon from "$lib/assets/misc/earth_element_icon.webp";
  import waterIcon from "$lib/assets/misc/water_element_icon.webp";
  import fireIcon from "$lib/assets/misc/fire_element_icon.webp";
  import aetherIcon from "$lib/assets/misc/aether_element_icon.webp";
  import { loadBoonImage, resolveBoonImagePath } from "$lib/assets/boonImages";

  type BoonData = {
    gods: string[];
    name: string;
    image_path: string;
    element: string | null;
  };

  let { boon }: { boon: BoonData } = $props();

  const elementIcons: Record<string, string> = {
    air: airIcon,
    earth: earthIcon,
    water: waterIcon,
    fire: fireIcon,
    aether: aetherIcon,
  };

  let imageUrl = $state("");
  let shouldLoad = $state(false);
  let container: HTMLDivElement | undefined = $state();

  let godFolder = $derived(
    boon.gods.length > 1 ? "shared_boons" : boon.gods[0],
  );
  let fullImagePath = $derived(
    resolveBoonImagePath(godFolder, boon.image_path),
  );
  let icon = $derived(
    boon.element ? (elementIcons[boon.element.toLowerCase()] ?? null) : null,
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

    loadBoonImage(path).then((url) => {
      if (!cancelled) imageUrl = url;
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
      {#if imageUrl}
        <img
          src={imageUrl}
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
      <img
        class="absolute -top-1.5 -right-1.5 w-5 h-5 object-contain drop-shadow-md z-10"
        src={icon}
        alt="{boon.element} Element Icon"
      />
    {/if}
  </div>
</div>
