import { Check, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCopy } from '@/hooks/useCopy'

/** Copies the current page address, and says so on the button for a couple of seconds. */
function CopyLinkButton() {
  const { copied, failed, copy } = useCopy()
  let label = 'Copy link'
  if (copied) label = 'Link copied'
  else if (failed) label = 'Copy blocked'

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => void copy(window.location.href)}
      className="print:hidden"
    >
      {copied ? <Check /> : <Link2 />}
      <span aria-live="polite">{label}</span>
    </Button>
  )
}

export default CopyLinkButton
