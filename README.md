# Shervin Babaei Portfolio

Personal portfolio built with React, TypeScript, and Vite. It is designed as a single-page experience and can be deployed as a static site on Vercel.

## Run locally

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

## Browser tests

Install the Playwright Chromium browser once, then run the responsive-flow and accessibility checks:

```sh
npx playwright install chromium
npm run test:e2e
```

The supplied downloadable resume is stored at `public/Shervin_Babaei_Resume.pdf`.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, import the repository and keep the detected Vite framework preset.
3. Use `npm run build` as the build command and `dist` as the output directory.
4. Deploy, then add the final production URL to the site metadata if using a custom domain.

## Pre-launch checklist

- [ ] Confirm the resume metrics match the final project evidence before publishing.
- [ ] Verify all live demos and repository links, especially team-project attribution.
- [ ] Check the page on a phone and desktop, using keyboard navigation and a reduced-motion setting.
- [ ] Confirm the deployed title, meta description, Open Graph preview, and contact links.
- [ ] Run `npm run build`, deploy, and verify the production Vercel URL.
