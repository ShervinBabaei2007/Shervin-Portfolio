import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import NavigationProgress from '@/components/shared/NavigationProgress'
import SiteFooter from '@/components/shared/SiteFooter'
import SiteHeader from '@/components/shared/SiteHeader'
import BackToTop from '@/components/shared/BackToTop'
import PageTransition from '@/components/shared/PageTransition'
import { reportError } from './lib/monitoring'
import { haltSmoothScroll } from './lib/motion'
import { usePageMeta } from './hooks/usePageMeta'
import { useTheme, type Scheme } from './hooks/useTheme'
import { pages } from './routes'

// The toast container from shadcn's sonner wrapper, split into its own chunk.
const Toaster = lazy(() => import('@/components/ui/sonner').then((module) => ({ default: module.Toaster })))

/**
 * The toast container is only needed after something happens (a copied email, a sent message), so it loads
 * once the browser is idle instead of with the first page. It renders nothing on the server, so hydration matches.
 */
function LazyToaster({ scheme }: { scheme: Scheme }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    // Safari has no requestIdleCallback, so it waits a fixed 1.5 s instead.
    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 1500))
    idle(() => setReady(true))
  }, [])
  return ready ? (
    <Suspense fallback={null}>
      <Toaster theme={scheme} />
    </Suspense>
  ) : null
}

/** Scrolls to the #hash after navigation, or to the top of a new page. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  // The location the page was last scrolled for. It starts as the first page's: the browser has already placed that
  // page (at the top, at a #hash, or wherever the visitor scrolled while it hydrated), and scrolling for it again would
  // yank them back to the top. Comparing locations, not counting runs, also survives StrictMode's double effects.
  const scrolledFor = useRef(pathname + hash)

  useEffect(() => {
    if (scrolledFor.current === pathname + hash) return
    scrolledFor.current = pathname + hash
    // A wheel glide still in progress would carry on down the new page.
    haltSmoothScroll()
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

  componentDidCatch(error: unknown) {
    void reportError(error).catch(() => {})
  }

  // Clear the error once the visitor navigates somewhere else.
  componentDidUpdate(previous: { pathname: string }) {
    if (this.state.failed && previous.pathname !== this.props.pathname) this.setState({ failed: false })
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <section
        className="section-wrap pt-[clamp(48px,7vw,104px)] pb-[clamp(88px,10vw,144px)]"
        aria-labelledby="page-error-title"
      >
        <p className="m-0 font-mono text-[13px] text-muted-foreground">
          <span className="text-primary">~</span> $ reload
        </p>
        <h1
          id="page-error-title"
          className="mt-5 mb-0 max-w-[18ch] text-[clamp(2.875rem,6vw,5.875rem)] leading-[0.95] font-[650] tracking-[-0.045em]"
        >
          This page didn&apos;t load.
        </h1>
        <p className="mt-6 mb-8 max-w-[560px] text-[clamp(1.0625rem,1.4vw,1.1875rem)] leading-[1.55] text-text-body">
          The connection may have dropped, or the site was updated while this tab was open.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex h-12 cursor-pointer items-center rounded-full border-0 bg-foreground px-[22px] text-[15px] text-background transition-colors hover:bg-primary-fill hover:text-primary-foreground"
        >
          Reload the page
        </button>
      </section>
    )
  }
}

/** The site shell: skip link, header, the current page, footer and the floating corner widgets. */
function App() {
  const { pathname } = useLocation()
  const { scheme, preference, setPreference, toggle } = useTheme()
  usePageMeta()

  return (
    <div className="min-h-dvh overflow-clip bg-background text-foreground transition-[background-color,color] duration-[250ms] ease-[ease] print:min-h-0">
      <a
        className="fixed top-3 left-3 z-[100] -translate-y-[160%] bg-foreground px-3.5 py-2.5 text-background focus:translate-y-0 print:hidden"
        href="#main"
      >
        Skip to content
      </a>
      <ScrollManager />
      <NavigationProgress />
      <SiteHeader scheme={scheme} onToggleTheme={toggle} preference={preference} onPreferenceChange={setPreference} />
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
            <PageTransition pathname={pathname}>
              <Routes>
                {Object.values(pages).map(({ path, Component }) => (
                  <Route key={path} path={path} element={<Component />} />
                ))}
              </Routes>
            </PageTransition>
          </Suspense>
        </PageErrorBoundary>
      </main>
      <SiteFooter />
      <BackToTop />
      <LazyToaster scheme={scheme} />
    </div>
  )
}

export default App
