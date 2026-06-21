import tailwindcss from "@tailwindcss/vite";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

const usePolling = process.env.VITE_USE_POLLING === "true";

export default defineConfig({
  plugins: [tailwindcss(), enhancedImages(), sveltekit()],
  server: {
    watch: usePolling
      ? {
          usePolling: true,
          interval: 500,
        }
      : undefined,
  },
});
