<script>
  const features = [
    {
      title: "Gods & Boons",
      desc: "Browse every Olympian god and their boons. Filter by type, rarity, and slot to plan your build.",
    },
    {
      title: "Weapons",
      desc: "Explore all infernal arms and their aspects. See upgrade requirements at a glance.",
    },
    {
      title: "Arcana Cards",
      desc: "View all Arcana Cards, their effects, and their upgrade requirements.",
    },
    {
      title: "Keepsakes",
      desc: "Find the right keepsake for every region. See their effect and who gifts them.",
    },
    {
      title: "Items & Resources",
      desc: "View items, collectibles, currencies, and upgrade materials in the game.",
    },
    {
      title: "Curses",
      desc: "View all possible curses and status effects to find the perfect combination for your build.",
    },
  ];
</script>

<div
  class="homePage text-white pt-10 pb-16 px-6 flex flex-col items-center gap-10"
>
  <div class="flex flex-col items-center gap-3 text-center">
    <h1 class="text-6xl font-bold tracking-wide drop-shadow-lg">
      Your <span class="text-textDark">Hades</span> Companion
    </h1>
    <p class="text-xl text-textLight max-w-xl">
      Everything you need to plan and optimize your runs in Hades II
    </p>
  </div>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl"
  >
    {#each features as f (f.title)}
      <div
        class="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-2"
      >
        <h2 class="text-textDark font-semibold text-lg">{f.title}</h2>
        <p class="text-textLight text-sm">{f.desc}</p>
      </div>
    {/each}
  </div>
</div>
