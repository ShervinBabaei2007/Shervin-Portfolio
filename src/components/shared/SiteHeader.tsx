import { Github, Linkedin, Mail, Menu, Monitor, Moon, Sun } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import CommandPalette from '@/components/shared/CommandPalette'
import ScrollProgress from '@/components/shared/ScrollProgress'
import { useActiveSection } from '@/hooks/useActiveSection'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Preference, Scheme } from '@/hooks/useTheme'
import { site } from '@/data/site'

type SiteHeaderProps = {
  scheme: Scheme
  preference: Preference
  onPreferenceChange: (preference: Preference) => void
}

const navLinks = [
  { to: '/#work', label: 'Work', section: 'work' },
  { to: '/#about', label: 'About', section: 'about' },
  { to: '/notes', label: 'Notes', page: '/notes' },
  { to: '/resume', label: 'Resume', page: '/resume' },
  { to: '/#contact', label: 'Contact', section: 'contact' },
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
  const activeSection = useActiveSection(Object.keys(sectionOwner), pathname === '/')
  const activeOwner = activeSection ? sectionOwner[activeSection] : null

  /** `location` while its section is in view on the home page, `page` while you are on its own page. */
  const currentFor = (link: (typeof navLinks)[number]) => {
    if ('page' in link && pathname.startsWith(link.page)) return 'page' as const
    if (pathname === '/' && 'section' in link && link.section === activeOwner) return 'location' as const
    return undefined
  }

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
        className="col-start-2 flex flex-wrap justify-center justify-self-center gap-x-[clamp(22px,2.2vw,34px)] max-[620px]:hidden"
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
        <TooltipProvider delayDuration={150}>
          {socials.map(({ label, href, Icon, external }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon-sm" className="hidden sm:inline-flex">
                  <a href={href} aria-label={label} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                    <Icon />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="max-[620px]:size-11"
              aria-label="Choose theme"
              title="Choose theme"
            >
              {scheme === 'dark' ? <Moon /> : <Sun />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={preference}
              onValueChange={(value) => onPreferenceChange(value as Preference)}
            >
              <DropdownMenuRadioItem value="light">
                <Sun /> Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon /> Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                <Monitor /> System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="max-[620px]:size-11 min-[621px]:hidden"
              aria-label="Open menu"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Jump to a section or get in touch.</SheetDescription>
            </SheetHeader>
            <nav className="grid gap-1 px-4" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <SheetClose key={link.to} asChild>
                  <Link
                    className="rounded-md px-3 py-3 text-base font-medium hover:bg-accent aria-[current]:bg-accent aria-[current]:text-primary"
                    to={link.to}
                    aria-current={currentFor(link)}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto flex gap-1 p-4">
              {socials.map(({ label, href, Icon, external }) => (
                <Button key={label} asChild variant="outline" size="icon">
                  <a href={href} aria-label={label} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                    <Icon />
                  </a>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <ScrollProgress />
    </header>
  )
}

export default SiteHeader
