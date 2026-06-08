<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div
  class="mainContainer bg-[#07110b] min-h-dvh flex flex-col items-center font-normal"
  class:homepage={page.url.pathname === "/"}
>
  <!-- top bar: logo/title + locked toggles -->
  <header
    class="topBar flex items-center justify-between w-full px-4 py-1 bg-[#0b160b] border-b border-[#2a3a2a]"
  >
    <div class="flex items-center gap-2">
      <img src={favicon} alt="logo" class="w-5 h-5" />
      <span class="text-textLight font-semibold text-sm whitespace-nowrap"
        >Hades Companion</span
      >
    </div>
    <div class="flex items-center gap-2">
      <!-- game version toggle (locked to Hades 2) -->
      <div
        class="flex items-center bg-[#0f1f0f] border border-[#2e3e2e] rounded-full p-0.5 text-[11px] cursor-not-allowed select-none"
        title="Hades 1 support coming soon"
      >
        <span class="px-2 py-0.5 rounded-full text-[#5a6e56]">Hades 1</span>
        <span
          class="px-2 py-0.5 rounded-full bg-[#2a4430] text-[#c8dfc0] font-medium"
          >Hades 2</span
        >
      </div>
      <!-- theme toggle (locked to Dark) -->
      <div
        class="flex items-center bg-[#0f1f0f] border border-[#2e3e2e] rounded-full p-0.5 text-[11px] cursor-not-allowed select-none"
        title="Light theme coming soon"
      >
        <span
          class="px-2 py-0.5 rounded-full bg-[#2a4430] text-[#c8dfc0] font-medium"
          >Dark</span
        >
        <span class="px-2 py-0.5 rounded-full text-[#5a6e56]">Light</span>
      </div>
    </div>
  </header>

  <!-- nav bar: page links only -->
  <nav
    class="navBar flex items-center justify-center w-full px-4 py-1.5 gap-1 sm:gap-2 md:gap-3 bg-[#162116] border-b border-[#3f4f39]"
  >
    <div
      class="navItems flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-9 text-textLight text-xs sm:text-sm *:rounded-md"
    >
      <a class="barItem" href={resolve("/")}>Home</a>
      <a class="barItem" href={resolve("/hades2/gods")}>Gods</a>
      <a class="barItem" href={resolve("/hades2/boons")}>Boons</a>
      <a class="barItem" href={resolve("/hades2/weapons")}>Weapons</a>
      <a class="barItem" href={resolve("/hades2/cards")}>Arcana Cards</a>
      <a class="barItem" href={resolve("/hades2/tools")}>Tools</a>
      <a class="barItem" href={resolve("/hades2/items")}>Items</a>
      <a class="barItem" href={resolve("/hades2/keepsakes")}>Keepsakes</a>
      <a class="barItem" href={resolve("/hades2/curses")}>Curses</a>
      <a class="barItem" href={resolve("/hades2/incantations")}>Incantations</a>
      <a class="barItem" href={resolve("/hades2/animals")}>Animal Familiars</a>
    </div>
  </nav>
  <div class="contentContainer flex flex-1 w-full flex-col items-center">
    {@render children()}
  </div>
  <div class="footer mt-auto text-center mb-2 text-xs text-textLight">
    <p class="mt-3">
      Built by <a
        href="https://github.com/Ibrahim-SWE/HadesCompanion"
        target="_blank"
        class="text-textDark">Ibrahim</a
      >
    </p>
    <p>
      This is an unofficial fan project and is not affiliated with Supergiant
      Games. All artworks are the copyrighted property of Supergiant Games
    </p>
  </div>
</div>
