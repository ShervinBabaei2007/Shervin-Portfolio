import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function inlineCssAndPreloadFonts(): Plugin {
  return {
    name: 'inline-css-and-preload-fonts',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const htmlFile = Object.values(bundle).find((file) => file.type === 'asset' && file.fileName === 'index.html');
      if (!htmlFile || htmlFile.type !== 'asset') return;

      let html = String(htmlFile.source);

      // 1. Inline CSS so it is no longer render-blocking
      for (const [name, file] of Object.entries(bundle)) {
        if (file.type !== 'asset' || !name.endsWith('.css')) continue;
        const css = String(file.source);
        const linkTag = new RegExp(`<link[^>]*rel="stylesheet"[^>]*href="[^"]*${name.split('/').pop()}"[^>]*>`);
        if (linkTag.test(html)) {
          html = html.replace(linkTag, () => `<style>${css}</style>`);
          delete bundle[name];
        }
      }

      // 2. Preload the two fonts used above the fold
      const preloads = Object.keys(bundle)
        .filter((name) => /(dm-sans|space-grotesk)-latin-wght-normal.*\.woff2$/.test(name))
        .map((name) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/${name}">`)
        .join('\n    ');
      html = html.replace('</head>', `    ${preloads}\n  </head>`);

      htmlFile.source = html;
    },
  };
}

export default defineConfig({
  plugins: [react(), inlineCssAndPreloadFonts()],
});
