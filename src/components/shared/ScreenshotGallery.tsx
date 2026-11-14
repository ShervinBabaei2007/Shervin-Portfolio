import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize, Minus, Plus, ZoomIn } from 'lucide-react'
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import ResponsiveImage from '@/components/shared/ResponsiveImage'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import type { Screenshot } from '@/data/projects'
import { cn } from '@/lib/utils'

type ScreenshotGalleryProps = { shots: Screenshot[]; projectName: string; layout?: 'stack' | 'strip' }

/**
 * The screenshots as thumbnails; clicking one opens a viewer on this page (nothing navigates away).
 * The viewer shows the picture large, fitted to the window, with every other screenshot in a side column
 * to click through; it also responds to the arrow keys. The picture can be magnified: scroll, pinch, double-click
 * or the +/- buttons zoom, dragging pans, and the keys + - 0 work too. Arrow keys pan while zoomed in.
 */
function ScreenshotGallery({ shots, projectName, layout = 'stack' }: ScreenshotGalleryProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const shot = shots[index]
  const zoomRef = useRef<ReactZoomPanPinchRef>(null)
  const [scale, setScale] = useState(1)

  // A new picture always starts fitted to the window.
  const showAt = (next: number) => {
    setIndex(next)
    setScale(1)
  }
  // Opens the viewer on one screenshot.
  const openAt = (next: number) => {
    showAt(next)
    setOpen(true)
  }
  // Steps to the next or previous screenshot, wrapping around at either end.
  const move = (step: number) => showAt((index + step + shots.length) % shots.length)

  // Keyboard controls while the viewer is open: arrows change picture (or pan when zoomed), + - 0 zoom.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      const zoom = zoomRef.current
      // 1.01 rather than 1 so a tiny leftover zoom still counts as fitted.
      const zoomed = scale > 1.01
      const pan = (dx: number, dy: number) => zoom?.panBy(dx, dy)
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        const direction = event.key === 'ArrowRight' ? 1 : -1
        if (zoomed) pan(-direction * 80, 0)
        else move(direction)
      } else if (zoomed && event.key === 'ArrowUp') pan(0, 80)
      else if (zoomed && event.key === 'ArrowDown') pan(0, -80)
      else if (event.key === '+' || event.key === '=') zoom?.zoomIn(0.5)
      else if (event.key === '-' || event.key === '_') zoom?.zoomOut(0.5)
      else if (event.key === '0') zoom?.resetTransform()
      else return
      event.preventDefault()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
    // `move` is recreated every render; the listener is rebuilt whenever something it reads changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, scale, shots.length])

  return (
    <>
      <div className={cn('m-0 grid gap-4', layout === 'strip' ? 'grid-cols-3 max-[620px]:gap-2' : 'grid-cols-1')}>
        {shots.map((item, i) => (
          <figure key={item.src} className="m-0 min-w-0 p-0">
            <button
              type="button"
              className={cn(
                'group/shot relative grid w-full cursor-zoom-in place-items-center rounded-lg bg-background transition-shadow hover:ring-2 hover:ring-primary/60 [&_img]:block [&_img]:w-full [&_img]:object-contain',
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
              <span
                className="pointer-events-none absolute right-2 bottom-2 grid size-8 place-items-center rounded-full border bg-background/90 text-foreground shadow-sm transition-colors group-hover/shot:border-primary group-hover/shot:text-primary"
                aria-hidden="true"
              >
                <ZoomIn size={16} />
              </span>
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
            {shot.alt}. Use the arrow keys or the list to see the others. Plus and minus zoom in and out, and zero
            resets.
          </DialogDescription>
          <div className="grid max-h-[92vh] min-h-0 md:grid-cols-[minmax(0,1fr)_13rem]">
            <div className="flex min-h-0 flex-col">
              <div className="relative h-[62vh] min-h-[40vh] flex-1 bg-muted md:h-[68vh]">
                {/* Keyed by picture so each screenshot gets a fresh zoom state; 5x is the maximum zoom. */}
                <TransformWrapper
                  key={shot.src}
                  ref={zoomRef}
                  minScale={1}
                  maxScale={5}
                  centerOnInit
                  doubleClick={{ mode: 'toggle', step: 2 }}
                  wheel={{ step: 0.15 }}
                  onTransform={(_, state) => setScale(state.scale)}
                >
                  <TransformComponent
                    wrapperClass="!h-full !w-full"
                    contentClass="!h-full !w-full"
                    wrapperStyle={{ cursor: scale > 1.01 ? 'grab' : 'zoom-in' }}
                  >
                    <div className="grid size-full place-items-center px-4 pt-4 pb-16 [&_img]:block [&_img]:max-h-full [&_img]:w-auto [&_img]:max-w-full [&_img]:rounded-md [&_img]:object-contain">
                      {/* sizes is large on purpose, so the browser picks the full-size file to magnify, not the 480px copy. */}
                      <ResponsiveImage src={shot.src} alt={shot.alt} sizes="3000px" priority />
                    </div>
                  </TransformComponent>
                </TransformWrapper>
                <div
                  className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border bg-background/95 p-1 shadow-md backdrop-blur"
                  role="group"
                  aria-label="Magnifier"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-full"
                    onClick={() => zoomRef.current?.zoomOut(0.5)}
                    disabled={scale <= 1.01}
                    aria-label="Zoom out"
                  >
                    <Minus />
                  </Button>
                  <span
                    className="min-w-12 text-center font-mono text-label text-muted-foreground tabular-nums"
                    role="status"
                    aria-label={`Zoom ${Math.round(scale * 100)} percent`}
                  >
                    {Math.round(scale * 100)}%
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-full"
                    onClick={() => zoomRef.current?.zoomIn(0.5)}
                    disabled={scale >= 4.99}
                    aria-label="Zoom in"
                  >
                    <Plus />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-full"
                    onClick={() => zoomRef.current?.resetTransform()}
                    disabled={scale <= 1.01}
                    aria-label="Fit to window"
                  >
                    <Maximize />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{shot.caption}</p>
                  <p className="text-label text-muted-foreground tabular-nums">
                    {index + 1} of {shots.length}
                    <span className="max-md:hidden">
                      {' '}
                      · Scroll or pinch to zoom, drag to pan, double-click to toggle
                    </span>
                    <span className="md:hidden"> · Pinch or double-tap to zoom</span>
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
                    onClick={() => showAt(i)}
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
