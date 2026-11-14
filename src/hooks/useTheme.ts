import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

export type Scheme = 'light' | 'dark'
export type Preference = Scheme | 'system'
const STORAGE_KEY = 'color-scheme'
const query = '(prefers-color-scheme: dark)'

// The operating system's light or dark setting (light when there is no window, as on the server).
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

// Turns a preference into the scheme to show, looking up the system setting for 'system'.
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
 * Runs a theme change as one cross-fade of the whole page. Without it, each element's own colour transition runs at
 * its own pace and the page flashes through the wrong background. Browsers without view transitions (and visitors
 * who prefer reduced motion) get an instant switch.
 */
function withSmoothSwitch(change: () => void) {
  const doc = document as Document & { startViewTransition?: (callback: () => void) => unknown }
  if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    change()
    return
  }
  // Element transitions are paused so the live "new" page is already in its final colours while it fades in.
  const root = document.documentElement
  root.classList.add('theme-switching')
  const transition = doc.startViewTransition(() => flushSync(change)) as { finished: Promise<unknown> }
  void transition.finished.finally(() => root.classList.remove('theme-switching'))
}

/**
 * Dark by default, with Light / Dark / System choices remembered in localStorage.
 * The first render is always 'dark' so the server-rendered HTML and the
 * hydrated app match; the real value is read right after mount.
 */
export function useTheme() {
  const [preference, setPreferenceState] = useState<Preference>('dark')
  const [scheme, setScheme] = useState<Scheme>('dark')

  // After mount: apply the saved choice, then follow the system setting while 'system' is chosen.
  useEffect(() => {
    const initial = storedPreference()
    const initialScheme = resolve(initial)
    setPreferenceState(initial)
    setScheme(initialScheme)
    applyScheme(initialScheme)
    const media = window.matchMedia(query)
    const onChange = () => {
      if (storedPreference() !== 'system') return
      const next = systemScheme()
      setScheme(next)
      applyScheme(next)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  // Switches the theme with a cross-fade and remembers the choice.
  const setPreference = useCallback((next: Preference) => {
    const resolved = resolve(next)
    withSmoothSwitch(() => {
      setPreferenceState(next)
      setScheme(resolved)
      applyScheme(resolved)
    })
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable: the choice lasts for this visit only */
    }
  }, [])

  // Flips between light and dark.
  const toggle = useCallback(() => setPreference(scheme === 'dark' ? 'light' : 'dark'), [scheme, setPreference])

  return { scheme, preference, setPreference, toggle }
}
