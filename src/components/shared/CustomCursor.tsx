import { useEffect, useRef } from 'react'

/**
 * A terracotta dot that follows the mouse exactly, with a ring that eases after it. Over a small control (a nav link,
 * a pill, a chip) the ring lets go of the pointer and outlines the control instead; over a larger one it grows. Over a project card it fills and says "view". A click fills the ring and sends a pulse
 * out from its edge. Text fields, the screenshot magnifier and inspect mode get the native cursor back.
 *
 * Mouse only: App.tsx loads this on desktop, and touch or pen input hands back the native cursor. The arrow is hidden
 * (the `custom-cursor` class, see tailwind.css) only after the first mouse move, so a page whose script never runs
 * keeps its normal cursor. Like the scroll glide in motion.ts, the ring's frame loop stops once it catches up.
 */

const INTERACTIVE =
  'a[href], button:not(:disabled), summary, label, select, [role="button"], [role="tab"], [role="option"], [role="menuitem"], [role="radio"], [role="checkbox"], [role="switch"]'
const NATIVE =
  'input:not([type="checkbox"], [type="radio"], [type="button"], [type="submit"], [type="reset"], [type="range"], [type="color"], [type="file"]), textarea, [contenteditable]:not([contenteditable="false"]), [data-cursor="native"]'
// How far the ring closes the gap each 60 Hz frame: quick enough to keep up, slow enough to be seen trailing.
const EASE = 0.2
// Controls up to this size get outlined; bigger ones (and links that wrap onto two lines) get the grown circle.
const SNAP_MAX = { width: 320, height: 56 }
// The gap between a control and its outline: snug above and below, a little room at the sides.
const SNAP_PAD = { x: 4, y: 1 }

type State = 'idle' | 'hover' | 'snap' | 'view' | 'hidden'

function resolve(element: Element | null): { state: State; target?: Element } {
  if (!element || document.documentElement.hasAttribute('data-native-cursor')) return { state: 'hidden' }
  if (element.closest(NATIVE)) return { state: 'hidden' }
  if (element.closest('[data-cursor="view"]')) return { state: 'view' }
  const target = element.closest(INTERACTIVE)
  if (!target) return { state: 'idle' }
  const box = target.getBoundingClientRect()
  const fits = box.width <= SNAP_MAX.width && box.height <= SNAP_MAX.height && target.getClientRects().length === 1
  return { state: fits ? 'snap' : 'hover', target }
}

function CustomCursor() {
  const layer = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const shape = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = { x: 0, y: 0 }
    // Where the ring is heading (the pointer, or the middle of an outlined control) and where it is now.
    const goal = { x: 0, y: 0 }
    const trail = { x: 0, y: 0 }
    let snapped: Element | undefined
    let frame = 0
    let lastTime = 0
    let seen = false

    const placeRing = () => {
      if (ring.current) ring.current.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`
    }

    const tick = (time: number) => {
      // Scaled by the frame time, so the ring trails the same on 60 Hz and 144 Hz screens.
      const step = 1 - Math.pow(1 - EASE, Math.min(50, time - lastTime) / (1000 / 60))
      lastTime = time
      trail.x += (goal.x - trail.x) * step
      trail.y += (goal.y - trail.y) * step
      const settled = Math.abs(goal.x - trail.x) < 0.1 && Math.abs(goal.y - trail.y) < 0.1
      if (settled) {
        trail.x = goal.x
        trail.y = goal.y
      }
      placeRing()
      frame = settled ? 0 : requestAnimationFrame(tick)
    }

    const glide = () => {
      if (still.matches) {
        trail.x = goal.x
        trail.y = goal.y
        placeRing()
      } else if (!frame) {
        lastTime = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }

    /** Points the ring at what is under the pointer: the pointer itself, or the outline of a small control. */
    const update = (element: Element | null) => {
      const { state, target } = resolve(element)
      if (layer.current) layer.current.dataset.state = state
      const outline = shape.current?.style
      if (state === 'snap' && target && outline) {
        const box = target.getBoundingClientRect()
        const radius = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 6
        outline.width = `${box.width + SNAP_PAD.x * 2}px`
        outline.height = `${box.height + SNAP_PAD.y * 2}px`
        outline.borderRadius = `${Math.min(radius, box.height / 2) + SNAP_PAD.y}px`
        goal.x = box.left + box.width / 2
        goal.y = box.top + box.height / 2
      } else {
        if (snapped && outline) {
          outline.width = ''
          outline.height = ''
          outline.borderRadius = ''
        }
        goal.x = pointer.x
        goal.y = pointer.y
      }
      snapped = state === 'snap' ? target : undefined
      glide()
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        root.classList.remove('custom-cursor')
        if (layer.current) layer.current.dataset.state = 'hidden'
        return
      }
      root.classList.add('custom-cursor')
      pointer.x = event.clientX
      pointer.y = event.clientY
      if (dot.current) dot.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`
      // The first move places the ring on the pointer instead of gliding in from the corner.
      if (!seen) {
        seen = true
        trail.x = pointer.x
        trail.y = pointer.y
        placeRing()
      }
      update(event.target instanceof Element ? event.target : null)
    }
    // Scrolling moves the page under a still pointer, so check what it is over now.
    const onScroll = () => {
      if (seen && root.classList.contains('custom-cursor')) update(document.elementFromPoint(pointer.x, pointer.y))
    }
    const onLeave = (event: PointerEvent) => {
      if (!event.relatedTarget && layer.current) layer.current.dataset.state = 'hidden'
    }
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      layer.current?.setAttribute('data-pressed', '')
      // Restart the pulse, even mid-way through the last one.
      const outline = shape.current
      if (!outline) return
      outline.classList.remove('cursor-pulse')
      void outline.offsetWidth
      outline.classList.add('cursor-pulse')
    }
    const onUp = () => layer.current?.removeAttribute('data-pressed')
    const onPulseEnd = () => shape.current?.classList.remove('cursor-pulse')

    const outline = shape.current
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointerout', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('blur', onUp)
    outline?.addEventListener('animationend', onPulseEnd)
    return () => {
      cancelAnimationFrame(frame)
      root.classList.remove('custom-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('pointerout', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('blur', onUp)
      outline?.removeEventListener('animationend', onPulseEnd)
    }
  }, [])

  return (
    <div
      ref={layer}
      aria-hidden="true"
      data-custom-cursor
      data-state="hidden"
      className="group pointer-events-none fixed inset-0 z-[200] overflow-hidden print:hidden"
    >
      <div ref={ring} className="absolute top-0 left-0 will-change-transform">
        <div
          ref={shape}
          className="grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[1.5px] border-primary/50 transition-[width,height,border-radius,background-color,border-color,opacity,scale] duration-200 ease-out group-data-pressed:scale-[0.8] group-data-pressed:bg-primary/25 group-data-[state=hidden]:opacity-0 group-data-[state=hover]:size-12 group-data-[state=hover]:border-foreground/60 group-data-[state=hover]:bg-primary/10 group-data-[state=snap]:border-2 group-data-[state=snap]:border-primary group-data-[state=view]:size-[72px] group-data-[state=view]:border-primary group-data-[state=view]:bg-primary group-[[data-state=snap][data-pressed]]:scale-[0.94] group-[[data-state=snap][data-pressed]]:bg-primary/15 group-[[data-state=view][data-pressed]]:bg-primary"
        >
          <span className="font-mono text-[12px] text-primary-foreground opacity-0 transition-opacity duration-200 group-data-[state=view]:opacity-100">
            view
          </span>
        </div>
      </div>
      <div ref={dot} className="absolute top-0 left-0 will-change-transform">
        <div className="size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-[scale,opacity] duration-200 ease-out group-data-pressed:scale-150 group-data-[state=hidden]:opacity-0 group-data-[state=hover]:scale-0 group-data-[state=view]:scale-0" />
      </div>
    </div>
  )
}

export default CustomCursor
