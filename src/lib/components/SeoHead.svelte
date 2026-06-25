<script lang="ts">
  import { serializeJsonLd } from "$lib/json-ld";
  import {
    absoluteUrl,
    FAVICON_PATH,
    SITE_NAME,
    type SeoMeta,
  } from "$lib/seo";

  let {
    title,
    description,
    canonicalPath,
    ogImage,
    noindex = false,
    jsonLd,
  }: SeoMeta = $props();

  let canonical = $derived(absoluteUrl(canonicalPath));
  let image = $derived(ogImage ?? absoluteUrl(FAVICON_PATH));
  let jsonLdSchemas = $derived(
    jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [],
  );
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
  {#each jsonLdSchemas as schema, index (index)}
    {@html `<script type="application/ld+json">${serializeJsonLd(schema)}</script>`}
  {/each}
</svelte:head>
