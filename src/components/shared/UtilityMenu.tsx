import { ChevronDown, Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Preference } from '@/hooks/useTheme'
import { hitArea } from '@/lib/hitArea'

type UtilityMenuProps = {
  preference: Preference
  onPreferenceChange: (preference: Preference) => void
  /** Open straight away: the visitor clicked the plain button while this code was still downloading. */
  defaultOpen?: boolean
}

/** The header's "Settings" menu: the theme. Its code (the shadcn dropdown menu) is loaded on first use, see SiteHeader. */
function UtilityMenu({ preference, onPreferenceChange, defaultOpen }: UtilityMenuProps) {
  // Not modal: a modal menu locks page scroll, which nudged the page sideways when it opened.
  return (
    <DropdownMenu defaultOpen={defaultOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`${hitArea} group cursor-pointer gap-1 text-muted-foreground data-[state=open]:text-foreground`}
        >
          Settings{' '}
          <ChevronDown className="transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
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
