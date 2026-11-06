import { ArrowUpRight } from 'lucide-react'
import { site } from '../data/site'

const sections = [
  {
    title: 'Stack',
    body: 'React 18 and TypeScript, bundled with Vite, with React Router for the case-study pages. No UI framework: the layout, type scale, and both colour themes are hand-written CSS with custom properties.',
  },
  {
    title: 'Every page is real HTML',
    body: 'At build time each route (home, resume, and one page per project) is rendered to static HTML, then React attaches to it in the browser. Pages load with content before any JavaScript runs, each has its own title, description, canonical URL, and share image, and search engines and link previews see the full text.',
  },
  {
    title: 'Tested like a product',
    body: 'Playwright drives a real browser through the site on desktop and mobile sizes: the skill filter, case-study pages, the resume, theme persistence, and the absence of horizontal scrolling. Each run also scans pages with axe-core and fails on any accessibility violation.',
  },
  {
    title: 'Accessibility',
    body: 'Keyboard focus is always visible, interactive targets are at least 44 pixels, and the site respects reduced motion, increased contrast, and Windows high-contrast mode. Colour pairs are checked for WCAG AA contrast in both themes.',
  },
  {
    title: 'Performance',
    body: 'Each page loads only its own JavaScript: pages are split into separate chunks, and the prerendered HTML preloads exactly the chunk it needs, then fetches the rest in the background so navigating is instant. One hashed stylesheet is cached once and reused on every page. Fonts are self-hosted, subset to Latin, and the three used above the fold are preloaded. Screenshots carry their real width and height to avoid layout shift, and phones get a smaller copy through srcset.',
  },
  {
    title: 'Honest content',
    body: 'Every claim in a case study points to code you can open. Command-line projects show sessions recorded from the real program, and code excerpts are copied from the linked repositories.',
  },
]

function BuiltPage() {
  return (
    <article className="simple-page built-page section-wrap" aria-labelledby="built-title">
      <p className="eyebrow">COLOPHON</p>
      <h1 id="built-title">How this site is built</h1>
      <p className="simple-page-lead">
        A portfolio is a project too, so I built and tested this one the way I would a product.
      </p>
      <div className="built-grid">
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
      <a className="text-link" href={`${site.github}`} target="_blank" rel="noreferrer">
        See my GitHub <ArrowUpRight size={15} />
      </a>
    </article>
  )
}

export default BuiltPage
