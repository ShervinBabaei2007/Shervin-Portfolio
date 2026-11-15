import { useId } from 'react'
import { LazyMotion, MotionConfig, m } from 'motion/react'
import { loadMotion } from '@/lib/loadMotion'
import { cn } from '@/lib/utils'

export type FilterOption = { value: string; label: string; count: number }

type FilterBarProps = {
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  /** Names the group for assistive tech, for example "Filter projects by type". */
  label: string
  className?: string
}

/**
 * A row of filter buttons in one rounded container. The blue highlight is a single shape that glides from the old
 * choice to the new one, instead of one button switching off and another switching on. Each button is a toggle
 * (aria-pressed), so assistive tech hears the same thing it always did. Reduced motion jumps straight across.
 */
function FilterBar({ options, value, onChange, label, className }: FilterBarProps) {
  // One shared layout id per bar, so two bars on a page never glide into each other.
  const barId = useId()

  return (
    <MotionConfig reducedMotion="user" transition={{ type: 'spring', stiffness: 520, damping: 40, mass: 0.8 }}>
      <LazyMotion features={loadMotion}>
        <div
          role="group"
          aria-label={label}
          className={cn(
            'flex flex-wrap gap-1.5 rounded-2xl border border-foreground/15 bg-card p-1.5 shadow-[0_1px_2px_var(--color-shadow)]',
            className,
          )}
        >
          {options.map((option) => {
            const active = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(option.value)}
                className={cn(
                  'relative inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-3 text-control font-medium whitespace-nowrap outline-none',
                  'transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card pointer-coarse:min-h-11',
                  active ? 'text-primary-foreground' : 'text-foreground hover:bg-muted',
                )}
              >
                {active && (
                  <m.span
                    layoutId={`filter-highlight-${barId}`}
                    className="absolute inset-0 rounded-md bg-primary-fill"
                    aria-hidden="true"
                  />
                )}
                <span className="relative">{option.label}</span>
                <span
                  className={cn(
                    'relative tabular-nums transition-colors duration-300',
                    !active && 'text-muted-foreground',
                  )}
                >
                  {option.count}
                </span>
              </button>
            )
          })}
        </div>
      </LazyMotion>
    </MotionConfig>
  )
}

export default FilterBar
