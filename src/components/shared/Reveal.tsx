import { useEffect, useRef, type ReactElement } from 'react'
import { Slot } from 'radix-ui'

/**
 * Fades its single child up the first time it scrolls into view. The child keeps its own
 * element (no wrapper), so grid and flex layouts are untouched.
 *
 * The markup is visible by default: the hidden state is only applied after mount, and only
 * to elements that start below the fold. So the prerendered HTML, no-JS visitors, crawlers,
 * print and reduced-motion users all see the content immediately. The styles are in tailwind.css.
 */
function Reveal({ children, delay = 0 }: { children: ReactElement; delay?: number }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (element.getBoundingClientRect().top < window.innerHeight) return // already on screen

    element.dataset.reveal = 'pending'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        element.dataset.reveal = 'in'
        observer.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      delete element.dataset.reveal
    }
  }, [])

  return (
    <Slot.Root ref={ref} style={delay ? ({ '--reveal-delay': `${delay}s` } as React.CSSProperties) : undefined}>
      {children}
    </Slot.Root>
  )
}

export default Reveal
