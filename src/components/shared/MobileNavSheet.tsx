import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export type MobileNavLink = { to: string; label: string; current: 'page' | 'location' | undefined }
export type MobileNavSocial = { label: string; href: string; Icon: LucideIcon; external: boolean }

type MobileNavSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  links: MobileNavLink[]
  socials: MobileNavSocial[]
  /** Called when the sheet has closed, so focus can go back to the button that opened it. */
  onClosed: () => void
}

/** The phone menu. Loaded on the first tap of the menu button (see SiteHeader), so the dialog code is not in every page. */
function MobileNavSheet({ open, onOpenChange, links, socials, onClosed }: MobileNavSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-72"
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          onClosed()
        }}
      >
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Jump to a section or get in touch.</SheetDescription>
        </SheetHeader>
        <nav className="grid gap-1 px-4" aria-label="Mobile navigation">
          {links.map((link) => (
            <SheetClose key={link.to} asChild>
              <Link
                className="rounded-md px-3 py-3 text-base font-medium hover:bg-accent aria-[current]:bg-accent aria-[current]:text-primary"
                to={link.to}
                aria-current={link.current}
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
  )
}

export default MobileNavSheet
