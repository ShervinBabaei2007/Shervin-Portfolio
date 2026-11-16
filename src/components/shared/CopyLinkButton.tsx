import { Check, Link2 } from 'lucide-react'
import { useCopy } from '@/hooks/useCopy'

/** Copies the current page address, and says so on the button for a couple of seconds. */
function CopyLinkButton() {
  const { copied, failed, copy } = useCopy()
  let label = 'Copy link'
  if (copied) label = 'Link copied'
  else if (failed) label = 'Copy blocked'

  return (
    <button
      type="button"
      onClick={() => void copy(window.location.href)}
      className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-foreground/25 bg-transparent px-4 font-mono text-[13px] text-foreground transition-colors hover:bg-foreground hover:text-background print:hidden pointer-coarse:h-11"
    >
      {copied ? <Check size={15} aria-hidden="true" /> : <Link2 size={15} aria-hidden="true" />}
      <span aria-live="polite">{label}</span>
    </button>
  )
}

export default CopyLinkButton
