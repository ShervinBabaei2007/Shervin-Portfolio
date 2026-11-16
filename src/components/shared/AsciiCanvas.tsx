import { useEffect, useRef } from 'react'

/**
 * The full-bleed ASCII field behind the hero (see lib/asciiField). Its code downloads once the browser is idle, so
 * it never competes with the first paint; until then the canvas is simply empty.
 */
function AsciiCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let stop: (() => void) | undefined
    let cancelled = false
    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 600))
    idle(() => {
      void import('@/lib/asciiField')
        .then(({ startAsciiField }) => {
          if (cancelled || !canvas.current) return
          const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
          stop = startAsciiField(canvas.current, { motion })
        })
        .catch(() => {})
    })
    return () => {
      cancelled = true
      stop?.()
    }
  }, [])

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-[calc(50%-50vw)] block h-full w-screen [mask-image:linear-gradient(180deg,#000_0%,#000_60%,transparent_100%)] text-foreground print:hidden"
    />
  )
}

export default AsciiCanvas
