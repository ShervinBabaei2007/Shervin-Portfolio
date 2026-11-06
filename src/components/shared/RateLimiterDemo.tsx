import { useCallback, useEffect, useRef, useState } from 'react'

/*
 * A browser-only simulation of the limiter ThinkBoard uses:
 * @upstash/ratelimit's slidingWindow. This mirrors its Lua script:
 *
 *   elapsed  = (now % window) / window
 *   estimate = floor((1 - elapsed) * previousWindowCount) + currentWindowCount
 *   if estimate >= limit -> reject (and do NOT count the rejected request)
 *   else                 -> currentWindowCount += 1
 *
 * Windows line up with the clock (now % window), exactly like Upstash.
 * Scaled down from 50 per 60 s to 10 per 10 s so you can hit it by clicking.
 */
const LIMIT = 10
const WINDOW_MS = 10_000

type Client = 'you' | 'other'
type Mode = 'shared' | 'per-client'
type LogEntry = { id: number; client: Client; status: 200 | 429; remaining: number }
type Buckets = Map<string, Map<number, number>>

const label: Record<Client, string> = { you: 'You', other: 'Another visitor' }

function estimate(buckets: Buckets, key: string, now: number) {
  const counts = buckets.get(key) ?? new Map<number, number>()
  const index = Math.floor(now / WINDOW_MS)
  const elapsed = (now % WINDOW_MS) / WINDOW_MS
  const current = counts.get(index) ?? 0
  const previous = counts.get(index - 1) ?? 0
  const weighted = Math.floor((1 - elapsed) * previous)
  return { counts, index, elapsed, current, previous, weighted, total: weighted + current }
}

function RateLimiterDemo({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<Mode>('shared')
  const [now, setNow] = useState<number | null>(null)
  const [log, setLog] = useState<LogEntry[]>([])
  const buckets = useRef<Buckets>(new Map())
  const nextId = useRef(0)
  const timers = useRef<number[]>([])

  // Clock for the progress bars. Starts after mount so server and client HTML match.
  useEffect(() => {
    setNow(Date.now())
    const tick = window.setInterval(() => setNow(Date.now()), 200)
    return () => {
      window.clearInterval(tick)
      timers.current.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  const keyFor = useCallback((client: Client) => (mode === 'shared' ? 'my-rate-limit' : `ip:${client}`), [mode])

  const send = useCallback(
    (client: Client) => {
      const at = Date.now()
      const key = keyFor(client)
      const state = estimate(buckets.current, key, at)
      let status: 200 | 429 = 429
      let remaining = 0
      if (state.total < LIMIT) {
        state.counts.set(state.index, state.current + 1)
        buckets.current.set(key, state.counts)
        status = 200
        remaining = LIMIT - (state.total + 1)
      }
      setLog((entries) => [{ id: nextId.current++, client, status, remaining }, ...entries].slice(0, 8))
      setNow(at)
    },
    [keyFor],
  )

  const burst = (count: number) => {
    for (let i = 0; i < count; i += 1) timers.current.push(window.setTimeout(() => send('you'), i * 70))
  }

  const reset = (nextMode: Mode = mode) => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
    buckets.current = new Map()
    setLog([])
    setMode(nextMode)
  }

  const meters: { key: string; title: string }[] =
    mode === 'shared'
      ? [{ key: 'my-rate-limit', title: 'Key "my-rate-limit" (everyone)' }]
      : [
          { key: 'ip:you', title: 'Key for you' },
          { key: 'ip:other', title: 'Key for the other visitor' },
        ]

  const latest = log[0]

  return (
    <section className={`limiter-demo${compact ? ' limiter-demo--compact' : ''}`} aria-labelledby="limiter-demo-title">
      <div className="limiter-demo-head">
        <h2 id="limiter-demo-title">Can you lock out another visitor?</h2>
        <p>
          This is the same sliding-window rule ThinkBoard runs in Redis, scaled to {LIMIT} requests per{' '}
          {WINDOW_MS / 1000} seconds. Start with the shared key, burst your requests, then ask another visitor to send
          one.
        </p>
      </div>

      <fieldset className="limiter-mode">
        <legend>Rate-limit key</legend>
        <label>
          <input type="radio" name="limiter-mode" checked={mode === 'shared'} onChange={() => reset('shared')} />
          One shared key <span>(ThinkBoard today)</span>
        </label>
        <label>
          <input
            type="radio"
            name="limiter-mode"
            checked={mode === 'per-client'}
            onChange={() => reset('per-client')}
          />
          One key per visitor <span>(the fix)</span>
        </label>
      </fieldset>

      <div className="limiter-actions">
        <button type="button" className="button button-primary" onClick={() => send('you')}>
          Send 1 request
        </button>
        <button type="button" className="button button-secondary" onClick={() => burst(15)}>
          Burst 15 requests
        </button>
        <button type="button" className="button button-secondary" onClick={() => send('other')}>
          Other visitor sends 1
        </button>
        <button type="button" className="text-link limiter-reset" onClick={() => reset()}>
          Reset
        </button>
      </div>

      <div className={`limiter-meters limiter-meters--${meters.length}`}>
        {meters.map((meter) => {
          const state = now === null ? null : estimate(buckets.current, meter.key, now)
          const used = state ? Math.min(state.total, LIMIT) : 0
          return (
            <div className="limiter-meter" key={meter.key}>
              <div className="limiter-meter-title">
                <b>{meter.title}</b>
                <span>
                  {used} / {LIMIT} used
                </span>
              </div>
              <div
                className={`limiter-bar${used >= LIMIT ? ' is-full' : ''}`}
                role="meter"
                aria-label={`${meter.title}: requests counted`}
                aria-valuemin={0}
                aria-valuemax={LIMIT}
                aria-valuenow={used}
              >
                <span style={{ width: `${(used / LIMIT) * 100}%` }} />
              </div>
              <p className="limiter-math">
                {state
                  ? `floor((1 − ${state.elapsed.toFixed(2)}) × ${state.previous} previous) + ${state.current} current = ${state.total}`
                  : 'Waiting for the first request'}
              </p>
            </div>
          )
        })}
        <div className="limiter-window" aria-hidden="true">
          <span>Current window</span>
          <div className="limiter-window-bar">
            <span style={{ width: `${now === null ? 0 : ((now % WINDOW_MS) / WINDOW_MS) * 100}%` }} />
          </div>
        </div>
      </div>

      <p className="visually-hidden" aria-live="polite">
        {latest ? `${label[latest.client]}: ${latest.status === 200 ? '200 OK' : '429 Too Many Requests'}` : ''}
      </p>
      <ol className="limiter-log" aria-label="Recent responses">
        {log.length === 0 && <li className="limiter-log-empty">Responses appear here.</li>}
        {log.map((entry) => (
          <li key={entry.id} className={entry.status === 429 ? 'is-limited' : undefined}>
            <span>{label[entry.client]}</span>
            <b>{entry.status === 200 ? '200 OK' : '429 Too Many Requests'}</b>
            <span>{entry.status === 200 ? `${entry.remaining} left` : 'blocked'}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default RateLimiterDemo
