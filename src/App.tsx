import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'
import { usePageMeta } from './hooks/usePageMeta'
import { useTheme } from './hooks/useTheme'
import BuiltPage from './pages/BuiltPage'
import CaseStudyPage from './pages/CaseStudyPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ResumePage from './pages/ResumePage'

/** Scrolls to the #hash after navigation, or to the top of a new page. */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) {
        target.scrollIntoView()
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

function App() {
  const { scheme, toggle } = useTheme()
  usePageMeta()

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollManager />
      <SiteHeader darkMode={scheme === 'dark'} onToggleTheme={toggle} />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work/:slug" element={<CaseStudyPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/how-its-built" element={<BuiltPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
