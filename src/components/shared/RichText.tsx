import { Fragment } from 'react'

/** Renders a string, turning `backtick` spans into <code>. */
function RichText({ text }: { text: string }) {
  // The capture group in the regex keeps the `code` pieces in the split result, between the plain text.
  return (
    <>
      {text
        .split(/(`[^`]+`)/g)
        .map((part, index) =>
          part.startsWith('`') && part.endsWith('`') && part.length > 1 ? (
            <code key={index}>{part.slice(1, -1)}</code>
          ) : (
            <Fragment key={index}>{part}</Fragment>
          ),
        )}
    </>
  )
}

export default RichText
