import { ArrowRight, Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Preference } from '@/hooks/useTheme'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

/** A page link in the menu; `current` becomes its aria-current. */
export type MobileNavLink = { to: string; label: string; current: 'page' | 'location' | undefined }
/** A contact link; `external` ones open in a new tab. */
export type MobileNavSocial = { label: string; href: string; Icon: LucideIcon; external: boolean }

// The three buttons of the theme switch.
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
        className="w-full gap-0 overflow-y-auto border-l-0 bg-canvas sm:max-w-full"
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          onClosed()
        }}
      >
        <SheetHeader className="h-[var(--header-height)] shrink-0 flex-row items-center gap-0 border-b border-nav-border px-[var(--gutter)] py-0 pr-16">
          <SheetTitle className="font-display text-[18px] font-bold tracking-[-0.02em]">
            Shervin Babaei<span className="text-[1.7em] leading-[0] text-highlight">.</span>
          </SheetTitle>
          <SheetDescription className="sr-only">Menu</SheetDescription>
        </SheetHeader>
        <nav className="grid px-[var(--gutter)] pt-4" aria-label="Mobile navigation">
          {links.map((link, index) => (
            <SheetClose key={link.to} asChild>
              <Link
                // Each link rises in a beat after the one above it, so the menu settles in rather than snapping open.
                style={{ animationDelay: `${90 + index * 45}ms` }}
                className="group flex min-h-16 animate-in items-center justify-between border-b border-foreground/10 font-display text-[2rem] leading-none font-semibold tracking-[-0.03em] text-foreground no-underline duration-500 ease-[cubic-bezier(.2,.7,.2,1)] fade-in-0 [animation-fill-mode:both] slide-in-from-bottom-2 active:text-primary aria-[current]:text-primary"
                to={link.to}
                aria-current={link.current}
              >
                {link.label}
                <ArrowRight
                  className="size-5 text-muted-foreground group-aria-[current]:text-primary"
                  aria-hidden="true"
                />
              </Link>
            </SheetClose>
          ))}
        </nav>
        <div
          style={{ animationDelay: `${90 + links.length * 45}ms` }}
          className="mt-auto grid animate-in gap-6 px-[var(--gutter)] pt-8 pb-[max(24px,env(safe-area-inset-bottom))] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] fade-in-0 [animation-fill-mode:both]"
        >
          <div className="grid gap-2.5">
            <p id="mobile-theme-label" className="m-0 font-mono text-[13px] text-muted-foreground">
              Theme
            </p>
            <div role="group" aria-labelledby="mobile-theme-label" className="flex flex-wrap gap-2">
              {themes.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={preference === value}
                  className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-foreground/25 bg-transparent px-4 text-[15px] text-foreground transition-colors aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background"
                  onClick={() => onPreferenceChange(value)}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2.5">
            <p className="m-0 font-mono text-[13px] text-muted-foreground">Connect</p>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {socials.map(({ label, href, Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-foreground/25 px-4 text-[15px] text-foreground no-underline"
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                    {external && <span className="sr-only"> (opens in a new tab)</span>}
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
