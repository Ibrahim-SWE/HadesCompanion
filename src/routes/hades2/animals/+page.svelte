<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import petsData from "$lib/data/hades2/pets.json";

  const allWebpImages = import.meta.glob("$lib/assets/**/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  function getImagePath(imageFile: string) {
    if (!imageFile) return "";
    const lowercaseFile = imageFile.toLowerCase();

    const petPath = `/src/lib/assets/pets/${imageFile}`;
    if (allWebpImages[petPath]) {
      return allWebpImages[petPath];
    }

    const foundKey = Object.keys(allWebpImages).find((key) => {
      return key.toLowerCase().endsWith(`/${lowercaseFile}`);
    });

    return foundKey ? allWebpImages[foundKey] : "";
  }

  type DescriptionRich =
    | { type: "text_normal"; value: string }
    | { type: "image"; image_file: string }
    | { type: "effect_values" };

  type BondDetails = {
    bondName: string;
    imageFile: string;
    description_rich: DescriptionRich[];
    effects: string[];
    note?: string;
  };

  type PetDetails = {
    name: string;
    bond1: BondDetails;
    bond2: BondDetails;
    bond3: BondDetails;
  };

  type PetTheme = {
    accent: string;
    accentSoft: string;
    accentDim: string;
    ink: string;
  };

  const pets = Object.entries(petsData) as [string, PetDetails][];
  let activeTab = "all";

  const petThemes: Record<string, PetTheme> = {
    Frinos: {
      accent: "#46f08f",
      accentSoft: "rgba(70, 240, 143, 0.18)",
      accentDim: "rgba(70, 240, 143, 0.08)",
      ink: "#d7ffe5",
    },
    Toula: {
      accent: "#2ee8c6",
      accentSoft: "rgba(46, 232, 198, 0.18)",
      accentDim: "rgba(46, 232, 198, 0.08)",
      ink: "#d4fff7",
    },
    Raki: {
      accent: "#b8d9c2",
      accentSoft: "rgba(184, 217, 194, 0.16)",
      accentDim: "rgba(184, 217, 194, 0.07)",
      ink: "#f0fff3",
    },
    Hecuba: {
      accent: "#b8ff6d",
      accentSoft: "rgba(184, 255, 109, 0.16)",
      accentDim: "rgba(184, 255, 109, 0.07)",
      ink: "#edffd7",
    },
    Gale: {
      accent: "#58ffc8",
      accentSoft: "rgba(88, 255, 200, 0.17)",
      accentDim: "rgba(88, 255, 200, 0.075)",
      ink: "#dcfff5",
    },
  };

  function themeStyle(theme: PetTheme) {
    return `--accent: ${theme.accent}; --accent-soft: ${theme.accentSoft}; --accent-dim: ${theme.accentDim}; --ink: ${theme.ink};`;
  }

  function petBonds(pet: PetDetails) {
    return [pet.bond1, pet.bond2, pet.bond3];
  }
</script>

<Container>
  <div class="max-w-300 mx-auto text-[#e5f4e7] p-2 sm:p-4 font-serif">
    <header
      class="flex justify-between items-center pb-3 border-b border-[#58ffa5]/25 mb-4"
    >
      <h1
        class="text-[#ccff90] font-serif text-3xl font-normal uppercase tracking-widest m-0 drop-shadow-[0_0_10px_rgba(204,255,144,0.3)]"
      >
        Animal Familiars
      </h1>
    </header>

    <nav class="flex gap-2 mb-4 flex-wrap" aria-label="Filter familiars">
      <button
        type="button"
        class="bg-[#0d1a12] border px-3.5 py-1.5 rounded text-sm uppercase tracking-wider cursor-pointer transition-all duration-200 {activeTab ===
        'all'
          ? 'border-[#46f08f] text-[#ccff90] shadow-[0_0_8px_rgba(77,252,142,0.2)] bg-[#153320]'
          : 'border-[#1a3a25] text-[#8da693] hover:bg-[#153320] hover:text-[#ccff90] hover:border-[#46f08f]'}"
        onclick={() => (activeTab = "all")}
      >
        All
      </button>
      {#each pets as [petKey, pet] (petKey)}
        {@const theme = petThemes[petKey] || petThemes.Frinos}
        <button
          type="button"
          class="bg-[#0d1a12] border px-3.5 py-1.5 rounded text-sm uppercase tracking-wider cursor-pointer transition-all duration-200 {activeTab ===
          petKey
            ? 'bg-[#153320] text-[#ccff90] shadow-[0_0_8px_var(--accent-dim)] border-(--accent)'
            : 'border-[#1a3a25] text-[#8da693] hover:bg-[#153320] hover:text-[#ccff90] hover:border-(--accent) hover:shadow-[0_0_8px_var(--accent-dim)]'}"
          style={themeStyle(theme)}
          onclick={() => (activeTab = petKey)}
        >
          {pet.name}
        </button>
      {/each}
    </nav>

    <div class="flex flex-col gap-3">
      {#each pets as [petKey, pet] (petKey)}
        {#if activeTab === "all" || activeTab === petKey}
          {@const theme = petThemes[petKey] || petThemes.Frinos}
          {@const petPortrait =
            getImagePath(`${petKey}.webp`) || getImagePath(`${pet.name}.webp`)}

          <article
            class="flex flex-col xl:flex-row gap-5 bg-linear-to-r from-[#0a140d] to-[#0d1c13] border border-[#1c3623] border-l-4 rounded-md p-4 shadow-[0_4px_10px_rgba(0,0,0,0.5)] relative overflow-hidden"
            style="border-left-color: var(--accent); {themeStyle(theme)}"
          >
            <section
              class="flex flex-row xl:flex-col items-center xl:items-center justify-start xl:justify-center min-w-50 text-left xl:text-center pr-0 xl:pr-5 border-b xl:border-b-0 xl:border-r border-[#1c3623] pb-4 xl:pb-0 gap-5 xl:gap-0"
              aria-label={`${pet.name} familiar`}
            >
              <div
                class="w-24 h-24 sm:w-28 sm:h-28 bg-black rounded-full border-2 flex items-center justify-center xl:mb-3 overflow-hidden shadow-[0_0_15px_var(--accent-dim)] shrink-0"
                style="border-color: var(--accent);"
              >
                {#if petPortrait}
                  <img
                    src={petPortrait}
                    alt={pet.name}
                    class="w-full h-full object-contain scale-110"
                  />
                {:else}
                  <span class="font-black text-2xl text-(--accent)"
                    >{pet.name.slice(0, 2)}</span
                  >
                {/if}
              </div>

              <div class="min-w-0 flex flex-col justify-center">
                <span
                  class="text-[0.7rem] uppercase tracking-widest text-(--accent) block leading-tight mb-1"
                  >Familiar</span
                >
                <h2
                  class="text-xl sm:text-2xl text-white m-0 tracking-wider leading-none"
                >
                  {pet.name}
                </h2>
              </div>
            </section>

            <section
              class="flex flex-col md:flex-row gap-4 flex-1"
              aria-label={`${pet.name} bonds`}
            >
              {#each petBonds(pet) as bond (bond.bondName)}
                {@const bondImage = getImagePath(bond.imageFile)}

                <div
                  class="flex-1 bg-black/20 border border-white/5 rounded-lg p-4 flex flex-col items-center text-center"
                >
                  <div
                    class="flex flex-col items-center mb-3 pb-3 border-b border-white/5 w-full gap-3"
                  >
                    <div
                      class="w-20 h-20 sm:w-24 sm:h-24 bg-black rounded-lg border border-[#2a4030] shrink-0 flex items-center justify-center p-2 shadow-inner"
                    >
                      {#if bondImage}
                        <img
                          src={bondImage}
                          alt={bond.bondName}
                          class="w-full h-full object-contain drop-shadow-lg"
                        />
                      {/if}
                    </div>
                    <h3
                      class="text-base sm:text-lg m-0 text-[#e5f4e7] font-medium leading-tight"
                    >
                      {bond.bondName}
                    </h3>
                  </div>

                  <p
                    class="text-[0.8rem] sm:text-sm leading-relaxed text-[#a4bea9] m-0 mb-3 flex-1 font-sans text-left w-full"
                  >
                    {#each bond.description_rich as part, index (index)}
                      {#if part.type === "text_normal"}
                        <span>{part.value}</span>
                      {:else if part.type === "effect_values"}
                        <span
                          class="inline-flex gap-1 align-middle"
                          aria-label="Bond values"
                        >
                          {#each bond.effects as effect, idx (idx)}
                            <span
                              class="bg-black px-1.5 py-0.5 rounded font-mono text-[0.75rem] {idx ===
                              1
                                ? 'text-[#5bc0eb]'
                                : idx === 2
                                  ? 'text-[#c071ff]'
                                  : idx === 3
                                    ? 'text-[#ff5e7e]'
                                    : 'text-white'}"
                            >
                              {effect}
                            </span>
                          {/each}
                        </span>
                      {:else if part.type === "image"}
                        {@const iconPath = getImagePath(part.image_file)}
                        {#if iconPath}
                          <img
                            src={iconPath}
                            alt={part.image_file
                              .replace("_icon.webp", "")
                              .replace("_", " ")}
                            class="inline-block w-4 h-4 object-contain align-middle mx-0.5"
                          />
                        {:else}
                          <span class="text-[#82917f] text-[0.68rem]">
                            {part.image_file.replace("_icon.webp", "")}
                          </span>
                        {/if}
                      {/if}
                    {/each}
                  </p>

                  {#if bond.note}
                    <p
                      class="text-[0.75rem] text-[#7b9981] italic m-0 border-l-2 pl-2.5 font-sans text-left w-full"
                      style="border-color: var(--accent);"
                    >
                      {bond.note}
                    </p>
                  {/if}
                </div>
              {/each}
            </section>
          </article>
        {/if}
      {/each}
    </div>
  </div>
</Container>
