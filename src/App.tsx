import { Component, Suspense, useEffect, type ReactNode } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { Toaster } from '@/components/ui/sonner'
import SiteFooter from '@/components/shared/SiteFooter'
import SiteHeader from '@/components/shared/SiteHeader'
import { usePageMeta } from './hooks/usePageMeta'
import { useTheme } from './hooks/useTheme'
import { pages } from './routes'
import { Button } from '@/components/ui/button'

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
      <section className="section-wrap pt-16 pb-[110px]" aria-labelledby="page-error-title">
        <h1
          id="page-error-title"
          className="mt-3.5 max-w-[18ch] text-[clamp(2.375rem,1.8rem+2vw,3.5rem)] leading-[1.06]"
        >
          This page didn&apos;t load.
        </h1>
        <p className="mt-4 mb-7 max-w-[60ch] text-[1.125rem] leading-[1.65] text-muted-foreground">
          The connection may have dropped, or the site was updated while this tab was open.
        </p>
        <Button type="button" onClick={() => window.location.reload()}>
          Reload the page
        </Button>
      </section>
    )
  }
}

function App() {
  const { pathname } = useLocation()
  const { scheme, preference, setPreference } = useTheme()
  usePageMeta()

  return (
    <div className="min-h-dvh overflow-clip bg-background bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-[length:38px_38px] text-foreground transition-[background-color,color] duration-[250ms] ease-[ease] print:min-h-0 print:bg-none">
      <a
        className="fixed top-3 left-3 z-[100] -translate-y-[160%] bg-foreground px-3.5 py-2.5 text-background focus:translate-y-0 print:hidden"
        href="#main"
      >
        Skip to content
      </a>
      <ScrollManager />
      <SiteHeader scheme={scheme} preference={preference} onPreferenceChange={setPreference} />
      <main id="main" tabIndex={-1}>
        <PageErrorBoundary pathname={pathname}>
          <Suspense
            fallback={
              <div
                className="section-wrap grid min-h-[70vh] content-start gap-4 pt-12"
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
