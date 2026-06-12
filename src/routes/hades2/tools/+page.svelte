<script lang="ts">
  import Container from "$lib/components/Container.svelte";

  const toolImages = import.meta.glob("/src/lib/assets/tools/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  const miscImages = import.meta.glob("/src/lib/assets/misc/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  const toolsData = [
    {
      name: "Crescent Pick",
      unlockRequirement: [{ item: "Ashes", amount: 1 }],
      upgradeRequirement: [
        { item: "Glassrock", amount: 4 },
        { item: "Iron", amount: 4 },
      ],
      description:
        "Mines ore from rocks to help unlock and upgrade your weapons.",
    },
    {
      name: "Tablet of Peace",
      unlockRequirement: [{ item: "Silver", amount: 4 }],
      upgradeRequirement: [
        { item: "Psyche", amount: 30 },
        { item: "Marble", amount: 3 },
      ],
      description:
        "Collects Psyche from lingering Shades to increase your Arcana Card capacity.",
    },
    {
      name: "Silver Spade",
      unlockRequirement: [{ item: "Silver", amount: 8 }],
      upgradeRequirement: [
        { item: "Olive", amount: 4 },
        { item: "Bronze", amount: 2 },
      ],
      description:
        "Digs up seeds that you can plant at The Crossroads to use in Incantations.",
    },
    {
      name: "Rod of Fishing",
      unlockRequirement: [
        { item: "Fate Fabric", amount: 2 },
        { item: "Bronze", amount: 1 },
      ],
      upgradeRequirement: [
        { item: "Driftwood", amount: 4 },
        { item: "Serpent Scales", amount: 2 },
      ],
      description:
        "Catches fish from water pools so you can trade them to the Broker.",
    },
  ];

  function toSnakeCase(str: string) {
    return str.toLowerCase().replace(/\s+/g, "_");
  }
</script>

<Container>
  <div class="max-w-300 mx-auto text-[#e5f4e7] p-2 sm:p-4 font-serif">
    <header class="flex flex-col pb-2 border-b border-[#58ffa5]/25 mb-4">
      <h1
        class="text-[#ccff90] font-serif text-2xl sm:text-3xl font-normal uppercase tracking-widest m-0 drop-shadow-[0_0_10px_rgba(204,255,144,0.3)]"
      >
        Gathering Tools
      </h1>
      <p class="text-xs sm:text-sm text-[#8da693] font-sans mt-1 tracking-wide">
        Unlock and upgrade tools to gather resources from the Underworld and
        Surface.
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      {#each toolsData as tool (tool.name)}
        <article
          class="flex flex-col gap-3 bg-linear-to-r from-[#0a140d] to-[#0d1c13] border border-[#1c3623] border-l-4 rounded-xl p-3 shadow-[0_4px_15px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all hover:border-[#46f08f]/50 hover:shadow-[0_4px_20px_rgba(70,240,143,0.1)] group"
          style="border-left-color: #46f08f;"
        >
          <!-- decorative accent line -->
          <div
            class="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-[#46f08f]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          ></div>

          <div class="flex items-start gap-3 z-10 relative">
            <div
              class="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-black rounded-lg border border-[#1a3a25] flex items-center justify-center p-2 shadow-[0_0_15px_rgba(0,0,0,0.8)]"
            >
              <img
                src={toolImages[
                  `/src/lib/assets/tools/${toSnakeCase(tool.name)}.webp`
                ]}
                alt={tool.name}
                class="w-full h-full object-contain drop-shadow-lg"
                loading="lazy"
                decoding="async"
              />
              <!-- inner shadow overlay -->
              <div
                class="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] pointer-events-none rounded-lg"
              ></div>
            </div>
            <div class="flex-1 min-w-0">
              <span
                class="text-[0.6rem] uppercase tracking-widest text-[#46f08f] block leading-tight mb-0.5"
                >Tool</span
              >
              <h2
                class="text-lg sm:text-xl font-serif text-[#ccff90] uppercase tracking-wider m-0 drop-shadow-sm"
              >
                {tool.name}
              </h2>
              <p
                class="text-[0.75rem] sm:text-xs text-[#8da693] font-sans leading-snug mt-1"
              >
                {tool.description}
              </p>
            </div>
          </div>

          <div class="w-full h-px bg-white/5 z-10 relative"></div>

          <div
            class="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-auto z-10 relative"
          >
            <div class="flex-1">
              <span
                class="text-[#8da693] uppercase text-[0.6rem] tracking-wider block mb-1 font-sans"
              >
                Unlock Cost
              </span>
              <div class="flex flex-wrap gap-2">
                {#each tool.unlockRequirement as req, i (i)}
                  <div
                    class="flex items-center gap-2 bg-[#1a3a25] px-3 py-1.5 rounded-md border border-[#2d5a3c]"
                    title={req.item}
                  >
                    <span
                      class="text-sm font-bold text-[#ccff90] font-mono leading-none"
                    >
                      {req.amount}
                    </span>
                    <img
                      src={miscImages[
                        `/src/lib/assets/misc/${toSnakeCase(req.item)}.webp`
                      ]}
                      alt={req.item}
                      class="w-6 h-6 object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                {/each}
              </div>
            </div>

            <div
              class="flex-1 border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-3"
            >
              <span
                class="text-[#8da693] uppercase text-[0.6rem] tracking-wider block mb-1 font-sans"
              >
                Upgrade Cost
              </span>
              <div class="flex flex-wrap gap-2">
                {#each tool.upgradeRequirement as req, i (i)}
                  <div
                    class="flex items-center gap-2 bg-[#1a3a25] px-3 py-1.5 rounded-md border border-[#2d5a3c]"
                    title={req.item}
                  >
                    <span
                      class="text-sm font-bold text-[#ccff90] font-mono leading-none"
                    >
                      {req.amount}
                    </span>
                    <img
                      src={miscImages[
                        `/src/lib/assets/misc/${toSnakeCase(req.item)}.webp`
                      ]}
                      alt={req.item}
                      class="w-6 h-6 object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>
</Container>
