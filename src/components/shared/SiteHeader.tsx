import { Github, Linkedin, Mail, Monitor, Moon, Sun } from 'lucide-react'
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Preference, Scheme } from '@/hooks/useTheme'
import { site } from '@/data/site'

type SiteHeaderProps = {
  scheme: Scheme
  preference: Preference
  onPreferenceChange: (preference: Preference) => void
}

const socials = [
  { label: 'GitHub', href: site.github, Icon: Github, external: true },
  { label: 'LinkedIn', href: site.linkedin, Icon: Linkedin, external: true },
  { label: 'Email', href: `mailto:${site.email}`, Icon: Mail, external: false },
]

function SiteHeader({ scheme, preference, onPreferenceChange }: SiteHeaderProps) {
  const { from } = site.availability

  return (
    <header className="site-header">
      <Link className="wordmark" to="/" aria-label="Shervin Babaei, home">
        <Avatar className="size-7">
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">SB</AvatarFallback>
        </Avatar>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        <Link to="/#work">Work</Link>
        <Link to="/#about">About</Link>
        <Link to="/notes">Notes</Link>
        <Link to="/resume">Resume</Link>
        <Link to="/#contact">Contact</Link>
      </nav>
      <div className="header-actions">
        <span className="availability">
          <i /> {from ? `AVAILABLE ${from.toUpperCase()}` : 'OPEN TO CO-OP + JUNIOR ROLES'}
        </span>
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
      </div>
    </header>
  )
}

export default SiteHeader
