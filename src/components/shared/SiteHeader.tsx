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
  preference: Preference
  onPreferenceChange: (preference: Preference) => void
}

// Started early (focus, touch) so the menu is usually ready by the time it is opened.
const loadMobileNav = () => import('./MobileNavSheet')
const MobileNavSheet = lazy(loadMobileNav)

// The theme menu pulls in the Radix menu and popper code, so it downloads on first hover, focus, touch or click.
const loadThemeMenu = () => import('./ThemeMenu')
const ThemeMenu = lazy(loadThemeMenu)

const navLinks = [
  { to: '/#work', label: 'Work', section: 'work' },
  { to: '/#about', label: 'About', section: 'about' },
  { to: '/#contact', label: 'Contact', section: 'contact' },
  { to: '/writeups', label: 'Writeups', page: '/writeups' },
  { to: '/resume', label: 'Resume', page: '/resume' },
] as const

/** Every home-page section, and which nav item it belongs to while you are reading it. */
const sectionOwner: Record<string, string> = {
  work: 'work',
  about: 'about',
  skills: 'about',
  contact: 'contact',
}

const socials = [
  { label: 'GitHub', href: site.github, Icon: Github, external: true },
  { label: 'LinkedIn', href: site.linkedin, Icon: Linkedin, external: true },
  { label: 'Email', href: `mailto:${site.email}`, Icon: Mail, external: false },
]

function SiteHeader({ scheme, preference, onPreferenceChange }: SiteHeaderProps) {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuEverOpened, setMenuEverOpened] = useState(false)
  const [menuLoading, setMenuLoading] = useState(false)
  const [themeMenuWanted, setThemeMenuWanted] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const activeSection = useActiveSection(Object.keys(sectionOwner), pathname === '/')
  const activeOwner = activeSection ? sectionOwner[activeSection] : null

  /** `location` while its section is in view on the home page, `page` while you are on its own page. */
  const currentFor = (link: (typeof navLinks)[number]) => {
    if ('page' in link && pathname.startsWith(link.page)) return 'page' as const
    if (pathname === '/' && 'section' in link && link.section === activeOwner) return 'location' as const
    return undefined
  }

  const themeButton = (
    <Button
      variant="ghost"
      size="icon-sm"
      className={`${hitArea} max-[620px]:size-11`}
      aria-label="Choose theme"
      title="Choose theme"
      onPointerEnter={() => void loadThemeMenu().catch(() => {})}
      onFocus={() => void loadThemeMenu().catch(() => {})}
      onTouchStart={() => void loadThemeMenu().catch(() => {})}
      onClick={() => setThemeMenuWanted(true)}
    >
      {scheme === 'dark' ? <Moon /> : <Sun />}
    </Button>
  )

  return (
    <header className="sticky top-0 z-20 grid min-h-[var(--header-height)] w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center justify-between border-b bg-background px-[max(var(--gutter),calc((100%-var(--content-max))/2))] py-2 max-[620px]:flex max-[620px]:flex-wrap max-[620px]:gap-y-1 print:hidden">
      <Link
        className="col-start-1 inline-flex min-h-11 min-w-11 items-center justify-self-start"
        to="/"
        aria-label="Shervin Babaei, home"
      >
        <img className="size-[35px] rounded-[8px]" src="/logo.svg" width={35} height={35} alt="" />
      </Link>
      <nav
        className="col-start-2 flex flex-wrap justify-center gap-x-[clamp(22px,2.2vw,34px)] justify-self-center max-[959px]:hidden"
        aria-label="Main navigation"
      >
        {navLinks.map((link) => (
          <Link
            key={link.to}
            className="relative inline-flex min-h-[var(--target)] items-center text-muted-foreground no-underline transition-colors after:absolute after:inset-x-0 after:bottom-1.5 after:h-0.5 after:rounded-full after:bg-primary after:opacity-0 after:transition-opacity hover:text-primary aria-[current]:text-foreground aria-[current]:after:opacity-100"
            to={link.to}
            aria-current={currentFor(link)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="col-start-3 flex items-center gap-4 justify-self-end max-[620px]:gap-0">
        <CommandPalette />
        {socials.map(({ label, href, Icon, external }) => (
          <Button
            key={label}
            asChild
            variant="ghost"
            size="icon-sm"
            className={`group/tip ${hitArea} hidden min-[960px]:inline-flex`}
          >
            <a href={href} aria-label={label} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
              <Icon />
              {/* A label on hover and keyboard focus. Plain CSS, so the header needs no tooltip library. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-full left-1/2 z-30 mt-1.5 -translate-x-1/2 rounded-md bg-foreground px-2.5 py-1 text-meta whitespace-nowrap text-background opacity-0 transition-opacity delay-150 group-hover/tip:opacity-100 group-focus-visible/tip:opacity-100"
              >
                {label}
              </span>
            </a>
          </Button>
        ))}
        {themeMenuWanted ? (
          <LazyBoundary label="Theme menu" fallback={themeButton} onFail={() => setThemeMenuWanted(false)}>
            <Suspense fallback={themeButton}>
              <ThemeMenu scheme={scheme} preference={preference} onPreferenceChange={onPreferenceChange} defaultOpen />
            </Suspense>
          </LazyBoundary>
        ) : (
          themeButton
        )}
        <Button
          ref={menuButton}
          variant="ghost"
          size="icon-sm"
          className="max-[959px]:size-11 min-[960px]:hidden"
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-busy={menuLoading}
          onFocus={() => void loadMobileNav().catch(() => {})}
          onTouchStart={() => void loadMobileNav().catch(() => {})}
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
                links={navLinks.map((link) => ({ to: link.to, label: link.label, current: currentFor(link) }))}
                socials={socials}
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
