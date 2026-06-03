<script lang="ts">
  import { resolve } from "$app/paths";
  const features = [
    {
      title: "Gods",
      route: "/hades2/gods",
      desc: "Browse every Olympian god and their offerings. See who they are and what they grant.",
    },
    {
      title: "Boons",
      route: "/hades2/boons",
      desc: "Filter boons by type, rarity, and slot to plan and optimize your build.",
    },
    {
      title: "Weapons",
      route: "/hades2/weapons",
      desc: "Explore all infernal arms and their aspects. See upgrade requirements at a glance.",
    },
    {
      title: "Arcana Cards",
      route: "/hades2/cards",
      desc: "View all Arcana Cards, their effects, and their upgrade requirements.",
    },
    {
      title: "Keepsakes",
      route: "/hades2/keepsakes",
      desc: "Find the right keepsake for every region. See their effect and who gifts them.",
    },
    {
      title: "Items & Resources",
      route: "/hades2/items",
      desc: "View items, collectibles, currencies, and upgrade materials in the game.",
    },
    {
      title: "Curses",
      route: "/hades2/curses",
      desc: "View all curses and status effects to find the perfect combination for your build.",
    },
    {
      title: "Incantations",
      route: "/hades2/incantations",
      desc: "Browse all cauldron incantations, their ingredients, and their effect.",
    },
    {
      title: "Animal Familiars",
      route: "/hades2/animals",
      desc: "Discover all animal familiars, how to befriend them, and the bonuses they provide.",
    },
    {
      title: "Gathering Tools",
      route: "/hades2/tools",
      desc: "View all gathering tools available. See their unlock and upgrade requirements.",
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
      <a
        href={resolve(f.route)}
        class="bg-white/15 border border-white/10 rounded-xl p-5 flex flex-col gap-2 last:col-span-full"
      >
        <h2 class="text-textDark font-semibold text-lg">{f.title}</h2>
        <p class="text-textLight text-sm">{f.desc}</p>
      </a>
    {/each}
  </div>
</div>
