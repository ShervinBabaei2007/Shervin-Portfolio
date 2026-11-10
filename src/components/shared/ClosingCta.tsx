import { ArrowUpRight, FileText, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Reveal from '@/components/shared/Reveal'
import { availabilityLine } from '@/data/site'
import { textLinkClass } from '@/lib/utils'
import { tone } from '@/lib/buttonTones'
import { cn } from '@/lib/utils'

type ClosingCtaProps = { heading: string; body: string }

/**
 * The last thing on a case study or note: a clear next step for someone who has just finished reading.
 * On wide screens the text sits on the left and the actions on the right, so the card is filled edge to edge.
 */
function ClosingCta({ heading, body }: ClosingCtaProps) {
  return (
    <Reveal>
      <section
        className="mt-14 grid items-center gap-6 rounded-xl border bg-card p-6 max-[620px]:p-5 min-[900px]:grid-cols-[minmax(0,1fr)_auto] min-[900px]:gap-10 min-[900px]:px-8 min-[900px]:py-7"
        aria-labelledby="closing-cta-title"
      >
        <div>
          <h2 id="closing-cta-title" className="text-h2 font-semibold">
            {heading}
          </h2>
          <p className="mt-2 leading-[1.6] text-muted-foreground">{body}</p>
          <p className="mt-1.5 text-meta leading-[1.5] text-muted-foreground">{availabilityLine()}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="h-11 px-[17px] text-control font-semibold">
            <Link to="/#contact">
              Get in touch <Mail />
            </Link>
          </Button>
          <Button asChild size="lg" className={cn('h-11 px-[17px] text-control font-semibold shadow-md', tone.ink)}>
            <Link to="/resume">
              View resume <FileText />
            </Link>
          </Button>
          <Link className={`${textLinkClass} min-h-11 text-control text-primary`} to="/#work">
            All projects <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </Reveal>
  )
}

export default ClosingCta
