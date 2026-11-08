import type { ReactNode } from 'react'
import Reveal from '@/components/shared/Reveal'
import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  /** Heading id, referenced by the section's aria-labelledby. */
  id: string
  /** Section number shown before the eyebrow label, for example "02". */
  number: string
  eyebrow: string
  title: ReactNode
  /** Trailing punctuation drawn in the accent colour. */
  punctuation?: string
  /** Short supporting text shown to the right on wide screens. */
  aside?: ReactNode
  className?: string
}

/** The numbered eyebrow, heading and aside that open every home-page section. */
function SectionHeading({ id, number, eyebrow, title, punctuation = '.', aside, className }: SectionHeadingProps) {
  return (
    <Reveal>
      <div
        className={cn(
          'flex items-end justify-between gap-[30px] max-[620px]:flex-col max-[620px]:items-start max-[620px]:gap-3',
          className,
        )}
      >
        <div>
          <p className="eyebrow">
            <span className="text-primary">{number}</span> {eyebrow}
          </p>
          <h2 id={id} className="mt-4 text-h2-section [&>span:last-child]:text-primary">
            {title}
            <span>{punctuation}</span>
          </h2>
        </div>
        {aside && (
          <p className="mb-1 text-[1rem] leading-[1.65] text-muted-foreground max-[620px]:text-[.9375rem] max-[620px]:[&_br]:hidden">
            {aside}
          </p>
        )}
      </div>
    </Reveal>
  )
}

export default SectionHeading
