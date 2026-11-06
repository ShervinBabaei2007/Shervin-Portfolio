import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'

/** A hairline under the header showing how far down the page you are. Purely visual, so hidden from assistive tech. */
function ScrollProgress() {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setValue(scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <Progress
      value={value}
      aria-hidden="true"
      data-progress={Math.round(value)}
      className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 rounded-none bg-transparent [&_[data-slot=progress-indicator]]:transition-none"
    />
  )
}

export default ScrollProgress
