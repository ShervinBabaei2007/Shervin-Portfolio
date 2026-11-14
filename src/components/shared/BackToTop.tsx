import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** A round button that appears after a couple of screens of scrolling and returns you to the top of the page. */
function BackToTop() {
  const [visible, setVisible] = useState(false)

  // Show the button once the visitor is more than 1.5 screens down.
  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * 1.5)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  // Scroll up, then move keyboard focus to the main content so the next Tab starts from the top.
  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    document.getElementById('main')?.focus({ preventScroll: true })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        'fixed right-4 bottom-4 z-30 size-11 rounded-full bg-card shadow-md transition-[opacity,translate] duration-200 motion-reduce:transition-none max-[620px]:right-3 max-[620px]:bottom-3 print:hidden',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <ArrowUp />
    </Button>
  )
}

export default BackToTop
