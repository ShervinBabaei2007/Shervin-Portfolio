import { createElement, lazy, type ComponentType } from 'react'

type Loader<P> = () => Promise<{ default: ComponentType<P> }>

export type LazyPage<P = object> = ComponentType<P> & {
  /** Loads the page's chunk. Resolves immediately if it is already loaded. */
  preload: () => Promise<unknown>
}

/*
 * How many pages React is waiting on right now: a render that had to fetch a chunk (a click on a link whose page
 * has not arrived yet). Idle prefetching calls preload() directly and does not count. NavigationProgress reads this
 * to show a progress bar. The updates are deferred a microtask because React.lazy calls its loader while rendering,
 * and a store notifying a component mid-render makes React warn.
 */
let waiting = 0
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

export const pageLoadStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  isWaiting: () => waiting > 0,
}

/**
 * A code-split page that can be loaded *before* React renders it.
 *
 * React.lazy alone always suspends on first render, which would break
 * hydration of prerendered HTML. Here, once preload() has resolved, the page
 * renders synchronously (same markup as the server), and React.lazy is only
 * used as a fallback for pages that were not preloaded.
 */
export function lazyPage<P extends object>(loader: Loader<P>): LazyPage<P> {
  let loaded: ComponentType<P> | null = null
  let pending: Promise<{ default: ComponentType<P> }> | null = null

  const preload = () => {
    pending ??= loader().then(
      (module) => {
        loaded = module.default
        return module
      },
      (error) => {
        // Forget the failure so a later preload (or navigation) can try again.
        pending = null
        throw error
      },
    )
    return pending
  }

  const Lazy = lazy(() => {
    queueMicrotask(() => {
      waiting += 1
      notify()
    })
    return preload().finally(() => {
      waiting -= 1
      notify()
    })
  })
  const Page = ((props: P) => createElement((loaded ?? Lazy) as ComponentType<P>, props)) as LazyPage<P>
  Page.preload = preload
  return Page
}
