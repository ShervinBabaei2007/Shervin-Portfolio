# Shervin Babaei Portfolio

Personal portfolio built with React, TypeScript, Vite, and React Router. Every route is prerendered to static HTML at build time and deployed to Vercel.

## Run locally

```sh
npm install
npm run dev
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run build` | Type-checks, builds, and prerenders every page into `dist/` (plus `sitemap.xml` and `robots.txt`). |
| `npm run preview` | Serves the production build locally. |
| `npm run test:e2e` | Builds, then runs Playwright end-to-end and axe accessibility tests. |
| `npm run og:images` | Regenerates the 1200×630 PNG share images in `public/og/`. Run after changing project names, subtitles, or highlights. |
| `npm run resume:pdf` | Prints `/resume` to `public/Shervin_Babaei_Resume.pdf`. Run `npm run build` first. |
| `npm run screenshots` | Captures 2× screenshots of live projects into `public/projects/` as WebP. |

The last four scripts need Chromium once: `npx playwright install chromium`.

## Where to edit things

- `src/data/site.ts`: your URL, contact links, graduation date, and **availability** (fill in `from`, for example `'January 2027'`).
- `src/data/projects.ts`: case-study content. `flagship: true` puts a project in the large cards on the home page.
- `src/data/resume.ts`: the resume page and the PDF. Regenerate the PDF after editing.

## Deploy to Vercel

Import the repo, keep the Vite preset, build command `npm run build`, output directory `dist`. `vercel.json` enables clean URLs, so `/work/skillmatch` is served from `work/skillmatch.html`.

### Using a custom domain

1. Add the domain in Vercel (Project → Settings → Domains).
2. Change `url` in `src/data/site.ts`.
3. Run `npm run og:images` and `npm run build && npm run resume:pdf`, then commit and deploy.
