# Shervin Babaei · Portfolio

[![Live site](https://img.shields.io/badge/live-shervin--babaei.me-111?style=flat-square)](https://shervin-babaei.me)
![React](https://img.shields.io/badge/React_19-111?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-111?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-111?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind_4-111?style=flat-square&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Vercel-111?style=flat-square&logo=vercel)

My projects, writeups and resume live at **[shervin-babaei.me](https://shervin-babaei.me)**. Every route is prerendered to static HTML at build time and deployed on Vercel.

## Quick start

```sh
npm install
npm run dev
```

## Commands

| Command                | What it does                                                         |
| ---------------------- | -------------------------------------------------------------------- |
| `npm run build`        | Type-check, build and prerender every page into `dist/`.             |
| `npm run preview`      | Serve the production build locally.                                  |
| `npm run test:e2e`     | Playwright end-to-end and axe accessibility tests.                   |
| `npm run test:visual`  | Local screenshot comparison across widths and themes.                |
| `npm run check:bundle` | Fail if the entry chunk is over its gzip budget (run after a build). |
| `npm run og:images`    | Regenerate share images in `public/og/`.                             |
| `npm run resume:pdf`   | Print `/resume` to a PDF (run `npm run build` first).                |

Image and screenshot scripts (`screenshots`, `images`, `record`) are in `package.json` and need `npx playwright install chromium` once.

## Where to edit

| File                   | Content                                           |
| ---------------------- | ------------------------------------------------- |
| `src/data/site.ts`     | URL, contact links, availability.                 |
| `src/data/projects.ts` | Case studies (`flagship: true` for large cards).  |
| `src/data/resume.ts`   | Resume page and PDF.                              |
| `src/data/notes.ts`    | Writeups, each served at `/writeups/<slug>`.      |
| `src/data/facts.ts`    | Numbers used in more than one place, defined once. |

After adding a project or note, run `npm run og:images`. New pages go in `src/routes.ts`, `src/seo.ts` and `staticRoutes`.

## Conventions

- **Content is data.** Anything that changes lives in `src/data/`, not in components.
- **Tailwind only.** No hand-written stylesheet; tokens are in `src/tailwind.css`. Run `npm run format` to sort classes.
- **Type scale.** Small text uses `text-label`, `text-meta` and `text-control`. A test fails on text under 12px or on fonts other than DM Sans and DM Mono.
- **Performance.** The entry chunk has a size budget. Load heavy UI on demand (see `CommandPalette.tsx`) and run `npm run analyze` before adding a dependency.
- **Before a PR**, run `npx tsc -b`, `npm run lint`, `npm run format:check`, `npm run test:e2e` and `npm run check:bundle`.

## Deploy

Import the repo into Vercel with the Vite preset, build command `npm run build` and output directory `dist`. For a custom domain, add it in Vercel, update `url` in `src/data/site.ts`, then run `npm run og:images` and `npm run build && npm run resume:pdf`.
