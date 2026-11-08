import { Component, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { reportError } from '@/lib/monitoring'
import { site } from '@/data/site'

/**
 * The last line of defence, around the whole app. The page boundary in App.tsx covers the route area; this
 * covers everything else (header, footer, palette), where an error would otherwise unmount the entire site and
 * leave a blank page. It renders no markup of its own while things work.
 */
class RootErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    void reportError(error).catch(() => {})
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="mx-auto grid min-h-dvh max-w-[34rem] content-center gap-4 px-6 py-16" role="alert">
        <h1 className="text-title font-semibold">Something went wrong.</h1>
        <p className="measure text-[1.125rem] leading-[1.65] text-muted-foreground">
          The page hit an unexpected error. Reloading usually fixes it. If it keeps happening, email{' '}
          <a className="text-foreground underline underline-offset-4" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
        <div>
          <Button type="button" onClick={() => window.location.reload()}>
            Reload the page
          </Button>
        </div>
      </main>
    )
  }
}

export default RootErrorBoundary
