<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import LazyEnhancedImg from "$lib/components/LazyEnhancedImg.svelte";
  import LazyMiscImg from "$lib/components/LazyMiscImg.svelte";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { loadToolImage } from "$lib/assets/toolImages";
  import toolsData from "$lib/data/hades2/tools.json";

  const STORAGE_KEY = "hades2:tool-statuses";

  type ToolStatus = "locked" | "unlocked" | "upgraded";

  let toolStatuses = $state<Record<string, ToolStatus>>({});

  function toSnakeCase(str: string) {
    return str.toLowerCase().replace(/\s+/g, "_");
  }

  function toolImageFile(name: string) {
    return `${toSnakeCase(name)}.webp`;
  }

  function toggleToolStatus(toolName: string) {
    const current = toolStatuses[toolName] ?? "locked";
    toolStatuses[toolName] =
      current === "locked"
        ? "unlocked"
        : current === "unlocked"
          ? "upgraded"
          : "locked";
  }

  function handleToolKeydown(event: KeyboardEvent, toolName: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleToolStatus(toolName);
    }
  }

  onMount(() => {
    if (!browser) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          const restored: Record<string, ToolStatus> = {};
          for (const [toolName, value] of Object.entries(parsed)) {
            if (
              typeof toolName === "string" &&
              (value === "locked" || value === "unlocked" || value === "upgraded")
            ) {
              restored[toolName] = value;
            }
          }
          toolStatuses = restored;
        }
      }
    } catch {}
  });

  $effect(() => {
    if (!browser) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toolStatuses));
    } catch {}
  });

  const totalTools = toolsData.length;
  const totalProgressSteps = 8;
  const unlockedCount = $derived(
    Object.values(toolStatuses).filter(
      (status) => status === "unlocked" || status === "upgraded",
    ).length,
  );
  const upgradedCount = $derived(
    Object.values(toolStatuses).filter((status) => status === "upgraded").length,
  );
  const completedProgressSteps = $derived(
    Object.values(toolStatuses).reduce((total, status) => {
      if (status === "unlocked") return total + 1;
      if (status === "upgraded") return total + 2;
      return total;
    }, 0),
  );
  const progressPercent = $derived(
    Number(((completedProgressSteps / totalProgressSteps) * 100).toFixed(1)),
  );
  const progressFromColor = $derived(
    `hsl(140 ${50 + progressPercent * 0.4}% ${22 + progressPercent * 0.3}%)`,
  );
  const progressToColor = $derived(
    `hsl(140 ${65 + progressPercent * 0.3}% ${35 + progressPercent * 0.35}%)`,
  );
  const progressGlow = $derived(
    `0 0 ${2 + progressPercent * 0.4}px hsla(140, 90%, 55%, ${progressPercent * 0.006})`,
  );
</script>

<Container>
  <div class="max-w-300 mx-auto text-[#e5f4e7] p-2 sm:p-3 font-serif">
    <header class="flex flex-col pb-1.5 border-b border-[#58ffa5]/25 mb-2">
      <h1
        class="text-[#ccff90] font-serif text-2xl sm:text-3xl font-normal uppercase tracking-widest m-0 drop-shadow-[0_0_10px_rgba(204,255,144,0.3)]"
      >
        Gathering Tools
      </h1>
      <p
        class="text-[0.7rem] sm:text-xs text-[#8da693] font-sans mt-0.5 tracking-wide leading-snug"
      >
        Unlock and upgrade tools to gather resources from the Underworld and
        Surface.
      </p>
      <p
        class="text-[0.7rem] sm:text-xs text-[#8da693] font-sans mt-0.5 tracking-wide leading-snug"
      >
        Click on a tool to toggle its status between locked, unlocked, and
        upgraded.
      </p>
    </header>

    <div class="flex items-center gap-2.5 mb-2">
      <div class="mt-2 flex items-center gap-2.5 w-full">
        <div
          class="flex-1 h-2 rounded-full bg-[#0a140d] border border-[#1c3623] overflow-hidden"
          role="progressbar"
          aria-valuenow={completedProgressSteps}
          aria-valuemin="0"
          aria-valuemax={totalProgressSteps}
          aria-label="Tool unlock progress"
        >
          <div
            class="h-full transition-all duration-500"
            style="width: {progressPercent}%; background: linear-gradient(to right, {progressFromColor}, {progressToColor}); box-shadow: {progressGlow};"
          ></div>
        </div>
        <span
          class="text-[0.7rem] font-sans text-[#a4bea9] tabular-nums whitespace-nowrap tracking-wide"
        >
          {progressPercent}% ({unlockedCount}/{totalTools} unlocked, {upgradedCount}/{totalTools} upgraded)
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
      {#each toolsData as tool (tool.name)}
        {@const status = toolStatuses[tool.name] ?? "locked"}
        <button
          type="button"
          aria-pressed={status !== "locked"}
          onclick={() => toggleToolStatus(tool.name)}
          onkeydown={(event) => handleToolKeydown(event, tool.name)}
          class="flex flex-col gap-2.5 rounded-md border border-[#1c3623] border-l-[3px] p-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all hover:border-[#46f08f]/50 hover:shadow-[0_2px_14px_rgba(70,240,143,0.1)] group cursor-pointer text-left {status === 'unlocked'
            ? 'bg-linear-to-r from-[#0f2417] to-[#132c1a] border-[#5dff95]/70 shadow-[0_0_18px_rgba(70,240,143,0.22)]'
            : status === 'upgraded'
              ? 'bg-linear-to-r from-[#1f3426] to-[#166c2e] border-[#8fffaf] shadow-[0_0_24px_rgba(70,240,143,0.34)]'
              : 'bg-linear-to-r from-[#060b08] to-[#0d1610]'}"
          style="border-left-color: #46f08f;"
        >
          <div
            class="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-[#46f08f]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          ></div>

          <div class="flex items-start gap-3 z-10 relative">
            <div
              class="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-black rounded-lg border border-[#1a3a25] flex items-center justify-center p-2 shadow-[0_0_15px_rgba(0,0,0,0.8)]"
            >
              <LazyEnhancedImg
                load={() => loadToolImage(toolImageFile(tool.name))}
                alt={tool.name}
                class="w-full h-full object-contain drop-shadow-lg"
                placeholderClass="w-full h-full"
                sizes="64px"
              />
              <div
                class="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] pointer-events-none rounded-lg"
              ></div>
            </div>
            <div class="flex-1 min-w-0">
              <span
                class="text-[0.65rem] uppercase tracking-widest text-[#46f08f] block leading-tight mb-0.5"
                >Tool</span
              >
              <div class="mt-0.5 flex flex-wrap items-center gap-1.5">
                <h2
                  class="text-lg sm:text-xl font-serif text-[#ccff90] uppercase tracking-wide m-0 drop-shadow-sm leading-tight"
                >
                  {tool.name}
                </h2>
                {#if status === "unlocked" || status === "upgraded"}
                  <span
                    class="rounded-full border border-[#46f08f]/40 bg-[#46f08f]/15 px-1.5 py-0.5 text-[0.6rem] font-sans uppercase tracking-[0.2em] text-[#ccff90]"
                  >
                    Unlocked
                  </span>
                {/if}
                {#if status === "upgraded"}
                  <span
                    class="rounded-full border border-[#68ff9b]/40 bg-[#68ff9b]/15 px-1.5 py-0.5 text-[0.6rem] font-sans uppercase tracking-[0.2em] text-[#d9ffdc]"
                  >
                    Upgraded
                  </span>
                {/if}
              </div>
              <p
                class="text-sm text-[#b3c2b7] font-sans leading-snug mt-1"
              >
                {tool.description}
              </p>
            </div>
          </div>

          <div class="w-full h-px bg-white/5 z-10 relative"></div>

          <div
            class="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto z-10 relative"
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
                    <LazyMiscImg
                      file="{toSnakeCase(req.item)}.webp"
                      alt={req.item}
                      class="w-6 h-6 object-contain"
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
                    <LazyMiscImg
                      file="{toSnakeCase(req.item)}.webp"
                      alt={req.item}
                      class="w-6 h-6 object-contain"
                    />
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>
</Container>
