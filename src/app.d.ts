/// <reference types="@sveltejs/enhanced-img" />
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      seo?: import("$lib/seo").SeoMeta;
    }
    interface PageState {
      arcanaCardsReset?: boolean;
    }
    // interface Platform {}
  }
}

export {};
