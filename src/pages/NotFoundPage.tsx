import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageIntro from '@/components/shared/PageIntro'
import { Button } from '@/components/ui/button'

function NotFoundPage() {
  return (
    <section className="section-wrap pt-16 pb-[110px]" aria-labelledby="not-found-title">
      <PageIntro
        eyebrow="404"
        id="not-found-title"
        title="This page doesn't exist."
        lead="The link may be old, or the address may have a typo."
      />
      <Button asChild size="lg" className="h-[46px] px-[17px] text-[.8125rem] font-semibold">
        <Link to="/">
          <ArrowLeft /> Go to the home page
        </Link>
      </Button>
    </section>
  )
}

export default NotFoundPage
