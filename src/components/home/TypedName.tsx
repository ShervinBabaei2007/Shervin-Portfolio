import type { CSSProperties } from 'react'

const START = 300 // ms before the first letter
const BASE = 120 // ms between letters, plus a little variety so it reads as a person typing
const SPACE_PAUSE = 240 // ms of extra thought after a word

/** When each letter appears, in ms from page load. Deterministic, so the server and browser render the same HTML. */
function schedule(text: string) {
  let time = START
  return Array.from(text).map((char, index) => {
    if (index > 0) time += BASE + ((char.charCodeAt(0) * 37) % 60) + (text[index - 1] === ' ' ? SPACE_PAUSE : 0)
    return time
  })
}

/**
 * Types a line of text in letter by letter with CSS animations only (see .typed-char in tailwind.css), so the full
 * text is in the prerendered HTML and nothing flashes or shifts on hydration. A block cursor rides the typing edge,
 * then keeps blinking at the end. Reduced motion and print show the finished text with no cursor.
 */
function TypedName({ text }: { text: string }) {
  const times = schedule(text)
  return (
    <span aria-hidden="true" className="typed-name">
      {Array.from(text).map((char, index) => (
        <span
          key={index}
          className="typed-char"
          data-first={index === 0 || undefined}
          data-last={index === text.length - 1 || undefined}
          style={
            {
              '--d': `${times[index]}ms`,
              '--gap': `${(times[index + 1] ?? times[index]) - times[index]}ms`,
              '--lead': `${times[0]}ms`,
            } as CSSProperties
          }
        >
          {char}
        </span>
      ))}
    </span>
  )
}

export default TypedName
