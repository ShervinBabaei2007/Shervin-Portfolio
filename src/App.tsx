import { Component, Suspense, useEffect, type ReactNode } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { Toaster } from '@/components/ui/sonner'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'
import { usePageMeta } from './hooks/usePageMeta'
import { useTheme } from './hooks/useTheme'
import { pages } from './routes'

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

/**
 * If a page's code fails to download (a network drop, or a tab left open
 * across a deploy that removed the old files), show a way out instead of a
 * blank page. Navigating to another page clears the error.
 */
class PageErrorBoundary extends Component<{ pathname: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidUpdate(previous: { pathname: string }) {
    if (this.state.failed && previous.pathname !== this.props.pathname) this.setState({ failed: false })
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <section className="simple-page section-wrap" aria-labelledby="page-error-title">
        <h1 id="page-error-title">This page didn&apos;t load.</h1>
        <p>The connection may have dropped, or the site was updated while this tab was open.</p>
        <button className="button button-primary" type="button" onClick={() => window.location.reload()}>
          Reload the page
        </button>
      </section>
    )
  }
}

function App() {
  const { pathname } = useLocation()
  const { scheme, preference, setPreference } = useTheme()
  usePageMeta()

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollManager />
      <SiteHeader scheme={scheme} preference={preference} onPreferenceChange={setPreference} />
      <main id="main" tabIndex={-1}>
        <PageErrorBoundary pathname={pathname}>
          <Suspense
            fallback={
              <div
                className="page-loading section-wrap grid content-start gap-4 pt-12"
                aria-busy="true"
                aria-label="Loading page"
              >
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-64 w-full" />
              </div>
            }
          >
            <Routes>
              {Object.values(pages).map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
            </Routes>
          </Suspense>
        </PageErrorBoundary>
      </main>
      <SiteFooter />
      <Toaster theme={scheme} />
    </div>
  )
}

export default App
