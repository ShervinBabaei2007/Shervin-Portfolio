import { Github, Linkedin, Mail, Menu, Monitor, Moon, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Preference, Scheme } from '@/hooks/useTheme'
import { site } from '@/data/site'

type SiteHeaderProps = {
  scheme: Scheme
  preference: Preference
  onPreferenceChange: (preference: Preference) => void
}

const navLinks = [
  { to: '/#work', label: 'Work' },
  { to: '/#about', label: 'About' },
  { to: '/notes', label: 'Notes' },
  { to: '/resume', label: 'Resume' },
  { to: '/#contact', label: 'Contact' },
]

const socials = [
  { label: 'GitHub', href: site.github, Icon: Github, external: true },
  { label: 'LinkedIn', href: site.linkedin, Icon: Linkedin, external: true },
  { label: 'Email', href: `mailto:${site.email}`, Icon: Mail, external: false },
]

function SiteHeader({ scheme, preference, onPreferenceChange }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 grid min-h-[var(--header-height)] w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center justify-between border-b bg-background px-[max(var(--gutter),calc((100%-var(--content-max))/2))] py-2 max-[620px]:flex max-[620px]:flex-wrap max-[620px]:gap-y-1 print:hidden">
      <Link
        className="col-start-1 inline-flex items-center justify-self-start"
        to="/"
        aria-label="Shervin Babaei, home"
      >
        <Avatar className="size-[35px]">
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">SB</AvatarFallback>
        </Avatar>
      </Link>
      <nav
        className="col-start-2 flex flex-wrap justify-center justify-self-center gap-x-[clamp(22px,2.2vw,34px)] max-[620px]:hidden"
        aria-label="Main navigation"
      >
        {navLinks.map((link) => (
          <Link
            key={link.to}
            className="inline-flex min-h-[var(--target)] items-center text-muted-foreground no-underline transition-colors hover:text-primary"
            to={link.to}
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
            <Button variant="ghost" size="icon-sm" aria-label="Choose theme" title="Choose theme">
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
            <Button variant="ghost" size="icon-sm" className="min-[621px]:hidden" aria-label="Open menu">
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
                  <Link className="rounded-md px-3 py-3 text-base font-medium hover:bg-accent" to={link.to}>
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
    </header>
  )
}

export default SiteHeader
