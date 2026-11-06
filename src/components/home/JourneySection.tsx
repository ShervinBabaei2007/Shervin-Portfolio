import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from '@/components/shared/SectionHeading'
import { Badge } from '@/components/ui/badge'
import { journey } from '@/data/journey'
import { textLinkClass } from '@/lib/utils'

/**
 * Three steps across the page on wide screens, joined by a line with a dot on each;
 * a vertical timeline on phones. Everything is visible at once, nothing hides behind a click.
 */
function JourneySection() {
  return (
    <section className="section-wrap py-20 max-[620px]:py-12" id="journey" aria-labelledby="journey-title">
      <SectionHeading className="mb-12" id="journey-title" number="05" eyebrow="JOURNEY" title="How I got here" />
      <ol className="grid list-none gap-10 p-0 max-md:ml-2 max-md:border-l md:grid-cols-3 md:gap-8">
        {journey.map((item) => (
          <li key={item.id} className="group/step relative max-md:pl-8 md:pt-9">
            <span
              className="absolute top-0 left-0 hidden h-px w-[calc(100%+2rem)] bg-border md:block md:group-last/step:w-full"
              aria-hidden="true"
            />
            <span
              className="absolute size-3.5 rounded-full border-2 border-primary bg-background max-md:top-1.5 max-md:-left-[7px] md:top-0 md:left-0 md:-translate-y-1/2"
              aria-hidden="true"
            />
            <p className="font-mono text-xs tracking-[.08em] text-primary uppercase">{item.meta}</p>
            <h3 className="mt-1 text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 leading-[1.7] text-muted-foreground">{item.body}</p>
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
