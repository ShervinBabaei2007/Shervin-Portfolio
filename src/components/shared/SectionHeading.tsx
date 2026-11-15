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
  /** A short supporting line shown under the heading. */
  aside?: ReactNode
  className?: string
}

/**
 * The numbered eyebrow, heading and supporting line that open every home-page section. The supporting line sits under
 * the heading, left-aligned with it, so the two read as one block and always line up with the content below.
 */
function SectionHeading({ id, number, eyebrow, title, punctuation = '.', aside, className }: SectionHeadingProps) {
  return (
    <Reveal>
      <div className={cn('mb-[var(--space-heading)]', className)}>
        <p className="eyebrow">
          <span className="text-primary">{number}</span> {eyebrow}
        </p>
        <h2 id={id} className="mt-5 text-h2-section [&>span:last-child]:text-primary">
          {title}
          <span>{punctuation}</span>
        </h2>
        {aside && (
          <p className="mt-4 max-w-[60ch] text-[1.0625rem] leading-[1.7] text-muted-foreground max-[620px]:text-[.9375rem]">
            {aside}
          </p>
        )}
      </div>
    </Reveal>
  )
}

export default SectionHeading
