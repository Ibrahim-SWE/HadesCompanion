<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import { page } from "$app/state";

  let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div
  class="mainContainer bg-[#051d34] min-w-full min-h-dvh flex flex-col items-center font-normal"
  class:homepage={page.url.pathname === "/"}
>
  <nav
    class="navBar flex items-center justify-center w-full px-4 py-1 gap-1 sm:gap-2 md:gap-3 bg-[#17375a] pt-2 pb-2 border-t border-b border-[#5c6b6b]"
  >
    <div class="titleContainer flex items-center gap-2 mr-6 sm:mr-12">
      <img src={favicon} alt="logo" class="w-6 h-6" />
      <span
        class="text-textLight font-semibold text-sm sm:text-base whitespace-nowrap"
        >Hades Companion</span
      >
    </div>
    <div
      class="navItems flex flex-wrap gap-4 sm:gap-9 text-textLight text-xs sm:text-base *:rounded-md"
    >
      <a class="barItem" href="/">Home</a>
      <a class="barItem" href="/hades2/gods">Gods</a>
      <a class="barItem" href="/hades2/boons">Boons</a>
      <a class="barItem" href="/hades2/weapons">Weapons</a>
      <a class="barItem" href="/hades2/cards">Arcana Cards</a>
      <a class="barItem" href="/hades2/tools">Tools</a>
      <a class="barItem" href="/hades2/items">Items</a>
      <a class="barItem" href="/hades2/keepsakes">Keepsakes</a>
      <a class="barItem" href="/hades2/curses">Curses</a>
      <a class="barItem" href="/hades2/incantations">Incantations</a>
      <a class="barItem" href="/hades2/animals">Animal Familiars</a>
    </div>
  </nav>
  <div class="contentContainer flex-1 w-full flex-col">
    {@render children()}
  </div>
  <div class="footer mt-auto text-center mb-2 text-xs text-textLight">
    <p class="mt-1">
      Built by <a
        href="https://github.com/Ibrahim-SWE/HadesCompanion"
        class="text-textDark">Ibrahim</a
      >
    </p>
    <p>
      This is an unofficial fan project and is not affiliated with or sponsored
      by Supergiant Games. All game assets and artwork are the copyrighted
      property of Supergiant Games
    </p>
  </div>
</div>
