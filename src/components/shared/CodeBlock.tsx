import { Github } from 'lucide-react'
import { blockBar, blockCaption, blockFrame, blockPre } from '@/components/shared/blockStyles'
import type { Snippet } from '@/data/projects'
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

  return (
    <figure className={cn(blockFrame, className)} data-code-block>
      <div className={blockBar}>
        <span className="truncate">{snippet.file}</span>
        {showLink && snippet.href && (
          <a
            className="inline-flex flex-none items-center gap-1.5 text-[#a5b8ff] no-underline hover:underline hover:underline-offset-[3px]"
            href={snippet.href}
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub <Github size={14} />
          </a>
        )}
      </div>
      <pre className={cn(blockPre, preClassName)} tabIndex={maxLines ? -1 : 0} aria-label={`Code from ${snippet.file}`}>
        <code>
          {visible.join('\n')}
          {truncated ? '\n…' : ''}
        </code>
      </pre>
      {showCaption && <figcaption className={blockCaption}>{snippet.caption}</figcaption>}
    </figure>
  )
}

export default CodeBlock
