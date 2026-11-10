# CLAUDE.md

Personal portfolio for Shervin Babaei (https://shervin-babaei.me). A Vite + React 19 + TypeScript app that is prerendered to static HTML at build time and hydrated in the browser. Hosted on Vercel. There is no database: content lives in typed TS modules and generated JSON snapshots.

Stack: React Router 6, Tailwind CSS 4, shadcn/ui (new-york, zinc) + Radix, Motion, Cobe, cmdk, Sonner. Playwright + axe for tests, ESLint (jsx-a11y, react-hooks), Prettier (no semicolons, single quotes, width 120, Tailwind class sorting). Dev machine is Windows.

## Commands

- `npm run dev`: Vite dev server (client-rendered only; no prerender, no monitoring).
- `npm run build`: github-snapshot -> repos-snapshot -> `tsc -b` -> client build -> SSR build -> `scripts/prerender.mjs`. The snapshot steps call the GitHub API and keep the previous JSON if it fails.
- `npm run test:e2e` / `npm run test:visual`: Playwright, split by the `@visual` tag. Tests rebuild the site and serve `dist` with `vite preview` on port 4174, so they exercise the prerendered output. Visual snapshots are gitignored.
- `npm run lint`, `npm run format` / `format:check`.
- `npm run check:bundle`: fails if the entry chunk exceeds 250 KB gzip (run after build). `npm run analyze` shows a treemap.
- Asset scripts (rarely needed): `og:images`, `resume:pdf`, `favicons`, `screenshots`, `images`, `repos`, `rank`, `record`.

## Architecture

- `src/routes.ts` is the single route table. Each page is a lazy chunk with `path`, `source` (used for modulepreload) and `Component`; `pageForPath()` is shared by the client, SSR and the prerenderer. Routes: `/`, `/work/:slug`, `/projects`, `/writeups`, `/writeups/:slug`, `/lab`, `/resume`, `/how-its-built`, `*`.
- `src/main.tsx` preloads the current route's chunk, then hydrates; other pages and monitoring load when idle. `src/App.tsx` is the shell (header, footer, error boundary, Suspense, page transition, lazy toaster).
- Prerender pipeline: `src/entry-server.tsx` renders HTML and `<head>` tags from `src/seo.ts` (`getPageMeta`, `staticRoutes`); `scripts/prerender.mjs` writes `dist/<route>.html`, `404.html`, `sitemap.xml`, `robots.txt`, adds modulepreloads, and defers the entry script.
- `src/data/` holds all content: `site.ts` (site facts, GitHub user, availability), `projects.ts`, `notes.ts` (writeups), `facts.ts`, `skills.ts`, `resume.ts`, `repos.ts`. Generated: `github.json`, `github-commits.json`, `repos.json`.
- Components: `src/components/home` (home sections), `shared` (site-wide pieces), `ui` (shadcn). Hooks in `src/hooks`, helpers in `src/lib` (`githubCommits.ts` is shared by the browser and the build script).
- State is local React state; there is no global store. Theme is in `hooks/useTheme.ts` (dark by default, `color-scheme` in localStorage).
- `api/` has two Vercel Functions: `contact.ts` (POST, sends mail through Resend; env `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, optional `CONTACT_FROM_EMAIL`, `UPSTASH_REDIS_REST_URL`/`_TOKEN` for a shared rate limit) and `github-commits.ts` (GET, cached 15 min; optional `GITHUB_TOKEN`).
- `vercel.json`: clean URLs, redirect from the vercel.app host, `/notes` -> `/writeups`, security and cache headers.
- `.github/workflows/sync-repos.yml` refreshes `repos.json` weekly and keeps an issue of repos worth featuring.

## Conventions and gotchas

- Add a project or writeup by editing `src/data/projects.ts` or `notes.ts`; routes, SEO, sitemap and prerender pick it up through `staticRoutes`. A new page needs an entry in `routes.ts` and a case in `getPageMeta` in `seo.ts`.
- Keep the first render identical to the server render. Do not read `window` or localStorage during render; read after mount (see `useTheme`, `GitHubActivity`). Use the guarded `useLayoutEffect` pattern from `HomePage`.
- Do not hand-edit the generated JSON in `src/data/` (`github*.json`, `repos.json`).
- The GitHub username is duplicated in `src/data/site.ts` and `api/github-commits.ts`; change both.
- `src/components/ui/**` is shadcn output and is excluded from lint. Use the `@/` alias for imports from `src`.
- Accessibility lint and axe tests are enforced; keep scrollable regions focusable and controls touch-sized.
- Claims in `projects.ts` and `notes.ts` must be verifiable from a repo, commit or live demo. Do not invent metrics.
- Match existing style: few comments, explanatory ones only where the reason is not obvious.

## Ignore

`dist/`, `dist-ssr/`, `test-results/`, `.models/`, `bugs&improve/`, `featuresToImplement/`, and the root `PersonalPhoto*.jpeg` files are local clutter, not part of the app.
