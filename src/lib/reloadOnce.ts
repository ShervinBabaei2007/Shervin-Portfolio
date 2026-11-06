const KEY = 'chunk-reload-at'
const COOLDOWN_MS = 30_000

/**
 * Reloads the page once if a page's code failed to download. This usually means
 * the visitor's HTML is from just before (or during) a deploy, and a reload
 * fetches HTML and files that match. A browser caches a failed dynamic import
 * for the life of the page, so retrying without a reload cannot help.
 *
 * It does nothing when offline (a reload would replace the readable static page
 * with the browser's error page) and reloads at most once per 30 seconds, so a
 * file that is genuinely missing cannot cause a reload loop.
 */
export function reloadOnceAfterChunkFailure(): boolean {
  if (typeof window === 'undefined' || !navigator.onLine) return false
  try {
    const last = Number(sessionStorage.getItem(KEY) ?? 0)
    if (Date.now() - last < COOLDOWN_MS) return false
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch {
    return false // storage unavailable: without the guard a reload loop is possible, so do not reload
  }
  window.location.reload()
  return true
}
