import { lazy, Suspense, useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'

const CommandPaletteDialog = lazy(() => import('./CommandPaletteDialog'))

/** Opens from anywhere with Ctrl/⌘ + K, or from the header trigger. The dialog loads on first open. */
function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [everOpened, setEverOpened] = useState(false)
  // Server render and first paint say Ctrl; Mac and iOS get ⌘ after mount.
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/i.test(navigator.platform))
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setEverOpened(true)
        setOpen((current) => !current)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const openPalette = () => {
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
        <span className="hidden lg:inline">Search</span>
        <span className="hidden items-center gap-1 lg:inline-flex" aria-hidden="true">
          <Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd>
          <Kbd>K</Kbd>
        </span>
      </Button>
      {everOpened && (
        <Suspense fallback={null}>
          <CommandPaletteDialog open={open} onOpenChange={setOpen} />
        </Suspense>
      )}
    </>
  )
}

export default CommandPalette
