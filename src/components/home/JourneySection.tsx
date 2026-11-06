import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { journey } from '@/data/journey'
import SectionHeading from '@/components/shared/SectionHeading'

function JourneySection() {
  return (
    <section className="section-wrap" id="journey" aria-labelledby="journey-title">
      <SectionHeading id="journey-title" number="04" eyebrow="JOURNEY" title="How I got here" />
      <Accordion type="single" collapsible defaultValue="bcit">
        {journey.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>
              <span>
                {item.title} <span className="ml-2 text-sm font-normal text-muted-foreground">{item.meta}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <p className="text-muted-foreground">{item.body}</p>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Link className="text-link" to={item.link.to}>
                {item.link.label} <ArrowUpRight size={14} />
              </Link>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

export default JourneySection
