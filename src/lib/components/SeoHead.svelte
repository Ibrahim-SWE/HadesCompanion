<script lang="ts">
  import { faviconImg } from "$lib/assets/faviconImage";
  import { absoluteUrl, SITE_NAME, type SeoMeta } from "$lib/seo";

  let {
    title,
    description,
    canonicalPath,
    ogImage,
    noindex = false,
  }: SeoMeta = $props();

  let canonical = $derived(absoluteUrl(canonicalPath));
  let image = $derived(ogImage ?? absoluteUrl(faviconImg.img.src));
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  {#if noindex}
    <meta name="robots" content="noindex" />
  {/if}
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={image} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
</svelte:head>
