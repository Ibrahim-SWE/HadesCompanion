<script lang="ts">
  import SeoHead from "$lib/components/SeoHead.svelte";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { PAGE_SEO } from "$lib/seo";

  let isNotFound = $derived(page.status === 404);
  let seo = $derived(isNotFound ? PAGE_SEO.notFound : PAGE_SEO.error);
</script>

<SeoHead {...seo} />

<section
  class="flex flex-1 w-full items-center justify-center px-6 py-16 text-center"
>
  {#if isNotFound}
    <div class="flex flex-col items-center gap-5 max-w-2xl">
      <h1
        class="text-4xl sm:text-5xl md:text-7xl font-serif font-normal uppercase tracking-[0.2em] text-[#ccff90] m-0 leading-tight drop-shadow-[0_0_30px_rgba(204,255,144,0.25)]"
      >
        Lost in the <span class="text-[#46f08f]">Underworld</span>
      </h1>
      <p
        class="text-base sm:text-lg text-[#8da693] font-sans m-0 leading-relaxed"
      >
        404 - Page not found
      </p>
      <a
        href={resolve("/")}
        class="mt-2 text-sm font-mono uppercase tracking-[0.25em] text-[#46f08f] hover:text-[#ccff90] transition-colors underline decoration-[#1c3623] underline-offset-8 hover:decoration-[#46f08f]"
      >
        Return home
      </a>
    </div>
  {:else}
    <div class="flex flex-col items-center gap-4 max-w-xl">
      <h1
        class="text-3xl sm:text-4xl font-serif uppercase tracking-widest text-[#ccff90] m-0"
      >
        Something went wrong
      </h1>
      <p class="text-[#8da693] font-sans m-0">
        {page.error?.message ?? "An unexpected error occurred."}
      </p>
      <a
        href={resolve("/")}
        class="mt-2 text-sm font-mono uppercase tracking-[0.25em] text-[#46f08f] hover:text-[#ccff90] transition-colors"
      >
        Return home
      </a>
    </div>
  {/if}
</section>
