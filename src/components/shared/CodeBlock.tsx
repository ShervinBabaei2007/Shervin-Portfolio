import { useRef } from 'react'
import { Check, Copy, Github } from 'lucide-react'
import { blockBar, blockCaption, blockFrame, blockPre } from '@/components/shared/blockStyles'
import type { Snippet } from '@/data/projects'
import { useCopy } from '@/hooks/useCopy'
import { cn } from '@/lib/utils'

type CodeBlockProps = {
  snippet: Snippet
  /** Show only the first N lines (used in project cards). */
  maxLines?: number
  showCaption?: boolean
  /** Show the "View on GitHub" link. Defaults to showCaption. */
  showLink?: boolean
  /** Extra classes for the outer figure (spacing and width come from the parent). */
  className?: string
  /** Extra classes for the <pre>. */
  preClassName?: string
}

/** A real excerpt from the project's repository, with a link to the full file. */
function CodeBlock({
  snippet,
  maxLines,
  showCaption = true,
  showLink = showCaption,
  className,
  preClassName,
}: CodeBlockProps) {
  const lines = snippet.code.split('\n')
  const visible = maxLines ? lines.slice(0, maxLines) : lines
  const truncated = maxLines !== undefined && lines.length > maxLines
  const { copied, failed, copy } = useCopy()
  const code = useRef<HTMLElement>(null)

  const copyCode = async () => {
    // Copy the whole snippet, not just the lines a card preview would show.
    if (await copy(snippet.code)) return
    // No clipboard access: select the code so Ctrl+C still works.
    const selection = window.getSelection()
    if (selection && code.current) {
      const range = document.createRange()
      range.selectNodeContents(code.current)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  return (
    <figure className={cn(blockFrame, className)} data-code-block>
      <div className={blockBar}>
        <span className="truncate">{snippet.file}</span>
        {showLink && (
          <div className="flex flex-none items-center gap-3">
            <button
              className="inline-flex min-h-7 cursor-pointer items-center gap-1.5 rounded-md px-1.5 text-[#a5b8ff] hover:bg-white/10 pointer-coarse:min-h-11 pointer-coarse:px-3"
              type="button"
              aria-label={`Copy code from ${snippet.file}`}
              onClick={() => void copyCode()}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : failed ? 'Press Ctrl+C' : 'Copy'}
            </button>
            <span className="sr-only" role="status">
              {copied
                ? 'Code copied to clipboard.'
                : failed
                  ? 'Copying was blocked. The code is selected; press Ctrl+C.'
                  : ''}
            </span>
            {snippet.href && (
              <a
                className="inline-flex items-center gap-1.5 text-[#a5b8ff] no-underline hover:underline hover:underline-offset-[3px]"
                href={snippet.href}
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub <Github size={14} />
              </a>
            )}
          </div>
        )}
      </div>
      <pre className={cn(blockPre, preClassName)} tabIndex={maxLines ? -1 : 0} aria-label={`Code from ${snippet.file}`}>
        <code ref={code}>
          {visible.join('\n')}
          {truncated ? '\n…' : ''}
        </code>
      </pre>
      {showCaption && <figcaption className={blockCaption}>{snippet.caption}</figcaption>}
    </figure>
  )
}

export default CodeBlock
