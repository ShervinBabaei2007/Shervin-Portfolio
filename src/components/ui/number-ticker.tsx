import { useEffect, useRef, type ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  startValue?: number
  /** Seconds to wait after it scrolls into view. */
  delay?: number
  /** Milliseconds the count takes. */
  duration?: number
  decimalPlaces?: number
  locale?: string
}

/**
 * Magic UI NumberTicker: counts up to `value` the first time it is scrolled into view.
 * Unlike the original it renders the final number in the markup and has no animation
 * library: the count is a requestAnimationFrame loop that skips itself for reduced motion,
 * so the prerendered page, no-JS visitors and screen readers all get the real number.
 */
export function NumberTicker({
  value,
  startValue = 0,
  delay = 0,
  duration = 1400,
  decimalPlaces = 0,
  locale = "en-CA",
  className,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const format = (n: number) =>
      Intl.NumberFormat(locale, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(n)

    // New data after it has already counted up (a live refresh) just updates the number.
    if (counted.current) {
      element.textContent = format(value)
      return
    }
    let frame = 0
    let timer = 0
    // The real number stays in place until the stat is about to come into view, then it counts up from the start.
    const observer = new IntersectionObserver(
      ([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      element.textContent = format(startValue)
      timer = window.setTimeout(() => {
        counted.current = true
        const begin = performance.now()
        const tick = (time: number) => {
          const progress = Math.min((time - begin) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 4) // ease-out quart
          element.textContent = format(startValue + (value - startValue) * eased)
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      }, delay * 1000)
      },
      { rootMargin: "0px 0px 200px 0px" }
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
      cancelAnimationFrame(frame)
      element.textContent = format(value)
    }
  }, [value, startValue, delay, duration, decimalPlaces, locale])

  return (
    <span ref={ref} className={cn("inline-block tabular-nums", className)} {...props}>
      {Intl.NumberFormat(locale, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(value)}
    </span>
  )
}
