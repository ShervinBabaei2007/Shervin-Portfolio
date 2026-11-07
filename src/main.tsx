import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { reloadOnceAfterChunkFailure } from './lib/reloadOnce'
import { startMonitoring } from './lib/monitoring'
import { pageForPath, preloadAllPages } from './routes'
import './fonts.css'
import './tailwind.css'

const container = document.getElementById('root')!
const app = (
  <React.StrictMode>
    {/* Navigations run as transitions: the current page stays on screen until the next page's code has loaded. */}
    <BrowserRouter future={{ v7_startTransition: true }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// Once the page is interactive, fetch the other page chunks in the background
// so clicking through the site never waits on the network.
const warmOtherPages = () => {
  const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 1500))
  // A chunk that fails here is retried when someone navigates to that page.
  idle(() => void preloadAllPages().catch(() => {}))
  idle(() => void startMonitoring().catch(() => {}))
}

// Load this route's chunk before hydrating, so React renders the same markup
// the prerenderer produced. (prerender.mjs also adds <link rel="modulepreload">
// for that chunk, so this usually resolves instantly.) If the chunk cannot
// load, the prerendered HTML stays as it is: readable, and its links still
// work as normal page loads. (Retrying in the same page load does not help:
// browsers cache a failed dynamic import.)
pageForPath(window.location.pathname)
  .Component.preload()
  .then(
    () => {
      // In dev, Vite serves index.html as-is: the root only holds the "<!--app-->"
      // comment, which is a child node but not an element, so render fresh.
      if (container.firstElementChild) ReactDOM.hydrateRoot(container, app)
      else ReactDOM.createRoot(container).render(app)
      warmOtherPages()
    },
    (error) => {
      // A reload usually fixes a deploy mismatch; if it cannot, the static HTML stays readable.
      if (reloadOnceAfterChunkFailure()) return
      console.error('Could not load this page’s code, so it was left as static HTML.', error)
    },
  )
