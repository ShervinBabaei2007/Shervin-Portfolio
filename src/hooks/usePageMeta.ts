import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getPageMeta } from '../seo'
import { site } from '../data/site'

const setMeta = (selector: string, value: string) => {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value)
}

/**
 * Keeps the title and share tags in sync during client-side navigation.
 * The first load already has the right tags from the prerendered HTML.
 */
export function usePageMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = getPageMeta(pathname)
    document.title = meta.title
    setMeta('meta[name="description"]', meta.description)
    setMeta('meta[property="og:title"]', meta.title)
    setMeta('meta[property="og:description"]', meta.description)
    setMeta('meta[property="og:image"]', meta.image)
    setMeta('meta[property="og:url"]', `${site.url}${meta.path}`)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${site.url}${meta.path}`)
  }, [pathname])
}
