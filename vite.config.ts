import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

/**
 * Preloads the three font files used above the fold so text renders in the
 * right face on first paint. CSS is no longer inlined: one hashed stylesheet
 * is cached by the browser and reused on every page of the site.
 */
function preloadFonts(): Plugin {
  return {
    name: 'preload-above-the-fold-fonts',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const htmlFile = Object.values(bundle).find((file) => file.type === 'asset' && file.fileName === 'index.html')
      if (!htmlFile || htmlFile.type !== 'asset') return
      const preloads = Object.keys(bundle)
        .filter((name) => /(dm-sans-latin-wght|space-grotesk-latin-wght|dm-mono-latin-400)-normal.*\.woff2$/.test(name))
        .map((name) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/${name}">`)
        .join('\n    ')
      htmlFile.source = String(htmlFile.source).replace('</head>', `    ${preloads}\n  </head>`)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFonts()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    // The manifest maps each page's source file to its chunk, for modulepreload links.
    manifest: true,
  },
})
