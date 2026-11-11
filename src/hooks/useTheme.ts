import { useCallback, useEffect, useState } from 'react'

export type Scheme = 'light' | 'dark'
export type Preference = Scheme | 'system'
const STORAGE_KEY = 'color-scheme'
const query = '(prefers-color-scheme: dark)'

const systemScheme = (): Scheme =>
  typeof window !== 'undefined' && window.matchMedia(query).matches ? 'dark' : 'light'

/** Dark is the default; only an explicit light or system choice changes that. */
const storedPreference = (): Preference => {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'system' ? value : 'dark'
  } catch {
    return 'dark'
  }
}

const resolve = (preference: Preference): Scheme => (preference === 'system' ? systemScheme() : preference)

/** Pins the resolved scheme on <html> (the `dark` class drives Tailwind and shadcn). Mirrors index.html. */
function applyScheme(scheme: Scheme) {
  const root = document.documentElement
  root.classList.toggle('dark', scheme === 'dark')
  const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
  if (meta) meta.content = scheme
  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  // The page background in the new theme, read from the token so the address bar always matches it.
  const background = getComputedStyle(root).getPropertyValue('--background').trim()
  if (themeColor && background) themeColor.content = background
}

/**
 * Dark by default, with Light / Dark / System choices remembered in localStorage.
 * The first render is always 'dark' so the server-rendered HTML and the
 * hydrated app match; the real value is read right after mount.
 */
export function useTheme() {
  const [preference, setPreferenceState] = useState<Preference>('dark')
  const [scheme, setScheme] = useState<Scheme>('dark')

  useEffect(() => {
    const initial = storedPreference()
    setPreferenceState(initial)
    setScheme(resolve(initial))
    applyScheme(resolve(initial))
    const media = window.matchMedia(query)
    const onChange = () => {
      if (storedPreference() === 'system') {
        setScheme(systemScheme())
        applyScheme(systemScheme())
      }
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const setPreference = useCallback((next: Preference) => {
    const resolved = resolve(next)
    setPreferenceState(next)
    setScheme(resolved)
    applyScheme(resolved)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable: the choice lasts for this visit only */
    }
  }, [])

  const toggle = useCallback(() => setPreference(scheme === 'dark' ? 'light' : 'dark'), [scheme, setPreference])

  return { scheme, preference, setPreference, toggle }
}
