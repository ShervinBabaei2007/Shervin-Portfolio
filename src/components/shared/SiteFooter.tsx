import { Link, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useCopy } from '@/hooks/useCopy'
import { useVancouverClock } from '@/hooks/useVancouverClock'
import { availabilityLine, site } from '@/data/site'

// The site's pages, listed in the footer row.
const footerLinks = [
  { to: '/projects', label: 'Work' },
  { to: '/writeups', label: 'Writeups' },
  { to: '/lab', label: 'Lab' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const profiles = [
  { label: 'LinkedIn', href: site.linkedin },
  { label: 'GitHub', href: site.github },
  { label: 'Resume, PDF', href: '/Shervin-Babaei-Resume.pdf', download: 'Shervin-Babaei-Resume.pdf' },
]

/** "Copy email", confirmed in place and with a toast (or explained, when the clipboard is blocked). */
function CopyEmail() {
  const { copied, copy } = useCopy()
  const onClick = async () => {
    if (await copy(site.email)) toast.success('Email copied', { description: site.email })
    else toast.error('Could not copy', { description: `Email me at ${site.email}` })
  }
  return (
    <button
      type="button"
      onClick={() => void onClick()}
      className="h-12 cursor-pointer rounded-full border border-foreground/25 bg-transparent px-5 font-mono text-[13px] text-foreground transition-colors hover:bg-foreground hover:text-background"
    >
      {copied ? 'Copied' : 'Copy email'}
    </button>
  )
}

/**
 * The ink band at the end of every page: the question, availability and ways to reach me, then the footer row.
 * The Contact page already is that question, so there it shows only the footer row.
 */
function SiteFooter() {
  const { pathname } = useLocation()
  const clock = useVancouverClock(15_000)
  const full = pathname !== '/contact'

  return (
    <footer data-theme="dark" className="bg-[var(--ink-panel)] text-foreground print:hidden">
      <div
        className={`section-wrap flex flex-col gap-[clamp(48px,6vw,88px)] ${full ? 'pt-[clamp(88px,10vw,144px)]' : ''}`}
      >
        {full && (
          <section id="contact" aria-labelledby="contact-title" className="flex flex-col gap-[clamp(48px,6vw,88px)]">
            <div className="flex flex-col gap-[clamp(24px,3vw,40px)]">
              <h2
                id="contact-title"
                className="m-0 text-[clamp(2.75rem,7vw,7rem)] leading-[0.95] font-[650] tracking-[-0.045em]"
              >
                Have an interesting <span className="text-primary">problem?</span>
              </h2>
              <p className="m-0 max-w-[56ch] text-[17px] leading-[1.6] text-muted-foreground">
                {availabilityLine()} Tell me what you&apos;re building and I&apos;ll reply within two business days.
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <Link
                  to="/contact"
                  className="inline-flex h-12 items-center gap-2.5 rounded-full bg-foreground px-[22px] text-[15px] text-background no-underline transition-colors hover:bg-primary-fill hover:text-primary-foreground"
                >
                  Send a message <span aria-hidden="true">→</span>
                </Link>
                <CopyEmail />
              </div>
            </div>
            <ul
              className="m-0 flex list-none flex-wrap border-t border-foreground/15 p-0"
              aria-label="Profiles and resume"
            >
              {profiles.map(({ label, href, download }) => (
                <li key={label} className="flex flex-[1_1_200px]">
                  <a
                    href={href}
                    {...(download ? { download } : { target: '_blank', rel: 'noreferrer' })}
                    className="flex w-full items-center justify-between py-6 pr-6 text-[17px] text-foreground no-underline transition-colors hover:text-primary"
                  >
                    {label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-foreground/15 pt-6 pb-10 font-mono text-[13px] text-muted-foreground">
          <span>
            Made in Vancouver / 2026
            {clock && (
              <>
                {' '}
                · <time>{clock.short}</time>
              </>
            )}
          </span>
          <nav className="flex flex-wrap gap-x-5" aria-label="Footer">
            {footerLinks.map(({ to, label }) => (
              <Link
                key={to}
                className="inline-flex min-h-11 items-center text-muted-foreground no-underline hover:text-foreground"
                to={to}
              >
                {label}
              </Link>
            ))}
          </nav>
          <a
            className="inline-flex min-h-11 items-center text-muted-foreground no-underline hover:text-foreground"
            href="#main"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
