import { ArrowUpRight, FileText, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { availabilityLine } from '@/data/site'
import { textLinkClass } from '@/lib/utils'

type ClosingCtaProps = { heading: string; body: string }

/** The last thing on a case study or note: a clear next step for someone who has just finished reading. */
function ClosingCta({ heading, body }: ClosingCtaProps) {
  return (
    <section className="mt-14 rounded-xl border bg-card p-6 max-[620px]:p-5" aria-labelledby="closing-cta-title">
      <h2 id="closing-cta-title" className="text-xl font-semibold">
        {heading}
      </h2>
      <p className="mt-2 max-w-[60ch] leading-[1.6] text-muted-foreground">{body}</p>
      <p className="mt-1.5 max-w-[60ch] text-meta leading-[1.5] text-muted-foreground">{availabilityLine()}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button asChild size="lg" className="h-11 px-[17px] text-control font-semibold">
          <Link to="/#contact">
            Get in touch <Mail />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-11 px-[17px] text-control font-semibold">
          <Link to="/resume">
            View resume <FileText />
          </Link>
        </Button>
        <Link className={`${textLinkClass} min-h-11 text-control text-primary`} to="/#work">
          All projects <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  )
}

export default ClosingCta
