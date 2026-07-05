// @ts-check
import { createRequire } from 'node:module';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

const require = createRequire(import.meta.url);
const { loadEnv } = require('vite');

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  site: env.PUBLIC_SITE_URL,
  base: env.PUBLIC_BASE_PATH,
  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
