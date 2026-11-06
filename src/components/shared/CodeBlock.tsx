import { Github } from 'lucide-react'
import type { Snippet } from '@/data/projects'

type CodeBlockProps = {
  snippet: Snippet
  /** Show only the first N lines (used in project cards). */
  maxLines?: number
  showCaption?: boolean
  /** Show the "View on GitHub" link. Defaults to showCaption. */
  showLink?: boolean
}

/** A real excerpt from the project's repository, with a link to the full file. */
function CodeBlock({ snippet, maxLines, showCaption = true, showLink = showCaption }: CodeBlockProps) {
  const lines = snippet.code.split('\n')
  const visible = maxLines ? lines.slice(0, maxLines) : lines
  const truncated = maxLines !== undefined && lines.length > maxLines

  return (
    <figure className="code-block">
      <div className="code-block-bar">
        <span className="code-block-file">{snippet.file}</span>
        {showLink && snippet.href && (
          <a href={snippet.href} target="_blank" rel="noreferrer">
            View on GitHub <Github size={14} />
          </a>
        )}
      </div>
      <pre tabIndex={maxLines ? -1 : 0} aria-label={`Code from ${snippet.file}`}>
        <code>
          {visible.join('\n')}
          {truncated ? '\n…' : ''}
        </code>
      </pre>
      {showCaption && <figcaption>{snippet.caption}</figcaption>}
    </figure>
  )
}

export default CodeBlock
