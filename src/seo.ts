import { findProject, projects } from './data/projects'
import { findNote, notes } from './data/notes'
import { site } from './data/site'

export type PageMeta = {
  title: string
  description: string
  path: string
  /** Absolute URL of a 1200×630 PNG. SVG previews are ignored by LinkedIn, Slack and iMessage. */
  image: string
  type: 'website' | 'article' | 'profile'
  jsonLd: Record<string, unknown>[]
  noindex?: boolean
}

const person = {
  '@type': 'Person',
  '@id': `${site.url}/#person`,
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  email: `mailto:${site.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Vancouver', addressRegion: 'BC', addressCountry: 'CA' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'British Columbia Institute of Technology' },
  sameAs: [site.github, site.linkedin],
  knowsAbout: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Python'],
}

const withContext = (node: Record<string, unknown>) => ({ '@context': 'https://schema.org', ...node })

export const staticRoutes = [
  '/',
  '/resume',
  '/how-its-built',
  '/notes',
  ...projects.map((project) => `/work/${project.slug}`),
  ...notes.map((note) => `/notes/${note.slug}`),
]

export function getPageMeta(pathname: string): PageMeta {
  const path = pathname.replace(/\/+$/, '') || '/'
  const image = (name: string) => `${site.url}/og/${name}.png`

  if (path === '/') {
    return {
      title: `${site.name} | Full-stack developer in Vancouver`,
      description: `${site.name} is a full-stack developer and BCIT student in Vancouver building React, Node, and Python apps. Top 6 of 36 at Hack the Break 2026.`,
      path,
      image: image('home'),
      type: 'profile',
      jsonLd: [withContext(person), withContext({ '@type': 'WebSite', name: site.name, url: site.url })],
    }
  }

  if (path === '/resume') {
    return {
      title: `Resume | ${site.name}`,
      description: `Resume of ${site.name}, full-stack developer and BCIT Full-Stack Web Development student in Vancouver.`,
      path,
      image: image('home'),
      type: 'profile',
      jsonLd: [withContext(person)],
    }
  }

  if (path === '/how-its-built') {
    return {
      title: `How this site is built | ${site.name}`,
      description: 'The stack, tests, accessibility checks, and performance decisions behind this portfolio.',
      path,
      image: image('home'),
      type: 'article',
      jsonLd: [withContext(person)],
    }
  }

  if (path === '/notes') {
    return {
      title: `Engineering notes | ${site.name}`,
      description:
        'Short write-ups on bugs I found in my own projects, how the underlying systems work, and what I changed.',
      path,
      image: image('notes'),
      type: 'website',
      jsonLd: [withContext(person)],
    }
  }

  const note = path.startsWith('/notes/') ? findNote(path.slice('/notes/'.length)) : undefined
  if (note) {
    return {
      title: `${note.title} | ${site.name}`,
      description: note.summary,
      path,
      image: image(`note-${note.slug}`),
      type: 'article',
      jsonLd: [
        withContext({
          '@type': 'TechArticle',
          headline: note.title,
          description: note.summary,
          datePublished: note.date,
          url: `${site.url}${path}`,
          author: { '@id': `${site.url}/#person`, '@type': 'Person', name: site.name },
        }),
      ],
    }
  }

  const slug = path.startsWith('/work/') ? path.slice('/work/'.length) : undefined
  const project = findProject(slug)
  if (project) {
    return {
      title: `${project.name} case study | ${site.name}`,
      description: `${project.subtitle} ${project.highlight}.`,
      path,
      image: image(project.slug),
      type: 'article',
      jsonLd: [
        withContext({
          '@type': 'CreativeWork',
          name: project.name,
          description: project.summary,
          url: `${site.url}${path}`,
          author: { '@id': `${site.url}/#person` },
          keywords: project.stack.join(', '),
          ...(project.live ? { sameAs: project.live } : {}),
        }),
        withContext(person),
      ],
    }
  }

  return {
    title: `Page not found | ${site.name}`,
    description: 'This page does not exist.',
    path,
    image: image('home'),
    type: 'website',
    jsonLd: [],
    noindex: true,
  }
}

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Serialised <head> tags, written into each prerendered HTML file. */
export function renderHeadTags(meta: PageMeta): string {
  const url = `${site.url}${meta.path === '/' ? '/' : meta.path}`
  const tags = [
    `<title>${escapeAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    meta.noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:site_name" content="${escapeAttr(site.name)}" />`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${meta.image}" />`,
    '<meta property="og:image:type" content="image/png" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${escapeAttr(meta.title)}" />`,
    '<meta property="og:locale" content="en_CA" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${meta.image}" />`,
    ...meta.jsonLd.map(
      (node) => `<script type="application/ld+json">${JSON.stringify(node).replace(/</g, '\\u003c')}</script>`,
    ),
  ]
  return tags.join('\n    ')
}
