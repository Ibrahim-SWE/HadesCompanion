<script lang="ts">
  import Boon from "$lib/components/Boon.svelte";
  import Container from "$lib/components/Container.svelte";
  import boonsData from "$lib/data/hades2/boons.json";
  import godsData from "$lib/data/gods.json";
  import { resolve } from "$app/paths";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  type godsKeepsakeAndCurses = { keepsake: string; curses: string[] };

  type GodDetails = { title: string; hades_2: godsKeepsakeAndCurses | null };

  type DescriptionPart =
    | { type: "text_normal"; value: string }
    | { type: "text_bold"; value: string }
    | { type: "image"; name: string; img_path: string };

  type BoonData = {
    gods: string[];
    name: string;
    description: string;
    description_rich: DescriptionPart[];
    effect: string;
    image_path: string;
    element: string | null;
    type: string | null;
    is_core: boolean;
    rarities_effect: Record<string, string | null>;
    deals_olympian_damage: boolean;
    prerequisites: object | null;
  };

  const godName = $derived(data.godName);
  const godData = $derived((godsData as Record<string, GodDetails>)[godName]);

  const godImages = import.meta.glob("$lib/assets/gods/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  const imageUrl = $derived(godImages[`/src/lib/assets/gods/${godName}.webp`]);

  const godBoons = $derived(
    (Object.values(boonsData) as BoonData[])
      .filter((boon) => boon.gods.includes(godName))
      .sort((a, b) => a.name.localeCompare(b.name)),
  );
</script>

<Container>
  <div class="godDetailPage flex flex-col gap-4 p-2">
    <a
      href={resolve("/hades2/gods")}
      class="text-sm text-textDark hover:text-textLight transition-colors w-fit"
    >
      ← All Gods
    </a>

    <header
      class="godHeader grid grid-cols-1 md:grid-cols-[minmax(0,280px)_1fr] gap-4 items-start"
    >
      <div
        class="godPortrait relative overflow-hidden rounded-xl border border-white/20 aspect-[3/4] max-w-xs mx-auto md:mx-0 w-full shadow-xl shadow-black/50"
      >
        {#if imageUrl}
          <img
            src={imageUrl}
            alt={godName}
            class="h-full w-full object-cover object-center"
          />
        {:else}
          <div
            class="h-full w-full bg-linear-to-br from-emerald-950 to-[#1a1c18]"
          ></div>
        {/if}
      </div>

      <div class="godInfo flex flex-col gap-3 text-textLight">
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold text-[#eff7e8]">
            {godName}
          </h1>
          <p class="text-lg text-textDark mt-1">{godData.title}</p>
        </div>

        {#if godData.hades_2}
          <div
            class="detailsPanel flex flex-col gap-2 rounded-xl border border-white/20 bg-black/25 p-4"
          >
            {#if godData.hades_2.keepsake}
              <a href="../keepsakes#keepsake-{godData.hades_2.keepsake}">
                <span class="text-textDark font-medium">Keepsake:</span>
                {godData.hades_2.keepsake}
              </a>
            {/if}
            {#if godData.hades_2.curses.length > 0}
              <div>
                <span class="text-textDark font-medium">Curses:</span>
                <div class="mt-1 flex flex-wrap gap-2">
                  {#each godData.hades_2.curses as curse (curse)}
                    <span
                      class="rounded-md border border-white/20 bg-emerald-950/60 px-2 py-0.5 text-sm"
                    >
                      {curse}
                    </span>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </header>

    <section class="boonsSection flex flex-col gap-3">
      <h2
        class="text-xl font-bold text-[#eff7e8] border-b border-white/20 pb-2"
      >
        Boons
        <span class="text-sm font-normal text-textDark ml-2"
          >({godBoons.length})</span
        >
      </h2>

      {#if godBoons.length > 0}
        <div
          class="boonsGrid grid grid-cols-1 min-[450px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
        >
          {#each godBoons as boon (boon.name)}
            <Boon {boon} />
          {/each}
        </div>
      {:else}
        <p class="text-textLight/70 text-sm">No boons found for this god.</p>
      {/if}
    </section>
  </div>
</Container>
