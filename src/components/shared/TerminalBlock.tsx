import { blockBar, blockCaption, blockFrame, blockPre } from '@/components/shared/blockStyles'
import { cn } from '@/lib/utils'

type TerminalBlockProps = {
  title: string
  transcript: string
  maxLines?: number
  showCaption?: boolean
  /** Extra classes for the outer figure (spacing and width come from the parent). */
  className?: string
  /** Extra classes for the <pre>. */
  preClassName?: string
}

const dot = 'size-[9px] rounded-full bg-[#3b4a68]'

/** A recorded session from the real program, not a mock-up. */
function TerminalBlock({
  title,
  transcript,
  maxLines,
  showCaption = true,
  className,
  preClassName,
}: TerminalBlockProps) {
  const lines = transcript.split('\n')
  const visible = maxLines ? lines.slice(0, maxLines) : lines

  return (
    <figure className={cn(blockFrame, className)} data-terminal-block>
      <div className={cn(blockBar, 'justify-start gap-1.5')}>
        <span className={dot} />
        <span className={dot} />
        <span className={dot} />
        <b className="ml-2 font-normal">{title}</b>
      </div>
      <pre
        className={cn(blockPre, preClassName)}
        tabIndex={showCaption ? 0 : -1}
        aria-label={`Terminal session: ${title}`}
      >
        <code>{visible.join('\n')}</code>
      </pre>
      {showCaption && (
        <figcaption className={blockCaption}>
          Recorded from the real program. Input typed at each prompt is shown after it.
        </figcaption>
      )}
    </figure>
  )
}

export default TerminalBlock
