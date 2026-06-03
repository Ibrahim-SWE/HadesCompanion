<script lang="ts">
  import airIcon from "$lib/assets/misc/air_element_icon.webp";
  import earthIcon from "$lib/assets/misc/earth_element_icon.webp";
  import waterIcon from "$lib/assets/misc/water_element_icon.webp";
  import fireIcon from "$lib/assets/misc/fire_element_icon.webp";
  import aetherIcon from "$lib/assets/misc/aether_element_icon.webp";

  type BoonData = {
    gods: string[];
    name: string;
    image_path: string;
    element: string | null;
  };

  let { boon }: { boon: BoonData } = $props();

  const boonImages = import.meta.glob("/src/lib/assets/boons/**/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  const elementIcons: Record<string, string> = {
    air: airIcon,
    earth: earthIcon,
    water: waterIcon,
    fire: fireIcon,
    aether: aetherIcon,
  };

  let godFolder = $derived(
    boon.gods.length > 1 ? "shared_boons" : boon.gods[0],
  );
  let fullImagePath = $derived(
    boon.image_path.includes("/")
      ? `/src/lib/assets/boons/${boon.image_path}`
      : `/src/lib/assets/boons/${godFolder}/${boon.image_path}`,
  );
  let imageUrl = $derived(boonImages[fullImagePath] ?? "");
  let icon = $derived(
    boon.element ? (elementIcons[boon.element.toLowerCase()] ?? null) : null,
  );
</script>

<div
  class="imagesContainer col-start-1 row-start-1 shrink-0 p-2 justify-self-center"
>
  <div class="relative inline-block w-fit">
    <img
      src={imageUrl}
      alt="{boon.name} Boon Image"
      class="w-16 h-16 sm:w-20 sm:h-20 object-cover"
    />
    {#if icon}
      <img
        class="absolute -top-1 -right-2 w-5 h-5 object-contain"
        src={icon}
        alt="{boon.element} Element Icon"
      />
    {/if}
  </div>
</div>
