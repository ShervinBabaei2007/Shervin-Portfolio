import { ArrowUpRight } from 'lucide-react'
import PageIntro from '@/components/shared/PageIntro'
import { textLinkClass } from '@/lib/utils'
import { site } from '../data/site'

const sections = [
  {
    title: 'Stack',
    body: 'React 19 and TypeScript, bundled with Vite, with React Router for the case-study pages. Tailwind CSS and shadcn/ui provide the components and the light and dark colour tokens. A small hand-written stylesheet covers the few visuals utilities do not express, such as the hero artwork and the pointer glow on project cards.',
  },
  {
    title: 'Every page is real HTML',
    body: 'At build time each route (home, resume, and one page per project) is rendered to static HTML, then React attaches to it in the browser. Pages load with content before any JavaScript runs, each has its own title, description, canonical URL, and share image, and search engines and link previews see the full text.',
  },
  {
    title: 'Tested like a product',
    body: 'Playwright drives a real browser through the site on desktop and mobile sizes: the skill filter, case-study pages, the resume, theme persistence, and the absence of horizontal scrolling. Each run also scans pages with axe-core and fails on any accessibility violation. The same checks, plus ESLint and Prettier, run in CI on every push.',
  },
  {
    title: 'Accessibility',
    body: 'Keyboard focus is always visible, interactive targets are at least 44 pixels, and the site respects reduced motion, increased contrast, and Windows high-contrast mode. Colour pairs are checked for WCAG AA contrast in both themes.',
  },
  {
    title: 'Performance',
    body: 'Each page loads only its own JavaScript: pages are split into separate chunks, and the prerendered HTML preloads exactly the chunk it needs, then fetches the rest in the background so navigating is instant. Heavier pieces, such as the search dialog and the quick-look drawer, load the first time you open them. One hashed stylesheet is cached once and reused on every page. Fonts are self-hosted, subset to Latin, and the two used above the fold are preloaded. Screenshots carry their real width and height to avoid layout shift, and phones get a smaller copy through srcset.',
  },
  {
    title: 'Honest content',
    body: 'Every claim in a case study points to code you can open. Command-line projects show sessions recorded from the real program, and code excerpts are copied from the linked repositories.',
  },
]

function BuiltPage() {
  return (
    <article className="section-wrap pt-16 pb-[110px]" aria-labelledby="built-title">
      <PageIntro
        eyebrow="COLOPHON"
        id="built-title"
        title="How this site is built"
        lead="A portfolio is a project too, so I built and tested this one the way I would a product."
      />
      <div className="mb-9 grid grid-cols-2 gap-x-12 border-t max-[900px]:grid-cols-1">
        {sections.map((section) => (
          <section key={section.title} className="border-b py-6">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="mt-2.5 max-w-[60ch] leading-[1.7] text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
      <a className={textLinkClass} href={`${site.github}`} target="_blank" rel="noreferrer">
        See my GitHub <ArrowUpRight size={15} />
      </a>
    </article>
  )
}

export default BuiltPage
