import { matchPath } from 'react-router-dom'
import { lazyPage } from './lazyPage'

/*
 * Each page is its own JavaScript chunk, so the resume page does not download
 * the case-study code and vice versa. `source` is the module path Vite uses in
 * its build manifest; scripts/prerender.mjs uses it to add <link rel="modulepreload">
 * for exactly the chunks each prerendered page needs.
 */
export const pages = {
  home: { path: '/', source: 'src/pages/HomePage.tsx', Component: lazyPage(() => import('./pages/HomePage')) },
  caseStudy: {
    path: '/work/:slug',
    source: 'src/pages/CaseStudyPage.tsx',
    Component: lazyPage(() => import('./pages/CaseStudyPage')),
  },
  writeups: {
    path: '/writeups',
    source: 'src/pages/WriteupsIndexPage.tsx',
    Component: lazyPage(() => import('./pages/WriteupsIndexPage')),
  },
  writeup: {
    path: '/writeups/:slug',
    source: 'src/pages/WriteupPage.tsx',
    Component: lazyPage(() => import('./pages/WriteupPage')),
  },
  projects: {
    path: '/projects',
    source: 'src/pages/ProjectsPage.tsx',
    Component: lazyPage(() => import('./pages/ProjectsPage')),
  },
  lab: { path: '/lab', source: 'src/pages/LabPage.tsx', Component: lazyPage(() => import('./pages/LabPage')) },
  resume: {
    path: '/resume',
    source: 'src/pages/ResumePage.tsx',
    Component: lazyPage(() => import('./pages/ResumePage')),
  },
  built: {
    path: '/how-its-built',
    source: 'src/pages/BuiltPage.tsx',
    Component: lazyPage(() => import('./pages/BuiltPage')),
  },
  notFound: {
    path: '*',
    source: 'src/pages/NotFoundPage.tsx',
    Component: lazyPage(() => import('./pages/NotFoundPage')),
  },
} as const

export type PageKey = keyof typeof pages

export function pageForPath(pathname: string) {
  const match = (Object.values(pages) as (typeof pages)[PageKey][]).find(
    (page) => page.path !== '*' && matchPath(page.path, pathname),
  )
  return match ?? pages.notFound
}

/** Loads every page chunk. Used by the prerenderer, and in the browser when idle. */
export const preloadAllPages = () => Promise.all(Object.values(pages).map((page) => page.Component.preload()))
