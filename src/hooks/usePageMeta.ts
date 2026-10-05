import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { site } from '../data/site'

const setMeta = (selector: string, value: string) => {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value)
}

/**
 * Keeps the title and share tags in sync during client-side navigation.
 * The first load already has the right tags from the prerendered HTML.
 * seo.ts imports every project and note, so it is loaded on demand instead
 * of being part of the entry bundle every page downloads.
 */
export function usePageMeta() {
  const { pathname } = useLocation()
  // In dev there is no prerendered HTML, so the first load needs the tags too.
  const isFirstLoad = useRef(true)

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false
      if (document.title) return
    }
    let cancelled = false
    import('../seo').then(({ getPageMeta }) => {
      if (cancelled) return
      const meta = getPageMeta(pathname)
      document.title = meta.title
      setMeta('meta[name="description"]', meta.description)
      setMeta('meta[property="og:title"]', meta.title)
      setMeta('meta[property="og:description"]', meta.description)
      setMeta('meta[property="og:image"]', meta.image)
      setMeta('meta[property="og:url"]', `${site.url}${meta.path}`)
      document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${site.url}${meta.path}`)
    })
    return () => {
      cancelled = true
    }
  }, [pathname])
}
