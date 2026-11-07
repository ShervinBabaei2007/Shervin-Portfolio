import { Check, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCopy } from '@/hooks/useCopy'

/** Copies the current page address, and says so on the button for a couple of seconds. */
function CopyLinkButton() {
  const { copied, failed, copy } = useCopy()
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => void copy(window.location.href)}
      className="print:hidden"
    >
      {copied ? <Check /> : <Link2 />}
      <span aria-live="polite">{copied ? 'Link copied' : failed ? 'Copy blocked' : 'Copy link'}</span>
    </Button>
  )
}

export default CopyLinkButton
