<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div
  class="mainContainer bg-[#091202] min-w-full min-h-dvh flex flex-col items-center"
>
  <div
    class="navBar gap-9 flex bg-[#122106] min-w-full justify-center p-2 border-t border-b border-[#538067]"
  >
    <div class="titleContainer flex flex-col justify-center">
      <div class="logo"></div>
      <div class="siteTitle">Hades Companion</div>
    </div>
    <div class="barItem home">Home</div>
    <div class="barItem gods">Gods</div>
    <div class="barItem boons">Boons</div>
    <div class="barItem cards">Arcana Cards</div>
    <div class="barItem weapons">Weapons</div>
    <div class="barItem keepsakes">Keepsakes</div>
  </div>
  <div class="contentContainer">{@render children()}</div>
  <div class="footer"></div>
</div>
