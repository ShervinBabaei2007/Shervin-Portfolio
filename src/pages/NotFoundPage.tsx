import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageIntro from '@/components/shared/PageIntro'
import { Button } from '@/components/ui/button'
import { textLinkClass } from '@/lib/utils'

function NotFoundPage() {
  return (
    <section className="section-wrap page-y" aria-labelledby="not-found-title">
      <PageIntro
        eyebrow="404"
        id="not-found-title"
        title="This page doesn't exist."
        lead="The link may be old, or the address may have a typo."
      />
      <Button asChild size="lg" className="h-[46px] px-[17px] text-control font-semibold">
        <Link to="/">
          <ArrowLeft /> Go to the home page
        </Link>
      </Button>
      <nav className="mt-8 flex flex-wrap gap-x-6" aria-label="Where to go instead">
        {[
          { to: '/#work', label: 'See the work' },
          { to: '/writeups', label: 'Read the writeups' },
          { to: '/resume', label: 'View the resume' },
          { to: '/#contact', label: 'Get in touch' },
        ].map(({ to, label }) => (
          <Link key={to} className={`${textLinkClass} min-h-11`} to={to}>
            {label}
          </Link>
        ))}
      </nav>
    </section>
  )
}

export default NotFoundPage
