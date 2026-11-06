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
| `npm run test:e2e` | Builds, then runs Playwright end-to-end and axe accessibility tests (what CI runs). |
| `npm run test:visual` | Local screenshot comparison of every page at three widths in both themes, plus the resume's print layout. See "Checking a refactor" below. |
| `npm run analyze` | Builds into `dist-analyze/` and writes a bundle treemap to `dist-analyze/stats.html`. |
| `npm run check:bundle` | Fails if the shared entry chunk is over its gzip budget (run after `npm run build`; CI runs it). |
| `npm run format` | Prettier, including automatic Tailwind class sorting. |
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

## Architecture and conventions

**Content lives in `src/data/`, not in components.** Anything that changes over time (projects, notes, resume, availability) is data. A number that appears in more than one place (commit counts, GPA, hackathon result) lives once in `src/data/facts.ts` and is imported. Check such numbers against the source (for example the GitHub API) before changing them.

**One styling system: Tailwind.** There is no hand-written stylesheet.

- Style components with utility classes. Colour tokens (`--background`, `--primary`, ...) and the site tokens (`--header-height`, `--gutter`, `--content-max`, `--mono`, ...) are in `src/tailwind.css`; use the Tailwind names (`bg-card`, `text-muted-foreground`, `font-mono`) rather than raw colours.
- Reuse by extracting a component or a `cva` variant, or a shared class string (see `src/components/shared/blockStyles.ts`), not by writing new CSS. Plain CSS belongs in `src/tailwind.css` only for things utilities cannot express: keyframes, `@page`, `prefers-reduced-motion` and similar media queries.
- Prose is capped at `max-w-[60ch]` (about 740px at 18px). DM Sans digits are wide, so `ch` runs long: 70ch came out at 862px, over 100 characters a line.
- `prettier-plugin-tailwindcss` sorts classes on `npm run format`; do not sort by hand.
- **Type scale.** Body copy and headings use normal Tailwind sizes (16-18px and up). Small text uses three tokens defined in `src/tailwind.css` that grow by 1px on phones: `text-label` (mono labels, chips, dates; 12px, 13px on phones), `text-meta` (secondary sans text; 13px, 14px) and `text-control` (button labels and tappable links; 14px, 15px). Do not write raw sizes below 12px; a test fails if any visible text is under 12px on desktop or 13px on phones, or renders in a font other than DM Sans or DM Mono. DM Mono only ships weight 400, so do not put `font-medium` or `font-semibold` on mono text.
- Gotchas that cost time before: `text-xs` / `text-sm` add a line-height (use `text-[.75rem]` if you do not want one); `cn()` (tailwind-merge) drops an earlier `leading-*` when a `text-*` size comes after it, so put `leading-*` last or build the string without `cn`; shadcn's `rounded-xl` is 14px, not 12px.
- Tests find elements by role, text or a `data-*` hook (`data-project-card`, `data-limiter-demo`, ...), never by styling classes.

**Pages.** Each route is its own lazy chunk (`src/routes.ts`) and is prerendered by `scripts/prerender.mjs`. To add a page: add it to `src/routes.ts`, give it metadata in `src/seo.ts` (`getPageMeta`) and add its path to `staticRoutes`. To add a project or note, add an entry to `src/data/projects.ts` or `src/data/notes.ts`, then run `npm run og:images`.

**Performance.** The entry chunk has a budget (`scripts/check-bundle-size.mjs`). Heavy, rarely used UI (the command palette, the phone menu, the toast container, the quick-look sheet) loads on demand; follow `CommandPalette.tsx` for the pattern. Anything that loads on demand should also show that it is loading: use `PendingFlag` as the Suspense fallback to put a spinner on the button that opened it (see `ProjectCard.tsx`), and start the load on hover, focus or touch. Page changes get the top progress bar from `NavigationProgress.tsx` automatically. Run `npm run analyze` before adding a dependency.

### Checking a refactor

Screenshot baselines are not committed (they are about 9 MB and differ per OS). Before changing styles or layout:

1. `npm run test:visual -- --update-snapshots` to record the current look.
2. Make the change.
3. `npm run test:visual`; a failure writes expected/actual/diff images under `test-results/`. Update the baselines only for differences you meant to make.

Before opening a pull request, run what CI runs: `npx tsc -b`, `npm run lint`, `npm run format:check`, `npm run test:e2e`, then `npm run check:bundle`.

## Deploy to Vercel

Import the repo, keep the Vite preset, build command `npm run build`, output directory `dist`. `vercel.json` enables clean URLs, so `/work/skillmatch` is served from `work/skillmatch.html`.

### Using a custom domain

1. Add the domain in Vercel (Project → Settings → Domains).
2. Change `url` in `src/data/site.ts`.
3. Run `npm run og:images` and `npm run build && npm run resume:pdf`, then commit and deploy.
