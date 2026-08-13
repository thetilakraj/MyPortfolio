// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The repo is a GitHub Pages *project* site, so it is served from a subpath.
// The résumé circulating on LinkedIn links to
// https://thetilakraj.github.io/MyPortfolio/index.html — that URL must keep
// resolving, which is why the repo is not renamed and `base` is not '/'.
// Never hardcode root-relative paths; use the `url()` helper in src/lib/url.ts.
export default defineConfig({
  site: 'https://thetilakraj.github.io',
  base: '/MyPortfolio',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
