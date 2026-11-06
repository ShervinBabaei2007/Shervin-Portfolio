import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function SiteFooter() {
  return (
    <footer className="section-wrap flex min-h-[72px] items-center justify-between font-mono text-xs max-[620px]:min-h-[63px] print:hidden">
      <Link
        className="hit-area inline-flex items-center text-xl leading-none font-bold no-underline"
        to="/"
        aria-label="Shervin Babaei, home"
      >
        <span className="grid size-[29px] place-items-center border border-foreground text-base dark:border-border">
          SB
        </span>
        <i className="ml-[3px] size-1.5 bg-primary" />
      </Link>
      <span className="hidden items-center gap-2 text-muted-foreground min-[621px]:flex">
        MADE IN VANCOUVER <span className="text-primary">/</span> 2026
      </span>
      <Link
        className="hidden font-sans text-[.8125rem] text-muted-foreground underline-offset-[3px] hover:text-primary min-[621px]:inline"
        to="/how-its-built"
      >
        How this site is built
      </Link>
      <a
        className="hit-area ml-auto flex items-center gap-2 text-muted-foreground no-underline hover:text-primary min-[621px]:ml-0"
        href="#main"
      >
        BACK TO TOP <ArrowUpRight size={13} />
      </a>
    </footer>
  )
}

export default SiteFooter
