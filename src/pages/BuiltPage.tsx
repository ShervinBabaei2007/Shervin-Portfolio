import {
  Accessibility,
  ArrowUpRight,
  FileCode2,
  Gauge,
  Github,
  Layers,
  ShieldCheck,
  TestTubeDiagonal,
  type LucideIcon,
} from 'lucide-react'
import PageBreadcrumb from '@/components/shared/PageBreadcrumb'
import PageIntro from '@/components/shared/PageIntro'
import Reveal from '@/components/shared/Reveal'
import { Button } from '@/components/ui/button'
import { pill, raised } from '@/lib/surfaces'
import { cn } from '@/lib/utils'
import { site } from '../data/site'

// The main tools named in the text below, as chips under the heading.
const tools = ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'Playwright', 'axe-core']

// Each entry becomes one card on the page, with an icon so the cards can be told apart at a glance.
const sections: { title: string; icon: LucideIcon; body: string }[] = [
  {
    title: 'Stack',
    icon: Layers,
    body: 'React 19 and TypeScript, bundled with Vite, with React Router for every page. Tailwind CSS and shadcn/ui provide the components, styled with one set of light and dark colour tokens. The hand-written CSS covers only what utilities cannot express: the colour tokens themselves, keyframe animations, the resume’s print layout, and the reduced-motion rules. The animated background behind the page titles is a small canvas script.',
  },
  {
    title: 'Every page is real HTML',
    icon: FileCode2,
    body: 'At build time every route (home, the work and writeup pages, About, Contact, the lab, the resume, and this page) is rendered to static HTML, then React attaches to it in the browser. “Prerendered” just means the page arrives already written out, not assembled afterwards. Pages load with content before any JavaScript runs, each has its own title, description, canonical URL, and share image, and search engines and link previews see the full text.',
  },
  {
    title: 'Tested like a product',
    icon: TestTubeDiagonal,
    body: 'Playwright drives a real browser through the built, prerendered site on desktop and phone sizes: the project filters, case-study and writeup pages, the contact form, the resume, the theme switch, the phone menu, and the absence of horizontal scrolling. Each run also scans pages with axe-core (an automatic accessibility checker) in both themes and fails on any accessibility violation. ESLint, Prettier, and a size budget for the main JavaScript file check the code itself.',
  },
  {
    title: 'Accessibility',
    icon: Accessibility,
    body: 'Keyboard focus is always visible, controls are at least 44 pixels tall on touch screens, and the site respects reduced motion and the increased-contrast setting. Colour pairs are checked for WCAG AA contrast (the common accessibility standard) in both themes. Features that need a mouse, such as inspect mode, are left out on touch screens instead of shown broken.',
  },
  {
    title: 'Performance',
    icon: Gauge,
    body: 'Each page loads only its own JavaScript: pages are split into separate chunks, and the prerendered HTML preloads exactly the chunk it needs, then fetches the rest in the background so navigating is instant. Heavier pieces load only when needed: the search dialog and the phone menu the first time you open them, and the animated background once the browser is idle (on phones it draws one still frame instead of animating). One hashed stylesheet is cached once and reused on every page. Fonts are self-hosted, subset to Latin, and the three used above the fold are preloaded. Screenshots carry their real width and height to avoid layout shift (content jumping around as the page loads), and phones get a smaller copy of each image.',
  },
  {
    title: 'Honest content',
    icon: ShieldCheck,
    body: 'Every claim in a case study points to code you can open. Command-line projects show sessions recorded from the real program, and code excerpts are copied from the linked repositories.',
  },
]

/** The "How this site is built" page at /how-its-built. */
function BuiltPage() {
  return (
    <article aria-labelledby="built-title">
      {/* The header sits on the tinted band used across the site; the cards below sit on the page. */}
      <div className="section-band">
        <div className="section-wrap pt-[clamp(1.25rem,3.5svh,2.25rem)] pb-[var(--space-block)]">
          <PageBreadcrumb trail={[{ label: 'Home', to: '/' }]} current="How this site is built" />
          <div className="mt-[18px]">
            <PageIntro
              eyebrow="COLOPHON"
              id="built-title"
              title="How this site is built"
              lead="A portfolio is a project too, so I built and tested this one the way I would a product."
            />
            <ul className="m-0 -mt-4 flex list-none flex-wrap gap-2 p-0" aria-label="Main tools">
              {tools.map((tool) => (
                <li key={tool} className={cn(pill, 'font-mono text-label')}>
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="section-wrap pt-[var(--space-block)] pb-[var(--space-page)]">
        <ul className="m-0 grid list-none gap-6 p-0 min-[900px]:grid-cols-2">
          {sections.map(({ title, icon: Icon, body }, index) => (
            <li key={title}>
              <Reveal delay={(index % 2) * 0.08}>
                <section
                  className={`h-full rounded-2xl border bg-card p-8 max-[620px]:p-5 ${raised}`}
                  aria-labelledby={`built-${index}`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="grid size-11 flex-none place-items-center rounded-xl bg-primary/10 text-primary"
                      aria-hidden="true"
                    >
                      <Icon size={20} />
                    </span>
                    <h2 id={`built-${index}`} className="text-h3 font-semibold">
                      {title}
                    </h2>
                  </div>
                  <p className="mt-4 max-w-[62ch] leading-[1.7] text-muted-foreground">{body}</p>
                </section>
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-foreground/15 bg-card px-8 py-6 shadow-[0_2px_4px_var(--color-shadow)] max-[620px]:px-5">
          <p className="font-semibold">My code is on GitHub, so you can check what is described here.</p>
          <Button asChild size="lg" className="h-11 px-5 text-control font-semibold">
            <a href={site.github} target="_blank" rel="noreferrer">
              <Github /> See my GitHub <ArrowUpRight />
            </a>
          </Button>
        </div>
      </div>
    </article>
  )
}

export default BuiltPage
