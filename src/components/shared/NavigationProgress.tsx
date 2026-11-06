import { useEffect, useState, useSyncExternalStore } from 'react'
import { pageLoadStore } from '@/lazyPage'

/**
 * A thin bar across the top of the window while the next page's code is downloading. Navigations keep the
 * current page on screen until the next one is ready, so without this a slow connection looks like a dead link.
 * It waits 150 ms before appearing, so fast loads never flash it. It renders nothing on the server.
 */
function NavigationProgress() {
  const waiting = useSyncExternalStore(pageLoadStore.subscribe, pageLoadStore.isWaiting, () => false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!waiting) {
      setVisible(false)
      return
    }
    const timer = window.setTimeout(() => setVisible(true), 150)
    return () => window.clearTimeout(timer)
  }, [waiting])

  return (
    <>
      {visible && (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden print:hidden"
          aria-hidden="true"
          data-nav-progress
        >
          {/* With reduced motion the bar is simply full width instead of sliding. */}
          <div className="h-full w-1/3 animate-nav-progress bg-primary motion-reduce:w-full motion-reduce:animate-none" />
        </div>
      )}
      <p className="sr-only" role="status">
        {visible ? 'Loading page' : ''}
      </p>
    </>
  )
}

export default NavigationProgress
