import { useCallback, useEffect, useState } from 'react'

type Scheme = 'light' | 'dark'
const STORAGE_KEY = 'color-scheme'
const query = '(prefers-color-scheme: dark)'

const systemScheme = (): Scheme =>
  typeof window !== 'undefined' && window.matchMedia(query).matches ? 'dark' : 'light'

const storedScheme = (): Scheme | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

/** Applies a pinned scheme, or clears it to follow the system. Mirrors the inline script in index.html. */
function applyScheme(pinned: Scheme | null) {
  const root = document.documentElement
  if (pinned) root.dataset.theme = pinned
  else delete root.dataset.theme
  const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
  if (meta) meta.content = pinned ?? 'light dark'
  try {
    if (pinned) localStorage.setItem(STORAGE_KEY, pinned)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage unavailable: the choice lasts for this visit only */
  }
}

/**
 * Follows the operating system by default and remembers a manual choice.
 * The first render is always 'light' so the server-rendered HTML and the
 * hydrated app match; the real value is read right after mount.
 */
export function useTheme() {
  const [scheme, setScheme] = useState<Scheme>('light')

  useEffect(() => {
    setScheme(storedScheme() ?? systemScheme())
    const media = window.matchMedia(query)
    const onChange = () => {
      if (!storedScheme()) setScheme(systemScheme())
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    setScheme((current) => {
      const next: Scheme = current === 'dark' ? 'light' : 'dark'
      // Choosing what the system already prefers means "follow the system" again.
      applyScheme(next === systemScheme() ? null : next)
      return next
    })
  }, [])

  return { scheme, toggle }
}
