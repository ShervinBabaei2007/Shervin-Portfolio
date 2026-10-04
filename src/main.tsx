import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { pageForPath, preloadAllPages } from './routes'
import './fonts.css'
import './styles.css'

const container = document.getElementById('root')!
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// Once the page is interactive, fetch the other page chunks in the background
// so clicking through the site never waits on the network.
const warmOtherPages = () => {
  const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 1500))
  idle(() => void preloadAllPages())
}

// Load this route's chunk before hydrating, so React renders the same markup
// the prerenderer produced. (prerender.mjs also adds <link rel="modulepreload">
// for that chunk, so this usually resolves instantly.)
pageForPath(window.location.pathname)
  .Component.preload()
  .then(() => {
    // In dev, Vite serves index.html as-is: the root only holds the "<!--app-->"
    // comment, which is a child node but not an element, so render fresh.
    if (container.firstElementChild) ReactDOM.hydrateRoot(container, app)
    else ReactDOM.createRoot(container).render(app)
    warmOtherPages()
  })
