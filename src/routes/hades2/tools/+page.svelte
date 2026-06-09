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
  <div class="max-w-5xl mx-auto flex flex-col gap-2 text-gray-200 p-2">
    <header class="mb-2 m-2">
      <h1 class="text-3xl font-bold text-amber-400 mb-1">Gathering Tools</h1>
      <p class="text-sm text-gray-400">
        Unlock and upgrade tools to gather resources from the Underworld and
        Surface.
      </p>
    </header>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      {#each toolsData as tool (tool.name)}
        <div
          class="bg-black/20 backdrop-blur-sm rounded-2xl p-5 border border-white/10 flex flex-col gap-3 shadow-lg hover:bg-black/30 transition-colors"
        >
          <div class="flex items-start gap-4">
            <img
              src={toolImages[
                `/src/lib/assets/tools/${toSnakeCase(tool.name)}.webp`
              ]}
              alt={tool.name}
              class="w-16 h-16 object-contain drop-shadow-md bg-black/40 rounded-xl p-2 border border-white/5 flex-none"
            />
            <div>
              <h2 class="text-xl font-bold text-white mb-1.5">{tool.name}</h2>
              <p class="text-xs text-gray-300 leading-relaxed">
                {tool.description}
              </p>
            </div>
          </div>

          <div class="w-full h-px bg-white/5"></div>

          <div class="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-auto">
            <div class="flex flex-col gap-2">
              <span
                class="text-[10px] font-bold uppercase tracking-wider text-amber-500"
              >
                Unlock Cost
              </span>
              <div class="flex flex-wrap gap-2">
                {#each tool.unlockRequirement as req, i (i)}
                  <div
                    class="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded border border-white/10 shadow-sm"
                    title={req.item}
                  >
                    <span
                      class="text-sm font-bold text-amber-400 font-mono leading-none"
                    >
                      {req.amount}
                    </span>
                    <img
                      src={miscImages[
                        `/src/lib/assets/misc/${toSnakeCase(req.item)}.webp`
                      ]}
                      alt={req.item}
                      class="w-4 h-4 object-contain"
                    />
                  </div>
                {/each}
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[10px] font-bold uppercase tracking-wider text-emerald-400"
              >
                Upgrade Cost
              </span>
              <div class="flex flex-wrap gap-2">
                {#each tool.upgradeRequirement as req, i (i)}
                  <div
                    class="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded border border-white/10 shadow-sm"
                    title={req.item}
                  >
                    <span
                      class="text-sm font-bold text-amber-400 font-mono leading-none"
                    >
                      {req.amount}
                    </span>
                    <img
                      src={miscImages[
                        `/src/lib/assets/misc/${toSnakeCase(req.item)}.webp`
                      ]}
                      alt={req.item}
                      class="w-4 h-4 object-contain"
                    />
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</Container>
