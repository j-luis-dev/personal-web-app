// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

/** Update when deploying to a custom domain. Used for canonical URLs and sitemap. */
const SITE = process.env.PUBLIC_SITE_URL ?? 'https://j-luis-dev.github.io';
const BASE = process.env.PUBLIC_BASE_PATH ?? '/personal-web-app';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});