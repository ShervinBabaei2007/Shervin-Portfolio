import { ArrowUpRight, ChevronRight, Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Preference } from '@/hooks/useTheme'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export type MobileNavLink = { to: string; label: string; current: 'page' | 'location' | undefined }
export type MobileNavSocial = { label: string; href: string; Icon: LucideIcon; external: boolean }

const themes = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
] as const

type MobileNavSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  links: MobileNavLink[]
  socials: MobileNavSocial[]
  preference: Preference
  onPreferenceChange: (preference: Preference) => void
  /** Called when the sheet has closed, so focus can go back to the button that opened it. */
  onClosed: () => void
}

/** The phone menu. Loaded on the first tap of the menu button (see SiteHeader), so the dialog code is not in every page. */
function MobileNavSheet({
  open,
  onOpenChange,
  links,
  socials,
  preference,
  onPreferenceChange,
  onClosed,
}: MobileNavSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[min(20rem,88vw)] gap-0 overflow-y-auto"
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          onClosed()
        }}
      >
        <SheetHeader className="flex-row items-center gap-3 border-b px-5 py-3 pr-14">
          <img className="size-8 rounded-[7px]" src="/logo.svg" width={32} height={32} alt="" />
          <div className="grid gap-0.5">
            <SheetTitle className="leading-none">Shervin Babaei</SheetTitle>
            <SheetDescription className="text-xs leading-none">Menu</SheetDescription>
          </div>
        </SheetHeader>
        <nav className="grid gap-1 px-3 py-3" aria-label="Mobile navigation">
          {links.map((link) => (
            <SheetClose key={link.to} asChild>
              <Link
                className="group relative flex min-h-12 items-center justify-between rounded-md px-3 text-base font-medium hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:bg-accent/70 aria-[current]:bg-accent aria-[current]:text-primary aria-[current]:before:absolute aria-[current]:before:inset-y-2.5 aria-[current]:before:left-0 aria-[current]:before:w-0.5 aria-[current]:before:rounded-full aria-[current]:before:bg-primary"
                to={link.to}
                aria-current={link.current}
              >
                {link.label}
                <ChevronRight
                  className="size-4 text-muted-foreground opacity-60 group-aria-[current]:text-primary"
                  aria-hidden="true"
                />
              </Link>
            </SheetClose>
          ))}
        </nav>
        <div className="mt-auto grid gap-5 border-t px-5 py-5">
          <div className="grid gap-2">
            <p id="mobile-theme-label" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Theme
            </p>
            <div
              role="group"
              aria-labelledby="mobile-theme-label"
              className="grid grid-cols-3 gap-1 rounded-lg border bg-muted/40 p-1"
            >
              {themes.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={preference === value}
                  className="flex min-h-11 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm aria-pressed:ring-1 aria-pressed:ring-border"
                  onClick={() => onPreferenceChange(value)}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Connect</p>
            <ul className="grid gap-1">
              {socials.map(({ label, href, Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="flex min-h-12 items-center gap-3 rounded-md px-3 text-sm font-medium hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:bg-accent/70"
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                    {label}
                    {external && <span className="sr-only"> (opens in a new tab)</span>}
                    {external && (
                      <ArrowUpRight className="ml-auto size-4 text-muted-foreground opacity-60" aria-hidden="true" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNavSheet
