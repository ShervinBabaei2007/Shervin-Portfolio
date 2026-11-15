import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { portraitSrcSet } from '@/lib/portraits'
import { softShadow } from '@/lib/surfaces'
import { cn } from '@/lib/utils'

type Photo = {
  /** File name in public/about, from `node scripts/portrait.mjs`. All are 4:5. */
  name: string
  alt: string
  /** Pixel widths of the generated files, smallest first. */
  widths: [number, number]
}

const photos: Photo[] = [
  {
    name: 'portrait-c',
    alt: 'Shervin Babaei in an olive zip hoodie on a rocky shoreline, with the water and the bay behind him',
    widths: [480, 720],
  },
  {
    name: 'portrait-a',
    alt: 'Shervin Babaei outdoors in a grey hoodie, in front of a carved wooden totem',
    widths: [320, 480],
  },
  { name: 'portrait-b', alt: 'Shervin Babaei in a red polo, seated at home', widths: [320, 480] },
]

// How long each photo stays before the next one fades in.
const INTERVAL = 3800
const sizes = '(min-width: 1024px) 340px, 90vw'

/**
 * The About section's photos: all three, stacked, taking turns. The next one fades in over a slow zoom, so the change
 * is soft, not a cut. On wide screens its height is fixed (and it stays in view while you read), so opening a card
 * beside it never resizes it, which would re-crop and visibly zoom the photo. It stops while the pointer or keyboard focus is inside, with a pause button for everyone else,
 * and it does not move at all for visitors who prefer reduced motion (the dots still switch photos by hand).
 * Every image is in the HTML from the start, so there is no pop-in and nothing to hydrate differently.
 */
function AboutPortraits() {
  const [index, setIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [focusInside, setFocusInside] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [visible, setVisible] = useState(true)
  const frame = useRef<HTMLElement>(null)

  // After mount: follow the reduced-motion setting, and only turn while the photos are on screen and the tab is open.
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    const element = frame.current
    const watcher = element
      ? new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 })
      : null
    if (element) watcher?.observe(element)
    return () => {
      media.removeEventListener('change', sync)
      watcher?.disconnect()
    }
  }, [])

  const running = !reduceMotion && !userPaused && !hovering && !focusInside && visible

  // Restarts the clock whenever the photo changes, so a manual click gets a full turn too.
  useEffect(() => {
    if (!running) return
    const timer = window.setTimeout(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % photos.length)
    }, INTERVAL)
    return () => window.clearTimeout(timer)
  }, [running, index])

  const show = useCallback((next: number) => setIndex(next), [])

  return (
    <figure
      ref={frame}
      aria-label="Photos of Shervin"
      className={cn(
        'group relative m-0 aspect-[4/5] max-w-[420px] overflow-hidden rounded-2xl border bg-card max-lg:mx-auto max-lg:w-full lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:aspect-auto lg:h-[33.5rem] lg:max-w-none',
        softShadow,
      )}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocus={() => setFocusInside(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusInside(false)
      }}
    >
      {photos.map((photo, position) => {
        const active = position === index
        const large = photo.widths[1]
        return (
          <picture key={photo.name}>
            <source type="image/avif" srcSet={portraitSrcSet(photo.name, photo.widths, 'avif')} sizes={sizes} />
            <source type="image/webp" srcSet={portraitSrcSet(photo.name, photo.widths, 'webp')} sizes={sizes} />
            <img
              src={`/about/${photo.name}-${large}.jpg`}
              srcSet={portraitSrcSet(photo.name, photo.widths, 'jpg')}
              sizes={sizes}
              width={large}
              height={Math.round(large * 1.25)}
              alt={active ? photo.alt : ''}
              aria-hidden={!active}
              loading="lazy"
              decoding="async"
              className={cn(
                'absolute inset-0 size-full object-cover object-[50%_25%]',
                // A slow zoom while a photo is showing and a long soft fade between photos (motion-safe only).
                'motion-safe:transition-[opacity,transform] motion-safe:duration-[1400ms,6000ms] motion-safe:ease-in-out',
                active ? 'opacity-100 motion-safe:scale-[1.06]' : 'opacity-0',
              )}
            />
          </picture>
        )
      })}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border bg-background/85 px-3 py-1.5 backdrop-blur-sm">
        <div className="flex items-center gap-2" role="group" aria-label="Choose a photo">
          {photos.map((photo, position) => (
            <button
              key={photo.name}
              type="button"
              className="hit-area relative grid size-4 cursor-pointer place-items-center rounded-full"
              aria-label={`Show photo ${position + 1} of ${photos.length}`}
              aria-current={position === index ? 'true' : undefined}
              onClick={() => show(position)}
            >
              <span
                className={cn(
                  'block h-2 rounded-full transition-[width,background-color] duration-300',
                  position === index ? 'w-5 bg-primary' : 'w-2 bg-muted-foreground/50',
                )}
              />
            </button>
          ))}
        </div>
        {!reduceMotion && (
          <button
            type="button"
            className="hit-area relative grid size-5 cursor-pointer place-items-center rounded-full text-muted-foreground hover:text-foreground"
            aria-label={userPaused ? 'Play the photo slideshow' : 'Pause the photo slideshow'}
            aria-pressed={userPaused}
            onClick={() => setUserPaused((paused) => !paused)}
          >
            {userPaused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
          </button>
        )}
      </div>
    </figure>
  )
}

export default AboutPortraits
