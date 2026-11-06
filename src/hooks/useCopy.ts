import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Copies text to the clipboard and reports the result for a couple of seconds, so a button can say
 * "Copied" (or explain that copying was blocked). `copy` resolves to whether the clipboard accepted the text.
 */
export function useCopy(resetMs = 2000) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = useCallback(
    async (text: string) => {
      window.clearTimeout(timer.current)
      let ok = true
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        ok = false // no clipboard access (insecure page, blocked permission, old browser)
      }
      setState(ok ? 'copied' : 'failed')
      timer.current = window.setTimeout(() => setState('idle'), resetMs)
      return ok
    },
    [resetMs],
  )

  return { copied: state === 'copied', failed: state === 'failed', copy }
}
