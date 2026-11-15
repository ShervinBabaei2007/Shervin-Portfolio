import { ArrowRight, ArrowUpRight, FileText, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Reveal from '@/components/shared/Reveal'
import { availabilityLine } from '@/data/site'
import { tone } from '@/lib/buttonTones'
import { raised } from '@/lib/surfaces'
import { cn } from '@/lib/utils'

type ClosingCtaProps = { heading: string; body: string }

/**
 * The last thing on a case study or writeup: a clear next step for someone who has just finished reading. It is a
 * raised white card like every other card on these pages (and sits on the tinted band at the bottom of them), with an
 * icon chip, the message and availability on the left and the actions on the right.
 */
function ClosingCta({ heading, body }: ClosingCtaProps) {
  return (
    <Reveal>
      <section
        className={cn(
          'grid items-center gap-8 rounded-2xl border bg-card p-8 max-[620px]:p-5 min-[900px]:grid-cols-[minmax(0,1fr)_auto] min-[900px]:gap-12 min-[900px]:px-10 min-[900px]:py-9',
          raised,
        )}
        aria-labelledby="closing-cta-title"
      >
        <div className="flex items-start gap-5 max-[620px]:flex-col max-[620px]:gap-4">
          <span
            className="grid size-12 flex-none place-items-center rounded-xl bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <Mail size={22} />
          </span>
          <div className="min-w-0">
            <h2 id="closing-cta-title" className="text-h2 font-semibold">
              {heading}
            </h2>
            <p className="mt-2 max-w-[52ch] leading-[1.65] text-muted-foreground">{body}</p>
            <p className="mt-4 inline-flex items-start gap-2.5 text-meta leading-[1.5] text-muted-foreground">
              <span className="mt-1.5 size-2 flex-none rounded-full bg-success" aria-hidden="true" />
              {availabilityLine()}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="h-11 px-5 text-control font-semibold">
            <Link to="/#contact">
              Get in touch <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" className={cn('h-11 px-5 text-control font-semibold shadow-md', tone.ink)}>
            <Link to="/resume">
              View resume <FileText />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 border-input px-5 text-control font-semibold text-foreground shadow-sm"
          >
            <Link to="/projects">
              All projects <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>
    </Reveal>
  )
}

export default ClosingCta
