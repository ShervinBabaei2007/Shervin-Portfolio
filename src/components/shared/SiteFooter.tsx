import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const footerLinks = [
  { to: '/projects', label: 'All projects' },
  { to: '/writeups', label: 'All writeups' },
  { to: '/resume', label: 'Resume page' },
  { to: '/lab', label: 'Rate-limiter lab' },
  { to: '/how-its-built', label: 'How this site is built' },
]

function SiteFooter() {
  return (
    <footer className="section-wrap flex min-h-24 flex-wrap items-center justify-between gap-x-8 gap-y-1 py-4 font-mono text-label max-[620px]:min-h-20 print:hidden">
      <Link className="hit-area inline-flex items-center gap-2.5 no-underline" to="/" aria-label="Shervin Babaei, home">
        <img className="size-[29px] rounded-[7px]" src="/logo.svg" width={29} height={29} alt="" />
        <span className="flex flex-col font-sans leading-tight">
          <b className="text-meta font-semibold">Shervin Babaei</b>
          <span className="text-meta text-muted-foreground">Portfolio</span>
        </span>
      </Link>
      <span className="hidden items-center gap-2 text-muted-foreground min-[1100px]:flex">
        MADE IN VANCOUVER <span className="text-primary">/</span> 2026
      </span>
      <nav
        className="order-last flex w-full flex-wrap gap-x-6 font-sans text-meta min-[900px]:order-none min-[900px]:w-auto"
        aria-label="Footer"
      >
        {footerLinks.map(({ to, label }) => (
          <Link
            key={to}
            className="hit-area inline-flex min-h-11 items-center text-muted-foreground underline-offset-[3px] hover:text-primary"
            to={to}
          >
            {label}
          </Link>
        ))}
      </nav>
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
