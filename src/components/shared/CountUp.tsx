import { useEffect, useRef, useState } from 'react'

const DURATION = 1100

/**
 * A number that counts up from zero the first time it scrolls into view. The markup always contains the real
 * value (prerendering, no-JS visitors, reduced motion and anything already on screen at load just show it); only
 * numbers that start below the fold are reset to zero and animated. The number appears once in the page, so
 * selecting and copying text gives one copy. The element that contains it should carry an aria-label with the
 * final value, because the digits change while it counts.
 */
function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (element.getBoundingClientRect().top < window.innerHeight) return

    let frame = 0
    setShown(0)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION)
          setShown(Math.round(value * (1 - (1 - t) ** 3)))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      setShown(value)
    }
  }, [value])

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
    </span>
  )
}

export default CountUp
