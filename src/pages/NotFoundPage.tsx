import { Link } from 'react-router-dom'
import PageHero from '@/components/shared/PageHero'

const onward = [
  { to: '/projects', label: 'See the work' },
  { to: '/writeups', label: 'Read the writeups' },
  { to: '/resume', label: 'View the resume' },
  { to: '/contact', label: 'Get in touch' },
]

/** The 404 page, with links to the main parts of the site. */
function NotFoundPage() {
  return (
    <>
      <PageHero
        id="not-found-title"
        // A fixed command, not the address: 404.html is one prerendered file served for every unknown address.
        command="cd ./this-page"
        title="This page doesn't exist."
        lead="The link may be old, or the address may have a typo."
      >
        <p className="mt-4 mb-0 font-mono text-[13px] text-primary">404: no such file or directory</p>
      </PageHero>
      <section className="section-wrap pb-[clamp(88px,10vw,144px)]" aria-label="Where to go next">
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-foreground/15 pt-8">
          <Link
            to="/"
            className="inline-flex h-12 items-center gap-2.5 rounded-full bg-foreground px-[22px] text-[15px] text-background no-underline transition-colors hover:bg-primary-fill hover:text-primary-foreground"
          >
            <span aria-hidden="true">←</span> Go to the home page
          </Link>
          <nav className="flex flex-wrap gap-x-6" aria-label="Where to go instead">
            {onward.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="inline-flex min-h-11 items-center text-[15px] text-foreground underline decoration-1 underline-offset-4 hover:text-primary"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </>
  )
}

export default NotFoundPage
