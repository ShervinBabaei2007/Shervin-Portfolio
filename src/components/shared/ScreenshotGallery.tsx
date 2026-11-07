import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ResponsiveImage from '@/components/shared/ResponsiveImage'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import images from '@/data/images.json'
import type { Screenshot } from '@/data/projects'
import { cn } from '@/lib/utils'

const catalog = images as Record<string, { width: number }>

type ScreenshotGalleryProps = { shots: Screenshot[]; projectName: string; layout?: 'stack' | 'strip' }

/**
 * The screenshots as thumbnails; clicking one opens a viewer on this page (nothing navigates away).
 * The viewer shows the picture large with every other screenshot in a side column to click through,
 * and also responds to the arrow keys.
 */
function ScreenshotGallery({ shots, projectName, layout = 'stack' }: ScreenshotGalleryProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  // Click (or tap) the picture to see it at its real size. Zoomed in, a mouse pans by moving over the picture;
  // touch and keyboard scroll the area as usual.
  const [zoomed, setZoomed] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const shot = shots[index]

  const openAt = (next: number) => {
    setIndex(next)
    setOpen(true)
  }
  const pan = (event: React.MouseEvent) => {
    const area = scroller.current
    if (!zoomed || !area) return
    const box = area.getBoundingClientRect()
    area.scrollLeft = ((event.clientX - box.left) / box.width) * (area.scrollWidth - area.clientWidth)
    area.scrollTop = ((event.clientY - box.top) / box.height) * (area.scrollHeight - area.clientHeight)
  }
  const move = (step: number) => setIndex((current) => (current + step + shots.length) % shots.length)

  // A new picture, or reopening the viewer, starts fitted to the window.
  useEffect(() => setZoomed(false), [index, open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') move(1)
      else if (event.key === 'ArrowLeft') move(-1)
      else return
      event.preventDefault()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
    // `move` only depends on the number of screenshots, which never changes while open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, shots.length])

  return (
    <>
      <div className={cn('m-0 grid gap-4', layout === 'strip' ? 'grid-cols-3 max-[620px]:gap-2' : 'grid-cols-1')}>
        {shots.map((item, i) => (
          <figure key={item.src} className="m-0 min-w-0 p-0">
            <button
              type="button"
              className={cn(
                'grid w-full cursor-zoom-in place-items-center rounded-lg bg-background transition-shadow hover:ring-2 hover:ring-primary/60 [&_img]:block [&_img]:w-full [&_img]:object-contain',
                layout === 'strip'
                  ? 'min-h-[150px] max-[620px]:min-h-[140px] [&_img]:h-[clamp(190px,30svh,300px)] max-[620px]:[&_img]:h-[170px]'
                  : 'min-h-[180px] max-[620px]:min-h-[220px] [&_img]:h-[clamp(190px,27svh,270px)] max-[620px]:[&_img]:h-[280px]',
              )}
              onClick={() => openAt(i)}
              aria-label={`Enlarge screenshot: ${item.caption}`}
              aria-haspopup="dialog"
            >
              <ResponsiveImage
                src={item.src}
                alt={item.alt}
                sizes={layout === 'strip' ? '(max-width: 900px) 30vw, 380px' : '(max-width: 900px) 92vw, 380px'}
              />
            </button>
            <figcaption className="pt-2 text-sm text-muted-foreground">{item.caption}</figcaption>
          </figure>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] w-[calc(100%-1.5rem)] gap-0 overflow-hidden p-0 sm:max-w-5xl">
          <DialogTitle className="sr-only">
            {projectName} screenshot {index + 1} of {shots.length}: {shot.caption}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {shot.alt}. Use the arrow keys or the list to see the others.
          </DialogDescription>
          <div className="grid max-h-[92vh] min-h-0 md:grid-cols-[minmax(0,1fr)_13rem]">
            <div className="flex min-h-0 flex-col">
              <div
                ref={scroller}
                onMouseMove={pan}
                className={cn(
                  'flex min-h-[40vh] flex-1 overflow-auto bg-muted p-4',
                  zoomed ? 'items-start justify-start' : 'items-start justify-center md:items-center',
                )}
              >
                <button
                  type="button"
                  className={cn(
                    'block shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_img]:block [&_img]:rounded-md [&_img]:object-contain',
                    zoomed
                      ? 'cursor-zoom-out [&_img]:max-h-none [&_img]:w-full [&_img]:max-w-none'
                      : 'cursor-zoom-in [&_img]:mx-auto [&_img]:max-h-[68vh] [&_img]:w-auto [&_img]:max-w-full',
                  )}
                  style={zoomed ? { width: catalog[shot.src]?.width } : undefined}
                  onClick={() => setZoomed((current) => !current)}
                  aria-pressed={zoomed}
                  aria-label={zoomed ? 'Zoom out to fit the window' : 'Zoom in to actual size'}
                >
                  <ResponsiveImage
                    key={shot.src}
                    src={shot.src}
                    alt={shot.alt}
                    sizes={zoomed ? `${catalog[shot.src]?.width ?? 1000}px` : '(max-width: 768px) 92vw, 700px'}
                    priority
                  />
                </button>
              </div>
              <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{shot.caption}</p>
                  <p className="text-label text-muted-foreground tabular-nums">
                    {index + 1} of {shots.length}
                    {' · '}Click the picture to {zoomed ? 'fit it again' : 'zoom in'}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => move(-1)}
                    aria-label="Previous screenshot"
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => move(1)}
                    aria-label="Next screenshot"
                  >
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            </div>
            <ul
              className="m-0 flex list-none gap-2 overflow-auto border-t bg-card p-3 md:grid md:content-start md:border-t-0 md:border-l"
              aria-label="All screenshots"
            >
              {shots.map((item, i) => (
                <li key={item.src} className="shrink-0 max-md:w-24">
                  <button
                    type="button"
                    className={cn(
                      'grid h-28 w-full place-items-center overflow-hidden rounded-md border bg-background p-1 transition-colors md:h-32',
                      i === index ? 'border-primary ring-2 ring-primary/40' : 'hover:border-primary/60',
                    )}
                    onClick={() => setIndex(i)}
                    aria-label={`Show screenshot ${i + 1}: ${item.caption}`}
                    aria-current={i === index ? 'true' : undefined}
                  >
                    <ResponsiveImage src={item.src} alt="" sizes="160px" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ScreenshotGallery
