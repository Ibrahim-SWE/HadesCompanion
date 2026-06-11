<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import petsData from "$lib/data/hades2/pets.json";

  const petImages = import.meta.glob("$lib/assets/pets/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;
</script>

<Container>
  <div class="petsContainer">
    <div class="petContainer"></div>
  </div>
</Container>
