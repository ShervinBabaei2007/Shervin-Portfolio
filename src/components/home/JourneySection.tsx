import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from '@/components/shared/SectionHeading'
import { Badge } from '@/components/ui/badge'
import { journey } from '@/data/journey'
import { textLinkClass } from '@/lib/utils'

/** A vertical timeline: everything is visible at once, with nothing hidden behind a click. */
function JourneySection() {
  return (
    <section className="section-wrap py-20" id="journey" aria-labelledby="journey-title">
      <SectionHeading className="mb-10" id="journey-title" number="06" eyebrow="JOURNEY" title="How I got here" />
      <ol className="relative ml-2 list-none border-l p-0">
        {journey.map((item) => (
          <li key={item.id} className="relative pb-10 pl-8 last:pb-0">
            <span
              className="absolute top-1.5 -left-[7px] size-3.5 rounded-full border-2 border-primary bg-background"
              aria-hidden="true"
            />
            <p className="font-mono text-xs tracking-[.08em] text-primary uppercase">{item.meta}</p>
            <h3 className="mt-1 text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 max-w-[68ch] leading-[1.7] text-muted-foreground">{item.body}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <Link className={`${textLinkClass} mt-3 text-sm text-primary`} to={item.link.to}>
              {item.link.label} <ArrowUpRight size={14} />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default JourneySection
