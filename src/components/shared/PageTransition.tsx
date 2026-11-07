import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Fades the new page in (a 6px rise over 0.2 s) when the route changes. The first page is never animated, so
 * the prerendered HTML, the first paint and the hydrated page are identical. Nothing waits on it: the old page
 * stays until the new one is ready, and the new one is readable from the first frame.
 */
function PageTransition({ pathname, children }: { pathname: string; children: ReactNode }) {
  const firstPage = useRef(true)
  const animate = !firstPage.current
  useEffect(() => {
    firstPage.current = false
  }, [])

  return (
    <div key={pathname} className={animate ? 'animate-page-in' : undefined}>
      {children}
    </div>
  )
}

export default PageTransition
