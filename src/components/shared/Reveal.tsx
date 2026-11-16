import { useEffect, useRef, type ReactElement } from 'react'
import { Slot } from 'radix-ui'
import { loadGsap } from '@/lib/motion'

/**
 * Rises its single child into place with GSAP the first time it scrolls into view. The child keeps its own element
 * (no wrapper), so grid and flex layouts are untouched.
 *
 * The markup is visible by default: the hidden state is only applied after mount, and only to elements that start
 * below the fold. So the prerendered HTML, no-JS visitors, crawlers, print and reduced-motion users all see the
 * content immediately. If GSAP cannot load, the element is simply shown.
 */
function Reveal({ children, delay = 0 }: { children: ReactElement; delay?: number }) {
  const ref = useRef<HTMLElement>(null)

  // Hide below-the-fold elements after mount, then animate each in once it is 8% into the screen.
  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (element.getBoundingClientRect().top < window.innerHeight) return // already on screen

    element.dataset.reveal = 'pending' // hidden by tailwind.css until it arrives; print always shows it
    const gsap = loadGsap() // starts the download now, so it is ready before the element arrives
    let stopTween = () => {}
    const show = () => delete element.dataset.reveal
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        gsap.then((g) => {
          if (element.dataset.reveal !== 'pending') return // unmounted meanwhile
          const tween = g.fromTo(
            element,
            { opacity: 0, y: 48 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              delay,
              ease: 'expo.out',
              clearProps: 'opacity,transform',
              onComplete: show,
            },
          )
          element.dataset.reveal = 'animating'
          stopTween = () => {
            tween.kill()
            g.set(element, { clearProps: 'opacity,transform' })
          }
        }, show)
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      stopTween()
      show()
    }
  }, [delay])

  return <Slot.Root ref={ref}>{children}</Slot.Root>
}

export default Reveal
