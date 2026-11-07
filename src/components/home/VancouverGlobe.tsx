import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import type { COBEOptions } from 'cobe'

// The globe library and the animation code are only downloaded when the globe is about to scroll into view.
const Globe = lazy(() => import('@/components/ui/globe').then((module) => ({ default: module.Globe })))

const VANCOUVER: [number, number] = [49.2827, -123.1207]

const palette = {
  dark: {
    dark: 1,
    diffuse: 1.4,
    mapBrightness: 5,
    baseColor: [0.22, 0.27, 0.5],
    markerColor: [0.54, 0.64, 1],
    glowColor: [0.12, 0.17, 0.4],
  },
  light: {
    dark: 0,
    diffuse: 1.1,
    mapBrightness: 1.4,
    baseColor: [1, 1, 1],
    markerColor: [0.25, 0.32, 0.88],
    glowColor: [0.85, 0.89, 1],
  },
} as const

const clock = new Intl.DateTimeFormat('en-CA', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Vancouver' })

/** A slowly turning globe pinned on Vancouver, with the local time there. It is decoration, so it is hidden from assistive tech. */
function VancouverGlobe() {
  const frame = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const root = document.documentElement
    const sync = () => setIsDark(root.classList.contains('dark'))
    sync()
    const themeWatcher = new MutationObserver(sync)
    themeWatcher.observe(root, { attributes: true, attributeFilter: ['class'] })

    const tick = () => setTime(clock.format(new Date()))
    tick()
    const timer = window.setInterval(tick, 20_000)

    let viewWatcher: IntersectionObserver | undefined
    if (frame.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      viewWatcher = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          setVisible(true)
          viewWatcher?.disconnect()
        },
        { rootMargin: '200px' },
      )
      viewWatcher.observe(frame.current)
    }
    return () => {
      themeWatcher.disconnect()
      viewWatcher?.disconnect()
      clearInterval(timer)
    }
  }, [])

  const config = useMemo(
    () =>
      ({
        width: 800,
        height: 800,
        onRender: () => {},
        devicePixelRatio: 2,
        // cobe phi is the rotation around the poles: 0.35 faces British Columbia, then it turns slowly.
        phi: 0.35,
        theta: 0.35,
        mapSamples: 16000,
        ...palette[isDark ? 'dark' : 'light'],
        markers: [{ location: VANCOUVER, size: 0.09 }],
      }) as unknown as COBEOptions,
    [isDark],
  )

  return (
    <div
      ref={frame}
      className="relative h-[230px] overflow-hidden rounded-xl border bg-card/40 [mask-image:linear-gradient(#000_70%,transparent)] max-[620px]:h-[190px] print:hidden"
      aria-hidden="true"
      data-globe
    >
      {visible && (
        <Suspense fallback={null}>
          <Globe config={config} className="top-[18px] max-w-[460px] max-[620px]:max-w-[360px]" />
        </Suspense>
      )}
      <p className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 font-mono text-label backdrop-blur-sm">
        <MapPin size={13} className="text-primary" />
        Vancouver, BC
        {time && <span className="text-muted-foreground">· {time} local</span>}
      </p>
    </div>
  )
}

export default VancouverGlobe
