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
      | "/hades2/keepsakes"
      | "/hades2/curses"
      | "/hades2/animals"
      | "/hades2/tools";
    label: string;
    shortLabel?: string;
  };

  const navLinks: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/hades2/gods", label: "Gods" },
    { href: "/hades2/boons", label: "Boons" },
    { href: "/hades2/weapons", label: "Weapons" },
    { href: "/hades2/cards", label: "Arcana Cards", shortLabel: "Cards" },
    { href: "/hades2/keepsakes", label: "Keepsakes" },
    { href: "/hades2/curses", label: "Curses" },
    {
      href: "/hades2/animals",
      label: "Animal Familiars",
      shortLabel: "Familiars",
    },
    { href: "/hades2/tools", label: "Gathering Tools", shortLabel: "Tools" },
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
    if (page.url.pathname) {
      mobileMenuOpen = false;
    }
    mobileMenuOpen = false;
  });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div
  class="mainContainer bg-[#07110b] min-h-dvh flex flex-col items-center font-sans"
  class:homepage={page.url.pathname === "/"}
>
  <header
    class="siteHeader sticky top-0 z-50 w-full bg-[#0a140d]/95 backdrop-blur-md border-b border-[#1c3623] shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
  >
    <div
      class="headerTop flex items-center justify-between gap-3 px-4 py-2 max-w-300 mx-auto w-full"
    >
      <a
        href={resolve("/")}
        class="brand flex items-center gap-2.5 min-w-0 shrink hover:opacity-80 transition-opacity group"
      >
        <div class="relative w-6 h-6 shrink-0">
          <div
            class="absolute inset-0 bg-[#46f08f] rounded-full blur-sm opacity-0 group-hover:opacity-40 transition-opacity"
          ></div>
          <img src={favicon} alt="" class="w-full h-full relative z-10" />
        </div>
        <span
          class="text-[#ccff90] font-serif tracking-widest uppercase text-sm md:text-base truncate max-w-37.5 sm:max-w-none shadow-black drop-shadow-md"
        >
          Hades <span class="text-[#46f08f]">Companion</span>
        </span>
      </a>

      <div class="flex items-center gap-2.5 shrink-0">
        <div
          class="hidden sm:flex items-center bg-[#050a06] border border-[#1a3a25] rounded-full p-0.5 text-[10px] cursor-not-allowed select-none shadow-inner"
          title="Hades 1 support coming soon"
        >
          <span
            class="px-2 py-0.5 rounded-full text-[#5a6e56] font-mono tracking-wider uppercase"
            >Hades 1</span
          >
          <span
            class="px-2 py-0.5 rounded-full bg-[#153320] text-[#ccff90] font-medium font-mono tracking-wider uppercase shadow-[0_0_8px_rgba(70,240,143,0.1)]"
            >Hades 2</span
          >
        </div>

        <div
          class="flex items-center bg-[#050a06] border border-[#1a3a25] rounded-full p-0.5 text-[10px] cursor-not-allowed select-none shadow-inner"
          title="Light theme coming soon"
        >
          <span
            class="px-2 py-0.5 rounded-full bg-[#153320] text-[#ccff90] font-medium font-mono tracking-wider uppercase shadow-[0_0_8px_rgba(70,240,143,0.1)]"
            >Dark</span
          >
          <span
            class="px-2 py-0.5 rounded-full text-[#5a6e56] font-mono tracking-wider uppercase"
            >Light</span
          >
        </div>

        <span
          class="sm:hidden px-2 py-0.5 rounded-full bg-[#153320] text-[#ccff90] text-[10px] font-medium font-mono tracking-wider uppercase border border-[#1a3a25]"
          title="Hades 2"
        >
          H2
        </span>

        <button
          type="button"
          class="md:hidden flex items-center justify-center w-8 h-8 rounded-md border border-[#1c3623] bg-[#0a140d] text-[#8da693] hover:bg-[#153320] hover:text-[#ccff90] hover:border-[#46f08f] transition-all"
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
              class="w-4 h-4"
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
              class="w-4 h-4"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          {/if}
        </button>
      </div>
    </div>

    <nav
      class="desktopNav hidden md:flex items-center justify-center gap-1.5 px-3 py-2 border-t border-[#1c3623] max-w-300 mx-auto w-full overflow-x-auto"
      aria-label="Main navigation"
    >
      {#each navLinks as link (link.href)}
        <a
          href={resolve(link.href)}
          class="px-3 py-1.5 rounded text-xs font-mono uppercase tracking-widest transition-all duration-200 border border-transparent {isActive(
            link.href,
          )
            ? 'bg-[#153320] text-[#ccff90] border-[#46f08f]/30 shadow-[0_0_10px_rgba(70,240,143,0.1)]'
            : 'text-[#8da693] hover:bg-[#153320]/50 hover:text-[#ccff90]'}"
          title={link.shortLabel ? link.label : undefined}
        >
          <span class="hidden xl:inline">{link.label}</span>
          <span class="xl:hidden">{link.shortLabel ?? link.label}</span>
        </a>
      {/each}
    </nav>

    {#if mobileMenuOpen}
      <nav
        class="md:hidden border-t border-[#1c3623] bg-[#0a140d]/98 px-3 py-3 backdrop-blur-lg shadow-xl"
        aria-label="Main navigation"
      >
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {#each navLinks as link (link.href)}
            <a
              href={resolve(link.href)}
              class="block px-3 py-2.5 rounded-md text-xs font-mono uppercase tracking-widest transition-all text-center border {isActive(
                link.href,
              )
                ? 'bg-[#153320] text-[#ccff90] border-[#46f08f]/30 shadow-[0_0_8px_rgba(70,240,143,0.1)]'
                : 'border-[#1c3623] text-[#8da693] hover:bg-[#153320]/50 hover:text-[#ccff90]'}"
              onclick={closeMobileMenu}
            >
              {link.label}
            </a>
          {/each}
        </div>
      </nav>
    {/if}
  </header>

  <div class="flex flex-1 w-full flex-col items-center">
    {@render children()}
  </div>

  <footer
    class="mt-auto w-full border-t border-[#1c3623] bg-[#0a140d]/80 py-6 text-center text-[0.7rem] text-[#8da693] font-sans"
  >
    <div class="max-w-300 mx-auto px-4 flex flex-col gap-2">
      <p class="m-0">
        Built by <a
          href="https://github.com/Ibrahim-SWE/HadesCompanion"
          target="_blank"
          class="text-[#46f08f] hover:text-[#ccff90] transition-colors underline decoration-[#1c3623] underline-offset-4 hover:decoration-[#46f08f]"
          >Ibrahim</a
        >
      </p>
      <p class="m-0 opacity-60">
        This is an unofficial fan project and is not affiliated with Supergiant
        Games.<br />All artworks are the copyrighted property of Supergiant
        Games.
      </p>
    </div>
  </footer>
</div>
