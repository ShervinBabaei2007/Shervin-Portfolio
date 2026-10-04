import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App'
import { pageForPath, preloadAllPages } from './routes'
import { getPageMeta, renderHeadTags, staticRoutes } from './seo'

export { staticRoutes }
export { site } from './data/site'

/** Used by scripts/prerender.mjs at build time; never shipped to the browser. */
export async function render(url: string) {
  await preloadAllPages()
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
  return { html, head: renderHeadTags(getPageMeta(url)), pageSource: pageForPath(url).source }
}
