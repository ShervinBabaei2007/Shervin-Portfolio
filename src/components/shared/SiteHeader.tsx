import { lazy, Suspense, useRef, useState } from 'react'
import { Github, Linkedin, Mail, Menu, Moon, Sun } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import CommandPalette from '@/components/shared/CommandPalette'
import LazyBoundary from '@/components/shared/LazyBoundary'
import PendingFlag from '@/components/shared/PendingFlag'
import { Spinner } from '@/components/ui/spinner'
import ScrollProgress from '@/components/shared/ScrollProgress'
import { useActiveSection } from '@/hooks/useActiveSection'
import type { Preference, Scheme } from '@/hooks/useTheme'
import { site } from '@/data/site'
import { hitArea } from '@/lib/hitArea'

type SiteHeaderProps = {
  scheme: Scheme
  onToggleTheme: () => void
  preference: Preference
  onPreferenceChange: (preference: Preference) => void
}

// Started early (focus, touch) so the menu is usually ready by the time it is opened.
const loadMobileNav = () => import('./MobileNavSheet')
const MobileNavSheet = lazy(loadMobileNav)
// Early downloads ignore failures; LazyBoundary handles them if the menu is actually opened.
const preloadMobileNav = () => void loadMobileNav().catch(() => {})

// The header links, one per page.
const navLinks = [
  { to: '/projects', label: 'Work', section: 'work', pages: ['/projects', '/work/'] },
  { to: '/writeups', label: 'Writeups', section: 'writeups', pages: ['/writeups'] },
  { to: '/lab', label: 'Lab', section: 'lab', pages: ['/lab'] },
  { to: '/about', label: 'About', section: 'about', pages: ['/about'] },
  { to: '/contact', label: 'Contact', section: 'contact', pages: ['/contact'] },
] as const

// Extra pages that appear only in the phone menu.
const moreLinks = [{ to: '/resume', label: 'Resume', page: '/resume' }] as const

/** Every home-page section, and which nav item it belongs to while you are reading it. */
const sectionOwner: Record<string, string> = {
  work: 'work',
  writeups: 'writeups',
  lab: 'lab',
  about: 'about',
  contact: 'contact',
}

// Contact links at the bottom of the phone menu.
const socials = [
  { label: 'GitHub', href: site.github, Icon: Github, external: true },
  { label: 'LinkedIn', href: site.linkedin, Icon: Linkedin, external: true },
  { label: 'Email', href: `mailto:${site.email}`, Icon: Mail, external: false },
]

/** The sticky header: wordmark, links, search, the Settings menu, the resume and, on phones, the menu button. */
function SiteHeader({ scheme, onToggleTheme, preference, onPreferenceChange }: SiteHeaderProps) {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuEverOpened, setMenuEverOpened] = useState(false)
  const [menuLoading, setMenuLoading] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const activeSection = useActiveSection(Object.keys(sectionOwner), pathname === '/')
  const activeOwner = activeSection ? sectionOwner[activeSection] : null

  /** `location` while its section is in view on the home page, `page` while you are on its own page. */
  const currentFor = (link: (typeof navLinks)[number] | (typeof moreLinks)[number]) => {
    if ('page' in link && pathname.startsWith(link.page)) return 'page' as const
    if ('pages' in link && link.pages.some((page) => pathname.startsWith(page))) return 'page' as const
    if (pathname === '/' && 'section' in link && link.section === activeOwner) return 'location' as const
    return undefined
  }

  return (
    <header className="site-header sticky top-0 z-20 grid min-h-[var(--header-height)] w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-6 border-b border-nav-border px-[max(var(--gutter),calc((100%-var(--content-max))/2))] max-[959px]:grid-cols-[minmax(0,1fr)_auto] print:hidden">
      <Link
        className="inline-flex min-h-11 items-center justify-self-start font-display text-[18px] font-bold tracking-[-0.02em] text-foreground no-underline"
        to="/"
        aria-label="Shervin Babaei, home"
      >
        <span>
          {site.name}
          <span className="text-[1.7em] leading-[0] text-highlight" aria-hidden="true">
            .
          </span>
        </span>
      </Link>
      {/* The page links sit alone in the middle; the tools (search, theme, resume) are grouped quietly on the right. */}
      <nav className="flex items-center gap-1 text-[15px] max-[959px]:hidden" aria-label="Main navigation">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            className="inline-flex h-9 items-center rounded-full px-3.5 text-nav-text no-underline transition-colors hover:bg-surface-hover aria-[current]:bg-surface-hover aria-[current]:font-medium aria-[current]:text-nav-active"
            to={link.to}
            aria-current={currentFor(link)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-1 justify-self-end max-[620px]:gap-0">
        <CommandPalette />
        {/* One click flips light and dark; the icon shows the theme you are in. The phone menu also offers System. */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={scheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={scheme === 'dark' ? 'Dark theme (switch to light)' : 'Light theme (switch to dark)'}
          className={`${hitArea} cursor-pointer rounded-full text-muted-foreground hover:text-foreground max-[959px]:hidden`}
          onClick={onToggleTheme}
        >
          {scheme === 'dark' ? <Moon /> : <Sun />}
        </Button>
        <a
          href="/Shervin-Babaei-Resume.pdf"
          download="Shervin-Babaei-Resume.pdf"
          aria-label="Download resume (PDF)"
          className="ml-2 inline-flex h-9 items-center gap-1.5 rounded-full border border-foreground/20 px-4 text-[15px] text-foreground no-underline transition-colors hover:bg-foreground hover:text-background max-[959px]:hidden"
        >
          Resume <span aria-hidden="true">↗</span>
        </a>
        <Button
          ref={menuButton}
          variant="ghost"
          size="icon-sm"
          className="max-[959px]:size-11 min-[960px]:hidden"
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-busy={menuLoading}
          onFocus={preloadMobileNav}
          onTouchStart={preloadMobileNav}
          onClick={() => {
            setMenuEverOpened(true)
            setMenuOpen(true)
          }}
        >
          {menuLoading ? <Spinner aria-hidden="true" role="presentation" /> : <Menu />}
        </Button>
        {menuEverOpened && (
          <LazyBoundary
            label="Menu"
            onFail={() => {
              setMenuOpen(false)
              setMenuEverOpened(false)
              setMenuLoading(false)
            }}
          >
            <Suspense fallback={<PendingFlag onChange={setMenuLoading} />}>
              <MobileNavSheet
                open={menuOpen}
                onOpenChange={setMenuOpen}
                links={[...navLinks, ...moreLinks].map((link) => ({
                  to: link.to,
                  label: link.label,
                  current: currentFor(link),
                }))}
                socials={socials}
                preference={preference}
                onPreferenceChange={onPreferenceChange}
                onClosed={() => menuButton.current?.focus()}
              />
            </Suspense>
          </LazyBoundary>
        )}
      </div>
      <ScrollProgress />
    </header>
  )
}

export default SiteHeader
