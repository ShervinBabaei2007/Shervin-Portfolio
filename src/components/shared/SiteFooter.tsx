import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function SiteFooter() {
  return (
    <footer className="section-wrap flex min-h-[72px] items-center justify-between font-mono text-xs max-[620px]:min-h-[63px] print:hidden">
      <Link
        className="hit-area inline-flex items-center gap-2.5 no-underline"
        to="/"
        aria-label="Shervin Babaei, home"
      >
        <img className="size-[29px] rounded-[7px]" src="/logo.svg" width={29} height={29} alt="" />
        <span className="flex flex-col font-sans leading-tight">
          <b className="text-[.8125rem] font-semibold">Shervin Babaei</b>
          <span className="text-[.6875rem] text-muted-foreground">Portfolio</span>
        </span>
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
