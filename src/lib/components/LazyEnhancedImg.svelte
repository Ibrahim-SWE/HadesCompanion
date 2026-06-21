<script lang="ts">
  import type { Picture } from "@sveltejs/enhanced-img";
  import type { HTMLImgAttributes } from "svelte/elements";

  let {
    load,
    alt = "",
    class: className = "",
    rootMargin = "200px",
    placeholderClass = "",
    eager = false,
    sizes,
    fetchPriority = "auto",
  }: {
    load: () => Promise<Picture | null>;
    alt?: string;
    class?: string;
    rootMargin?: string;
    placeholderClass?: string;
    eager?: boolean;
    sizes?: string;
    fetchPriority?: HTMLImgAttributes["fetchpriority"];
  } = $props();

  let image = $state<Picture | null>(null);
  let observed = $state(false);
  let shouldLoad = $derived(eager || observed);
  let container: HTMLElement | undefined = $state();

  let imgFetchPriority: HTMLImgAttributes["fetchpriority"] = $derived(
    fetchPriority !== "auto"
      ? fetchPriority
      : eager
        ? "high"
        : "auto",
  );

  function isInViewport(node: HTMLElement): boolean {
    const rect = node.getBoundingClientRect();
    return (
      rect.bottom >= 0 &&
      rect.top <= window.innerHeight &&
      rect.right >= 0 &&
      rect.left <= window.innerWidth
    );
  }

  $effect(() => {
    if (eager || observed || !container) return;

    if (isInViewport(container)) {
      observed = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observed = true;
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(container);
    return () => observer.disconnect();
  });

  $effect(() => {
    if (!shouldLoad) return;

    let cancelled = false;

    load()
      .then((picture) => {
        if (!cancelled) image = picture;
      })
      .catch(() => {
        if (!cancelled) image = null;
      });

    return () => {
      cancelled = true;
    };
  });
</script>

{#if image}
  <enhanced:img
    src={image}
    {alt}
    {sizes}
    class={className}
    loading={eager ? "eager" : "lazy"}
    decoding="async"
    fetchpriority={imgFetchPriority}
  />
{:else}
  <div
    bind:this={container}
    class="{placeholderClass || className} min-h-px min-w-px"
    aria-hidden="true"
  ></div>
{/if}
