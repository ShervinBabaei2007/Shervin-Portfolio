import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import LazyBoundary from '@/components/shared/LazyBoundary'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'

const CommandPaletteDialog = lazy(() => import('./CommandPaletteDialog'))

/** Opens from anywhere with Ctrl/⌘ + K, or from the header trigger. The dialog loads on first open. */
function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [everOpened, setEverOpened] = useState(false)
  // Server render and first paint say Ctrl; Mac and iOS get ⌘ after mount.
  const [isMac, setIsMac] = useState(false)
  // The dialog has no trigger element, and Radix only returns focus to a trigger. So remember what had focus when
  // the palette opened and put focus back there when it closes, or keyboard users land on the page body.
  const opener = useRef<HTMLElement | null>(null)
  const wasOpen = useRef(false)
  const rememberOpener = () => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
  }
  useEffect(() => {
    if (open) wasOpen.current = true
    else if (wasOpen.current) {
      wasOpen.current = false
      const target = opener.current
      window.setTimeout(() => target?.focus(), 0)
    }
  }, [open])

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/i.test(navigator.platform))
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        rememberOpener()
        setEverOpened(true)
        setOpen((current) => !current)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const openPalette = () => {
    rememberOpener()
    setEverOpened(true)
    setOpen(true)
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground max-[620px]:size-11"
        onClick={openPalette}
        aria-label="Search portfolio"
      >
        <Search />
        {/* The label and shortcut hint need room: below 1180px the header would run the nav into them. */}
        <span className="hidden min-[1180px]:inline">Search</span>
        <span className="hidden items-center gap-1 min-[1180px]:inline-flex" aria-hidden="true">
          <Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd>
          <Kbd>K</Kbd>
        </span>
      </Button>
      {everOpened && (
        <LazyBoundary
          label="Search"
          onFail={() => {
            setOpen(false)
            setEverOpened(false)
          }}
        >
          <Suspense fallback={null}>
            <CommandPaletteDialog open={open} onOpenChange={setOpen} />
          </Suspense>
        </LazyBoundary>
      )}
    </>
  )
}

export default CommandPalette
