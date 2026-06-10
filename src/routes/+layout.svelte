<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.webp";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();

  type NavLink = {
    href:
      | "/"
      | "/hades2/gods"
      | "/hades2/boons"
      | "/hades2/weapons"
      | "/hades2/cards"
      | "/hades2/tools"
      // | "/hades2/items"
      | "/hades2/keepsakes"
      | "/hades2/curses"
      // | "/hades2/incantations"
      | "/hades2/animals";
    label: string;
    shortLabel?: string;
  };

  const navLinks: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/hades2/gods", label: "Gods" },
    { href: "/hades2/boons", label: "Boons" },
    { href: "/hades2/weapons", label: "Weapons" },
    { href: "/hades2/cards", label: "Arcana Cards", shortLabel: "Cards" },
    { href: "/hades2/tools", label: "Tools" },
    // { href: "/hades2/items", label: "Items" },
    { href: "/hades2/keepsakes", label: "Keepsakes" },
    { href: "/hades2/curses", label: "Curses" },
    // {
    //   href: "/hades2/incantations",
    //   label: "Incantations",
    //   shortLabel: "Incant.",
    // },
    {
      href: "/hades2/animals",
      label: "Animal Familiars",
      shortLabel: "Familiars",
    },
  ];

  let mobileMenuOpen = $state(false);

  function isActive(href: string): boolean {
    const path = page.url.pathname;
    if (href === "/") return path === "/";
    return path === href || path.startsWith(`${href}/`);
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  $effect(() => {
    page.url.pathname;
    mobileMenuOpen = false;
  });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div
  class="mainContainer bg-[#07110b] min-h-dvh flex flex-col items-center font-normal"
  class:homepage={page.url.pathname === "/"}
>
  <header
    class="siteHeader sticky top-0 z-50 w-full bg-[#0b160b]/95 backdrop-blur-sm border-b border-[#2a3a2a]"
  >
    <div
      class="headerTop flex items-center justify-between gap-2 px-3 py-1 max-w-7xl mx-auto w-full"
    >
      <a
        href={resolve("/")}
        class="brand flex items-center gap-1.5 min-w-0 shrink"
      >
        <img src={favicon} alt="" class="w-4 h-4 shrink-0" />
        <span
          class="text-textLight font-semibold text-xs truncate max-w-36 sm:max-w-none"
        >
          Hades Companion
        </span>
      </a>

      <div class="flex items-center gap-1.5 shrink-0">
        <div
          class="hidden sm:flex items-center bg-[#0f1f0f] border border-[#2e3e2e] rounded-full p-0.5 text-[10px] cursor-not-allowed select-none"
          title="Hades 1 support coming soon"
        >
          <span class="px-1.5 py-px rounded-full text-[#5a6e56]">Hades 1</span>
          <span
            class="px-1.5 py-px rounded-full bg-[#2a4430] text-[#c8dfc0] font-medium"
            >Hades 2</span
          >
        </div>

        <div
          class="flex items-center bg-[#0f1f0f] border border-[#2e3e2e] rounded-full p-0.5 text-[10px] cursor-not-allowed select-none"
          title="Light theme coming soon"
        >
          <span
            class="px-1.5 py-px rounded-full bg-[#2a4430] text-[#c8dfc0] font-medium"
            >Dark</span
          >
          <span class="px-1.5 py-px rounded-full text-[#5a6e56]">Light</span>
        </div>

        <span
          class="sm:hidden px-1.5 py-px rounded-full bg-[#2a4430] text-[#c8dfc0] text-[10px] font-medium border border-[#2e3e2e]"
          title="Hades 2"
        >
          H2
        </span>

        <button
          type="button"
          class="menuBtn md:hidden flex items-center justify-center w-7 h-7 rounded-md border border-[#3a4a3a] text-textLight hover:bg-[#1a2a1a] transition-colors"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onclick={toggleMobileMenu}
        >
          {#if mobileMenuOpen}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              class="w-3.5 h-3.5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              class="w-3.5 h-3.5"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          {/if}
        </button>
      </div>
    </div>

    <nav
      class="desktopNav hidden md:flex items-center justify-center gap-0.5 px-2 py-0.5 border-t border-[#1f2f1f] max-w-7xl mx-auto w-full overflow-x-auto"
      aria-label="Main navigation"
    >
      {#each navLinks as link (link.href)}
        <a
          href={resolve(link.href)}
          class="navLink"
          class:navLinkActive={isActive(link.href)}
          title={link.shortLabel ? link.label : undefined}
        >
          <span class="hidden xl:inline">{link.label}</span>
          <span class="xl:hidden">{link.shortLabel ?? link.label}</span>
        </a>
      {/each}
    </nav>

    {#if mobileMenuOpen}
      <nav
        class="mobileNav md:hidden border-t border-[#1f2f1f] bg-[#0f1a0f]/98 px-2 py-1.5"
        aria-label="Main navigation"
      >
        <div class="grid grid-cols-2 gap-0.5 sm:grid-cols-3">
          {#each navLinks as link (link.href)}
            <a
              href={resolve(link.href)}
              class="mobileNavLink"
              class:navLinkActive={isActive(link.href)}
              onclick={closeMobileMenu}
            >
              {link.label}
            </a>
          {/each}
        </div>
      </nav>
    {/if}
  </header>

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
