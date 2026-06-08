<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import godsData from "$lib/data/gods.json";
  import { resolve } from "$app/paths";

  type godsKeepsakeAndCurses = { keepsake: string; curses: string[] };

  type GodDetails = {
    title: string;
    hades_1: godsKeepsakeAndCurses | null;
    hades_2: godsKeepsakeAndCurses | null;
  };
  let gods: Record<string, GodDetails> = godsData;
  const sortedGodsArray: [string, GodDetails][] = Object.entries(gods).sort(
    (a, b) => a[0].localeCompare(b[0]),
  );
</script>

<Container>
  <div class="godsContainer grid grid-cols-1 sm:grid-cols-3">
    {#each sortedGodsArray as [god, godData] (god)}
      <div
        class="godContainer p-2 m-2 border border-white/20 rounded-xl text-textLight"
      >
        <a href={resolve(`/hades2/gods/${god}`)}>
          <div class="godandtitleContainer">
            <h1 class="godName text-textDark text-2xl">{god}</h1>
            <h2 class="godTitle">{godData.title}</h2>
          </div>
        </a>
        <div
          class="cursesContainer flex flex-col border-t mt-2 border-white/20"
        >
          <h2 class="text-textDark">Curses:</h2>
          {#each godData.hades_2?.curses as curse (curse)}
            <a href={resolve(`/hades2/curses/${curse}`)}>{curse}</a>
          {/each}
        </div>
        <div class="keepsakeContainer"></div>
      </div>
    {/each}
  </div>
</Container>
