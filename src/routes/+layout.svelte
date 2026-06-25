<script lang="ts">
  import "./layout.css";
  import "$lib/fonts/roboto.css";
  import robotoLatin from "@fontsource-variable/roboto/files/roboto-latin-wght-normal.woff2?url";
  import SeoHead from "$lib/components/SeoHead.svelte";
  import { FAVICON_PATH } from "$lib/seo";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { CARDS_PATH } from "$lib/cards-url";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();

  let seo = $derived(page.data.seo);

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
      | "/hades2/tools"
      | "/hades2/cauldron";
    label: string;
    shortLabel?: string;
  };

  const navLinks: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/hades2/gods", label: "Gods & Characters", shortLabel: "Gods & Chars" },
    { href: "/hades2/boons", label: "Boons" },
    { href: "/hades2/cards", label: "Arcana Cards", shortLabel: "Cards" },
    { href: "/hades2/weapons", label: "Weapons" },
    { href: "/hades2/keepsakes", label: "Keepsakes" },
    { href: "/hades2/curses", label: "Curses" },
    {
      href: "/hades2/animals",
      label: "Animal Familiars",
      shortLabel: "Familiars",
    },
    { href: "/hades2/tools", label: "Gathering Tools", shortLabel: "Tools" },
    { href: "/hades2/cauldron", label: "The Cauldron", shortLabel: "Cauldron" },
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

  function handleNavClick(e: MouseEvent, href: NavLink["href"]) {
    if (href !== CARDS_PATH || !isActive(CARDS_PATH)) return;

    e.preventDefault();
    void goto(resolve(CARDS_PATH), {
      replaceState: true,
      keepFocus: true,
      state: { arcanaCardsReset: true },
    });
  }

  $effect(() => {
    page.url.pathname;
    mobileMenuOpen = false;
  });
</script>

{#if seo}
  <SeoHead {...seo} />
{/if}

<svelte:head>
  <link rel="icon" href={FAVICON_PATH} type="image/png" />
  <link
    rel="preload"
    href={robotoLatin}
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
</svelte:head>
<div
  class="mainContainer bg-[#07110b] min-h-dvh flex flex-col items-center font-sans"
  class:homepage={page.url.pathname === "/"}
>
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:border focus:border-[#46f08f]/50 focus:bg-[#153320] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-[#ccff90] focus:shadow-[0_4px_20px_rgba(0,0,0,0.6)] focus:outline-none"
  >
    Skip to content
  </a>

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
          <img
            src={FAVICON_PATH}
            alt=""
            width="24"
            height="24"
            class="w-full h-full relative z-10"
          />
        </div>
        <span
          class="text-[#ccff90] font-serif tracking-widest uppercase text-sm md:text-base truncate max-w-37.5 sm:max-w-none shadow-black drop-shadow-md"
        >
          Hades <span class="text-[#46f08f]">Companion</span>
        </span>
      </a>

      <div class="flex items-center gap-2 shrink-0">
        <!-- Future: Hades 1/2 toggle, dark/light theme toggle -->

        <button
          type="button"
          class="lg:hidden flex items-center justify-center w-8 h-8 rounded-md border border-[#1c3623] bg-[#0a140d] text-[#8da693] hover:bg-[#153320] hover:text-[#ccff90] hover:border-[#46f08f] transition-all"
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
      class="desktopNav hidden lg:flex flex-wrap xl:flex-nowrap items-center justify-center gap-x-1 gap-y-1 px-3 py-2 border-t border-[#1c3623] w-full max-w-300 mx-auto"
      aria-label="Main navigation"
    >
      {#each navLinks as link (link.href)}
        <a
          href={resolve(link.href)}
          onclick={(e) => handleNavClick(e, link.href)}
          class="shrink-0 whitespace-nowrap px-2.5 xl:px-3 py-1.5 text-[0.65rem] xl:text-xs font-mono uppercase tracking-widest transition-colors duration-200 rounded-sm {isActive(
            link.href,
          )
            ? 'text-[#ccff90] bg-[#153320]/60'
            : 'text-[#8da693] hover:text-[#ccff90] hover:bg-[#153320]/30'}"
        >
          <span class="xl:hidden">{link.shortLabel ?? link.label}</span>
          <span class="hidden xl:inline">{link.label}</span>
        </a>
      {/each}
    </nav>

    {#if mobileMenuOpen}
      <nav
        class="lg:hidden border-t border-[#1c3623] bg-[#0a140d]/98 px-3 py-3 backdrop-blur-lg shadow-xl max-w-300 mx-auto w-full"
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
              onclick={(e) => {
                handleNavClick(e, link.href);
                closeMobileMenu();
              }}
            >
              {link.shortLabel ?? link.label}
            </a>
          {/each}
        </div>
      </nav>
    {/if}
  </header>

  <main id="main-content" class="flex flex-1 w-full flex-col items-center">
    {@render children()}
  </main>

  <footer
    class="mt-auto w-full border-t border-[#1c3623] bg-[#0a140d]/80 py-6 text-center text-[0.7rem] text-[#8da693] font-sans"
  >
    <div class="max-w-300 mx-auto px-4 flex flex-col gap-2">
      <p class="m-0">
        Built by <a
          href="https://github.com/Ibrahim-SWE/HadesCompanion"
          target="_blank"
          rel="noopener noreferrer"
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
