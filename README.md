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
| `npm run screenshots` | Captures 2× screenshots of live projects into `public/projects/` as WebP, then runs `npm run images`. |
| `npm run images` | Makes 480px copies of large screenshots and records every image's size in `src/data/images.json`. Run after adding any screenshot. |
| `npm run record -- skillmatch` | Records a short silent screen capture of a live project (`.webm`, plus `.mp4` if ffmpeg is installed). Edit the steps in `scripts/record-demo.mjs`. |

The last four scripts need Chromium once: `npx playwright install chromium`.

## Where to edit things

- `src/data/site.ts`: your URL, contact links, graduation date, and **availability** (fill in `from`, for example `'January 2027'`).
- `src/data/projects.ts`: case-study content. `flagship: true` puts a project in the large cards on the home page.
- `src/data/resume.ts`: the resume page and the PDF. Regenerate the PDF after editing.
- `src/data/notes.ts`: engineering notes. Each note becomes a page at `/notes/<slug>`; run `npm run og:images` after adding one.
- `src/data/github.json`: written by the build from the GitHub API. Add a `GITHUB_TOKEN` environment variable in Vercel (a token with no scopes is enough) so builds are not rate-limited.

## Deploy to Vercel

Import the repo, keep the Vite preset, build command `npm run build`, output directory `dist`. `vercel.json` enables clean URLs, so `/work/skillmatch` is served from `work/skillmatch.html`.

### Using a custom domain

1. Add the domain in Vercel (Project → Settings → Domains).
2. Change `url` in `src/data/site.ts`.
3. Run `npm run og:images` and `npm run build && npm run resume:pdf`, then commit and deploy.
