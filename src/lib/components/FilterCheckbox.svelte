<script lang="ts">
  let {
    label,
    value,
    group = $bindable<string[]>(),
  }: {
    label: string;
    value: string | null;
    group?: string[];
  } = $props();
</script>

<label
  class="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 select-none hover:bg-[#153320] transition-colors group"
>
  <input class="sr-only peer" type="checkbox" {value} bind:group />
  <div
    class="w-4 h-4 flex items-center justify-center border-2 border-[#2d5a3c] rounded-sm bg-[#0d1c13] transition-all duration-200 peer-checked:bg-[#46f08f] peer-checked:border-[#46f08f] group-hover:border-[#46f08f]/60"
  >
    <svg
      class="w-2.5 h-2.5 text-[#0a140d] scale-0 transition-transform duration-200 peer-checked:scale-100"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </div>
  <span class="text-[#b3c2b7] group-hover:text-[#e5f4e7] transition-colors"
    >{label}</span
  >
</label>
