import { ChevronDown, Monitor, Moon, Sun } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Preference } from '@/hooks/useTheme'
import { hitArea } from '@/lib/hitArea'

export type UtilityLink = { to: string; label: string; current: 'page' | 'location' | undefined }
export type UtilitySocial = { label: string; href: string; Icon: LucideIcon; external: boolean }

type UtilityMenuProps = {
  links: UtilityLink[]
  socials: UtilitySocial[]
  preference: Preference
  onPreferenceChange: (preference: Preference) => void
  /** Open straight away: the visitor clicked the plain button while this code was still downloading. */
  defaultOpen?: boolean
}

/** The header's "More" menu: secondary pages, social links and the theme. Its code (the shadcn dropdown menu) is loaded on first use, see SiteHeader. */
function UtilityMenu({ links, socials, preference, onPreferenceChange, defaultOpen }: UtilityMenuProps) {
  // Not modal: a modal menu locks page scroll, which nudged the page sideways when it opened.
  return (
    <DropdownMenu defaultOpen={defaultOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`${hitArea} group cursor-pointer gap-1 text-muted-foreground data-[state=open]:text-foreground`}
        >
          More{' '}
          <ChevronDown className="transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        {links.map((link) => (
          <DropdownMenuItem key={link.to} asChild className="cursor-pointer">
            <Link to={link.to} aria-current={link.current}>
              {link.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {socials.map(({ label, href, Icon, external }) => (
          <DropdownMenuItem key={label} asChild className="cursor-pointer">
            <a href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
              <Icon /> {label}
            </a>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={preference} onValueChange={(value) => onPreferenceChange(value as Preference)}>
          <DropdownMenuRadioItem value="light" className="cursor-pointer">
            <Sun /> Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="cursor-pointer">
            <Moon /> Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" className="cursor-pointer">
            <Monitor /> System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UtilityMenu
