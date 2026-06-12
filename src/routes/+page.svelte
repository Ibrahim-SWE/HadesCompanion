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
      title: "Curses",
      route: "/hades2/curses",
      desc: "View all curses and status effects to find the perfect combination for your build.",
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
  ] as const;
</script>

<div
  class="max-w-350 mx-auto text-[#e5f4e7] pt-12 pb-24 px-6 flex flex-col items-center gap-14 font-serif min-h-screen"
>
  <header class="flex flex-col items-center gap-5 text-center mt-8">
    <div
      class="inline-flex items-center justify-center px-4 py-1.5 border border-[#1c3623] rounded-full bg-[#0a140d]/80 text-[#46f08f] text-xs font-mono uppercase tracking-widest shadow-[0_0_10px_rgba(70,240,143,0.1)] mb-2"
    >
      Database & Guide
    </div>
    <h1
      class="text-4xl sm:text-5xl md:text-6xl font-normal uppercase tracking-widest text-[#ccff90] m-0 drop-shadow-[0_0_15px_rgba(204,255,144,0.3)]"
    >
      Hades <span class="text-[#46f08f]">II</span> Companion
    </h1>
    <p
      class="text-base sm:text-lg text-[#8da693] max-w-2xl font-sans tracking-wide leading-relaxed"
    >
      Everything you need to plan and optimize your runs in the Underworld and
      beyond. Discover boons, weapons, arcana cards, and more.
    </p>
  </header>

  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full max-w-7xl"
  >
    {#each features as f (f.title)}
      <a
        href={resolve(f.route)}
        class="group flex flex-col h-full bg-linear-to-b from-[#0a140d] to-[#0d1c13] border border-[#1a3a25] rounded-xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(70,240,143,0.15)] transition-all duration-300 relative overflow-hidden hover:border-[#46f08f]/50 hover:-translate-y-1"
      >
        <!-- decorative glow -->
        <div
          class="absolute -top-12 -right-12 w-32 h-32 bg-[#46f08f] rounded-full blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
        ></div>

        <!-- subtle accent line -->
        <div
          class="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-[#46f08f]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        ></div>

        <div class="flex-1 flex flex-col relative z-10">
          <h2
            class="text-[#ccff90] font-serif text-xl tracking-wider uppercase m-0 mb-3 group-hover:text-[#46f08f] transition-colors duration-300 drop-shadow-sm"
          >
            {f.title}
          </h2>
          <p
            class="text-[#a4bea9] text-[0.85rem] sm:text-sm leading-relaxed font-sans m-0"
          >
            {f.desc}
          </p>
        </div>

        <div
          class="mt-4 pt-4 border-t border-[#1c3623] flex items-center justify-between text-[#8da693] group-hover:text-[#46f08f] transition-colors duration-300 relative z-10"
        >
          <span class="text-xs font-mono uppercase tracking-widest"
            >Explore</span
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="square"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </a>
    {/each}
  </div>
</div>
