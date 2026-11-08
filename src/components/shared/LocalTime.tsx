import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { site } from '@/data/site'
import { cn } from '@/lib/utils'

const HIDDEN_ON = ['/resume']
const format = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'America/Vancouver',
  timeZoneName: 'short',
})

/**
 * A quiet tag in the corner that shows the current time in Vancouver. It appears after a screen or two of
 * scrolling, next to the back-to-top button's rhythm, and is rendered only in the browser (the time would be stale
 * in prerendered HTML). Inert and hidden from screen readers whenever it is not showing.
 */
function LocalTime() {
  const { pathname } = useLocation()
  const [time, setTime] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const tick = () => setTime(format.format(new Date()))
    tick()
    const timer = window.setInterval(tick, 30_000)
    const update = () => setScrolled(window.scrollY > window.innerHeight * 1.5)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('scroll', update)
    }
  }, [])

  if (HIDDEN_ON.includes(pathname) || !time) return null
  const city = site.location.split(',')[0]

  return (
    <p
      inert={!scrolled}
      aria-hidden={!scrolled}
      className={cn(
        'fixed bottom-4 left-4 z-30 m-0 flex items-center gap-2 rounded-full border bg-card/90 px-3.5 py-2 font-mono text-label text-muted-foreground shadow-sm backdrop-blur-sm transition-[opacity,translate] duration-300 motion-reduce:transition-none max-[620px]:bottom-3 max-[620px]:left-3 print:hidden',
        scrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
      <span>{city}</span>
      <span aria-hidden="true">·</span>
      <time className="text-foreground tabular-nums">{time}</time>
    </p>
  )
}

export default LocalTime
