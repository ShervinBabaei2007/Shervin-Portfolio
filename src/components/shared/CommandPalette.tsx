import { lazy, Suspense, useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'

const CommandPaletteDialog = lazy(() => import('./CommandPaletteDialog'))

/** Opens from anywhere with Ctrl/⌘ + K, or from the trigger button in the hero. The dialog loads on first open. */
function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [everOpened, setEverOpened] = useState(false)

  useEffect(() => {
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
        variant="outline"
        className="justify-between gap-6 text-muted-foreground"
        onClick={openPalette}
      >
        <span className="inline-flex items-center gap-2">
          <Search /> Search portfolio...
        </span>
        <span className="inline-flex items-center gap-1" aria-hidden="true">
          <Kbd>Ctrl</Kbd>
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
