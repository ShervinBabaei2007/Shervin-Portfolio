import type Lenis from 'lenis'

/**
 * Scroll motion: Lenis for eased mouse-wheel scrolling on desktop, and GSAP for the scroll reveals.
 * Both are downloaded after the page is interactive, so neither counts against the first load.
 *
 * Lenis still scrolls the real page (it calls window.scrollTo), so sticky elements and scroll events keep working
 * without extra wiring. Its frame loop runs only while a glide is in progress; an idle page asks for
 * no animation frames at all.
 */

// How quickly the page catches up with the wheel (Lenis' lerp): lower is heavier. At 0.075 the page trails the
// wheel and coasts to a stop over about a second, so fast scrolling still feels unhurried.
const LERP = 0.075
// Keys that scroll the page; pressing one hands control back to the browser mid-glide.
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '])

let lenis: Lenis | null = null
let frame = 0
let clock = 0
let lastTime = 0

// Lenis is fed its own clock, advanced at most 50 ms a frame, so a glide that starts after a pause does not jump.
function tick(time: number) {
  clock += Math.min(50, time - lastTime)
  lastTime = time
  lenis?.raf(clock)
  frame = lenis?.isScrolling === 'smooth' ? requestAnimationFrame(tick) : 0
}

/** Ends a glide in progress (stop and start is Lenis' public way to reset), handing the scroll back to the browser. */
function halt() {
  if (!lenis) return
  lenis.stop()
  lenis.start()
}

/** Runs Lenis' frame loop until the current glide settles. */
function wake() {
  if (frame || !lenis) return
  lastTime = performance.now()
  frame = requestAnimationFrame(tick)
}

/** Turns on eased wheel scrolling once, on devices with a mouse, unless the visitor prefers reduced motion. */
export async function startSmoothScroll() {
  if (lenis || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const { default: LenisClass } = await import('lenis')
  lenis = new LenisClass({
    lerp: LERP,
    // Inner areas that can still scroll (code blocks, the contents rail) scroll themselves.
    allowNestedScroll: true,
    // Leave the wheel alone while a dialog or menu holds the scroll (Radix marks the body), and inside those layers.
    prevent: (node) =>
      document.body.hasAttribute('data-scroll-locked') ||
      node.matches('[role="dialog"], [role="menu"], [data-radix-popper-content-wrapper]'),
  })
  // Lenis handles the wheel first (it listened first), so by now a glide may have started.
  window.addEventListener('wheel', wake, { passive: true })
  const handBack = (event: Event) => {
    if (event instanceof KeyboardEvent && !SCROLL_KEYS.has(event.key)) return
    if (lenis?.isScrolling === 'smooth') halt()
  }
  window.addEventListener('keydown', handBack)
  window.addEventListener('pointerdown', handBack)
}

/** Stops a glide in progress so the browser can jump somewhere (a new page, a #section). */
export function haltSmoothScroll() {
  if (lenis?.isScrolling === 'smooth') halt()
}

/** Glides back to the top with Lenis when it is running; otherwise returns false so the caller scrolls natively. */
export function smoothScrollToTop() {
  if (!lenis) return false
  lenis.scrollTo(0)
  wake()
  return true
}

let gsapModule: Promise<typeof import('gsap').gsap> | null = null

/**
 * Loads GSAP once, for the scroll reveals. ScrollTrigger is left out on purpose: it keeps a requestAnimationFrame loop
 * running for as long as it is enabled, while GSAP alone sleeps once nothing is animating. Reveals only need to know
 * when an element arrives, which an IntersectionObserver tells them (see Reveal.tsx).
 */
export function loadGsap() {
  gsapModule ??= import('gsap').then(({ gsap }) => {
    // GSAP checks whether it can sleep every 120 frames (2 s) by default; every 20 frames stops an idle page sooner.
    gsap.config({ autoSleep: 20 })
    return gsap
  })
  return gsapModule
}
