import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { copyFileSync } from 'node:fs'

// The site is served from a subfolder on GitHub Pages, so every asset URL has
// to carry that prefix. `npm run dev` serves from the root and must not, which
// is why this reads the mode rather than being hardcoded either way.
const BASE = '/journal/'

// GitHub Pages has no server to rewrite unknown paths, so a hard refresh on
// /journal/e/some-entry would 404 before React ever loads. Pages serves
// 404.html for anything it cannot find, so shipping a copy of index.html under
// that name hands the URL to the router instead of to a dead end.
const spaFallback = {
  name: 'spa-fallback',
  closeBundle() {
    copyFileSync('dist/index.html', 'dist/404.html')
  },
}

export default defineConfig(({ command }) => ({
  base: command === 'build' ? BASE : '/',
  plugins: [react(), spaFallback],
}))
