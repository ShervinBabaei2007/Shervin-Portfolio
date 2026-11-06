import { useEffect } from 'react'

/**
 * Renders nothing. Used as a Suspense fallback: while it is on screen it tells its parent that the
 * lazy content is still loading, so a button can show a spinner instead of looking dead.
 */
function PendingFlag({ onChange }: { onChange: (pending: boolean) => void }) {
  useEffect(() => {
    onChange(true)
    return () => onChange(false)
  }, [onChange])
  return null
}

export default PendingFlag
