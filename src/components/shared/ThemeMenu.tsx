import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Preference, Scheme } from '@/hooks/useTheme'
import { hitArea } from '@/lib/hitArea'

type ThemeMenuProps = {
  scheme: Scheme
  preference: Preference
  onPreferenceChange: (preference: Preference) => void
  /** Open straight away: the visitor clicked the plain button while this code was still downloading. */
  defaultOpen?: boolean
}

/** The theme chooser. Its menu code (Radix dropdown and popper) is loaded on first use, see SiteHeader. */
function ThemeMenu({ scheme, preference, onPreferenceChange, defaultOpen }: ThemeMenuProps) {
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={`${hitArea} max-[620px]:size-11`}
          aria-label="Choose theme"
          title="Choose theme"
        >
          {scheme === 'dark' ? <Moon /> : <Sun />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={preference} onValueChange={(value) => onPreferenceChange(value as Preference)}>
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
  )
}

export default ThemeMenu
