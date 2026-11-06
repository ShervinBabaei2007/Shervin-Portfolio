import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

function NotFoundPage() {
  return (
    <section className="simple-page section-wrap" aria-labelledby="not-found-title">
      <p className="eyebrow">404</p>
      <h1 id="not-found-title">This page doesn&apos;t exist.</h1>
      <p>The link may be old, or the address may have a typo.</p>
      <Button asChild size="lg" className="h-[46px] px-[17px] text-[.8125rem] font-semibold">
        <Link to="/">
          <ArrowLeft /> Go to the home page
        </Link>
      </Button>
    </section>
  )
}

export default NotFoundPage
