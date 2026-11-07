/**
 * Real-user monitoring: Vercel Analytics, Speed Insights (Core Web Vitals) and Sentry (errors).
 * Imported dynamically once the browser is idle, so none of it counts against the first download.
 * Does nothing in dev, and Sentry also needs VITE_SENTRY_DSN.
 */
export async function startMonitoring() {
  if (import.meta.env.DEV || navigator.webdriver) return

  const [{ inject }, { injectSpeedInsights }] = await Promise.all([
    import('@vercel/analytics'),
    import('@vercel/speed-insights'),
  ])
  inject()
  injectSpeedInsights()

  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) return
  const Sentry = await import('@sentry/react')
  Sentry.init({ dsn, tracesSampleRate: 0.1, environment: import.meta.env.MODE })}

/** Reports an error caught by a React error boundary. Does nothing unless Sentry was started. */
export async function reportError(error: unknown) {
  if (!import.meta.env.VITE_SENTRY_DSN || import.meta.env.DEV) return
  const Sentry = await import('@sentry/react')
  Sentry.captureException(error)
}
