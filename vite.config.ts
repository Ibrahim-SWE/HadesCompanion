import tailwindcss from '@tailwindcss/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), enhancedImages(), sveltekit()],
	server: {
		watch: {
			usePolling: true,
			interval: 500,
		},
	},
});
