type TerminalBlockProps = {
  title: string
  transcript: string
  maxLines?: number
  showCaption?: boolean
}

/** A recorded session from the real program, not a mock-up. */
function TerminalBlock({ title, transcript, maxLines, showCaption = true }: TerminalBlockProps) {
  const lines = transcript.split('\n')
  const visible = maxLines ? lines.slice(0, maxLines) : lines

  return (
    <figure className="terminal-block">
      <div className="terminal-block-bar">
        <span />
        <span />
        <span />
        <b>{title}</b>
      </div>
      <pre tabIndex={showCaption ? 0 : -1} aria-label={`Terminal session: ${title}`}>
        <code>{visible.join('\n')}</code>
      </pre>
      {showCaption && (
        <figcaption>Recorded from the real program. Input typed at each prompt is shown after it.</figcaption>
      )}
    </figure>
  )
}

export default TerminalBlock
