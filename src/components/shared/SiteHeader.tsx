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
    <header className="site-header">
      <Link className="wordmark" to="/" aria-label="Shervin Babaei, home">
        <Avatar className="size-7">
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">SB</AvatarFallback>
        </Avatar>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        {navLinks.map((link) => (
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
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
