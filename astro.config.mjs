// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

const SITE = process.env.PUBLIC_SITE_URL;
const BASE = process.env.PUBLIC_BASE_PATH;

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});