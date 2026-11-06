import { useEffect, useState } from 'react'

/**
 * Returns the id of the section currently near the middle of the screen, or null while none of
 * them is (for example on the hero). Only observes while `enabled`, so other pages do no work.
 */
export function useActiveSection(ids: readonly string[], enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join(',')

  useEffect(() => {
    if (!enabled) {
      setActive(null)
      return
    }
    const elements = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      // A band across the upper-middle of the screen: a section is "current" once it reaches it.
      { rootMargin: '-28% 0px -58% 0px', threshold: 0 },
    )
    elements.forEach((element) => observer.observe(element))

    // Back above the first tracked section (the hero): nothing is current.
    const onScroll = () => {
      const first = elements[0]
      if (first && first.getBoundingClientRect().top > window.innerHeight * 0.72) setActive(null)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [key, enabled])

  return active
}
