import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

/** The "All projects" / "All notes" link at the top of a detail page. */
function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <nav aria-label="Breadcrumb">
      <Link
        className="inline-flex min-h-11 items-center gap-2 text-[.9375rem] font-semibold text-muted-foreground no-underline hover:text-primary"
        to={to}
      >
        <ArrowLeft size={15} /> {children}
      </Link>
    </nav>
  )
}

export default BackLink
