import type { CSSProperties, ReactNode } from 'react'
import AsciiCanvas from '@/components/shared/AsciiCanvas'
import { cn } from '@/lib/utils'

type PageHeroProps = {
  id: string
  /** The shell command shown above the title, for example "ls ./work". */
  command: string
  title: ReactNode
  lead?: ReactNode
  /** Extra lines under the lead, such as counts. */
  children?: ReactNode
  /** Smaller title for long sentences (the About page). */
  size?: 'large' | 'medium'
  /** Width of the text column. */
  width?: 'narrow' | 'medium' | 'wide'
}

const rise = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

/** The top of an inner page: the ASCII field behind a shell prompt, a large title and a lead line. */
function PageHero({ id, command, title, lead, children, size = 'large', width = 'narrow' }: PageHeroProps) {
  return (
    <section
      className="relative section-wrap pt-[clamp(48px,7vw,104px)] pb-[clamp(40px,5vw,72px)]"
      aria-labelledby={id}
    >
      <AsciiCanvas />
      <div
        data-calm
        className={cn(
          'relative',
          width === 'wide' ? 'max-w-[940px]' : width === 'medium' ? 'max-w-[860px]' : 'max-w-[820px]',
        )}
      >
        <p className="rise m-0 font-mono text-[13px] text-muted-foreground">
          <span className="text-primary">~</span> $ {command}
        </p>
        <h1
          id={id}
          style={rise(80)}
          className={cn(
            'rise mt-5 mb-0 font-[650] tracking-[-0.045em]',
            size === 'large'
              ? 'text-[clamp(2.875rem,6vw,5.875rem)] leading-[0.95]'
              : 'text-[clamp(2.5rem,5.2vw,5rem)] leading-[0.98]',
          )}
        >
          {title}
        </h1>
        {lead && (
          <p
            style={rise(160)}
            className="rise mt-6 mb-0 max-w-[560px] text-[clamp(1.0625rem,1.4vw,1.1875rem)] leading-[1.55] text-text-body"
          >
            {lead}
          </p>
        )}
        {children && (
          <div style={rise(220)} className="rise">
            {children}
          </div>
        )}
      </div>
    </section>
  )
}

export default PageHero
