import type { ReactNode } from 'react'

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
    <div className={className ? `section-heading ${className}` : 'section-heading'}>
      <div>
        <p className="eyebrow">
          <span className="eyebrow-mark">{number}</span> {eyebrow}
        </p>
        <h2 id={id}>
          {title}
          <span>{punctuation}</span>
        </h2>
      </div>
      {aside && <p className="section-aside">{aside}</p>}
    </div>
  )
}

export default SectionHeading
