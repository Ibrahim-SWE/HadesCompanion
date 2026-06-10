<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import cursesData from "$lib/data/hades2/curses.json";

  type curseDetails = {
    name: string;
    effect: string;
    duration: string;
    source: string;
  };

  //   const curses = Object.entries(cursesData) as [string, curseDetails][];
  const curses: Record<string, curseDetails> = cursesData;
</script>

<Container>
  <div
    class="cursesContainer grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 text-textLight"
  >
    {#each Object.entries(curses) as [curse, details] (curse)}
      <div
        class="curseContainer text-sm m-2 p-3 border rounded-xl border-white/20"
      >
        <h1 class="text-textDark text-2xl">{curse}</h1>
        <p class="">{details.effect}</p>
        <p>{details.duration}</p>
      </div>
    {/each}
  </div>
</Container>
