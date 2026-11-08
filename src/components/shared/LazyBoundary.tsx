import { Component, type ReactNode } from 'react'
import { reportError } from '@/lib/monitoring'

type Props = {
  /** What was loading, for the message: "Quick look", "Search", "Menu". */
  label: string
  /** Called once when the piece fails, so the parent can drop it and clear any busy state. */
  onFail?: () => void
  /** What to show instead of the failed piece (nothing by default). */
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Wraps a lazily loaded piece of the interface (a panel, a menu, a dialog). If its code cannot be downloaded,
 * for example because the connection dropped or the site was updated while the tab was open, the piece is
 * dropped and a toast says what happened and offers a reload. Without this, the error would travel up to the
 * page boundary and replace the whole page.
 *
 * The toast library is loaded here on demand. By then it is almost always in the browser's module cache
 * (the toast container loads when the browser is idle), so it still works when the network has gone.
 * A failed dynamic import cannot be retried in the same page load, which is why the action is a reload.
 */
class LazyBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    void reportError(error).catch(() => {})
    void import('sonner')
      .then(({ toast }) =>
        toast.error(`${this.props.label} could not load`, {
          description: 'Check your connection, then reload the page.',
          action: { label: 'Reload', onClick: () => window.location.reload() },
        }),
      )
      .catch(() => {})
    this.props.onFail?.()
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}

export default LazyBoundary
