import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

interface BorderBeamProps {
  /** Beam length in px. */
  size?: number
  /** Seconds for one lap of the border. */
  duration?: number
  /** Seconds before the first lap starts (negative to start part-way round). */
  delay?: number
  colorFrom?: string
  colorTo?: string
  borderWidth?: number
  className?: string
  style?: CSSProperties
}

/**
 * Magic UI BorderBeam, the CSS version: a light that travels around the border of the
 * nearest positioned parent. The keyframes live in tailwind.css.
 */
export const BorderBeam = ({
  size = 80,
  duration = 8,
  delay = 0,
  colorFrom = "#8aa4ff",
  colorTo = "#8aa4ff",
  borderWidth = 1.5,
  className,
  style,
}: BorderBeamProps) => {
  return (
    <div
      aria-hidden="true"
      style={
        {
          "--size": size,
          "--duration": duration,
          "--delay": `${-delay}s`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--border-width": `${borderWidth}px`,
          ...style,
        } as CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-width) border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]",
        "after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:90%_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
        "motion-reduce:hidden",
        className
      )}
    />
  )
}
