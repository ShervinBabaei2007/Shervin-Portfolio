import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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

const modeLabel = 'inline-flex min-h-11 cursor-pointer items-center gap-2 font-semibold'
const modeInput = 'size-[18px] accent-primary'
const actionClass = 'h-[46px] border px-[17px] text-[.8125rem] font-semibold'
const meterTrack = 'mt-2 h-3 overflow-hidden rounded-full border bg-background'
const meterFill = 'block h-full transition-[width] duration-200 ease-linear'

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
  // On phones the buttons share the row; in the lab (compact) they each take a full row.
  const narrowFill = compact ? 'max-[620px]:flex-[1_1_100%]' : 'max-[620px]:flex-auto'

  return (
    <section
      className={cn(
        'mt-9 rounded-xl border border-t-[3px] border-t-primary bg-card px-7 pt-[26px] pb-7 max-[620px]:px-4 max-[620px]:pt-5 max-[620px]:pb-[22px]',
        compact &&
          'mt-[30px] bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-[length:22px_22px]',
      )}
      aria-labelledby="limiter-demo-title"
      data-limiter-demo
    >
      <div>
        <h2
          id="limiter-demo-title"
          // tailwind-merge drops an earlier leading-* when a later text-* size follows, so leading goes last.
          className={cn('text-[1.5rem]', compact && 'text-[clamp(1.55rem,1.3rem+.8vw,2rem)]', 'leading-[normal]')}
        >
          Can you lock out another visitor?
        </h2>
        <p className="mt-2 max-w-[68ch] leading-[1.6] text-muted-foreground">
          This is the same sliding-window rule ThinkBoard runs in Redis, scaled to {LIMIT} requests per{' '}
          {WINDOW_MS / 1000} seconds. Start with the shared key, burst your requests, then ask another visitor to send
          one.
        </p>
      </div>

      <fieldset className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-0 p-0">
        <legend className="mb-2 p-0 font-mono text-[.75rem] leading-[normal] text-muted-foreground">
          Rate-limit key
        </legend>
        <label className={modeLabel}>
          <input
            className={modeInput}
            type="radio"
            name="limiter-mode"
            checked={mode === 'shared'}
            onChange={() => reset('shared')}
          />
          One shared key <span className="font-normal text-muted-foreground">(ThinkBoard today)</span>
        </label>
        <label className={modeLabel}>
          <input
            className={modeInput}
            type="radio"
            name="limiter-mode"
            checked={mode === 'per-client'}
            onChange={() => reset('per-client')}
          />
          One key per visitor <span className="font-normal text-muted-foreground">(the fix)</span>
        </label>
      </fieldset>

      <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
        <Button type="button" size="lg" className={cn(actionClass, narrowFill)} onClick={() => send('you')}>
          Send 1 request
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn(actionClass, narrowFill)}
          onClick={() => burst(15)}
        >
          Burst 15 requests
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn(actionClass, narrowFill)}
          onClick={() => send('other')}
        >
          Other visitor sends 1
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className={cn('h-11 border px-2 text-muted-foreground hover:text-primary', narrowFill)}
          onClick={() => reset()}
        >
          Reset
        </Button>
      </div>

      <div
        className={cn(
          'mt-[22px] grid grid-cols-1 gap-x-7 gap-y-[18px]',
          meters.length === 2 && 'min-[621px]:grid-cols-2',
        )}
      >
        {meters.map((meter) => {
          const state = now === null ? null : estimate(buckets.current, meter.key, now)
          const used = state ? Math.min(state.total, LIMIT) : 0
          return (
            <div key={meter.key}>
              <div className="flex justify-between gap-3 text-[.9375rem]">
                <b>{meter.title}</b>
                <span className="font-mono text-[.8125rem] leading-[normal] whitespace-nowrap text-muted-foreground">
                  {used} / {LIMIT} used
                </span>
              </div>
              <div
                className={meterTrack}
                role="meter"
                aria-label={`${meter.title}: requests counted`}
                aria-valuemin={0}
                aria-valuemax={LIMIT}
                aria-valuenow={used}
              >
                <span className={cn(meterFill, 'bg-primary')} style={{ width: `${(used / LIMIT) * 100}%` }} />
              </div>
              <p className="mt-2 font-mono text-[.75rem] leading-[1.5] [overflow-wrap:anywhere] text-muted-foreground">
                {state
                  ? `floor((1 − ${state.elapsed.toFixed(2)}) × ${state.previous} previous) + ${state.current} current = ${state.total}`
                  : 'Waiting for the first request'}
              </p>
            </div>
          )
        })}
        <div
          className="col-span-full font-mono text-[.75rem] leading-[normal] text-muted-foreground"
          aria-hidden="true"
        >
          <span>Current window</span>
          <div className={cn(meterTrack, 'h-1.5')}>
            <span
              className={cn(meterFill, 'bg-muted-foreground')}
              style={{ width: `${now === null ? 0 : ((now % WINDOW_MS) / WINDOW_MS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {latest ? `${label[latest.client]}: ${latest.status === 200 ? '200 OK' : '429 Too Many Requests'}` : ''}
      </p>
      <ol
        className="mt-[22px] grid list-none border-t p-0 text-[.875rem]"
        aria-label="Recent responses"
        data-limiter-log
      >
        {log.length === 0 && (
          <li className="block border-b px-0.5 py-2 text-muted-foreground">Responses appear here.</li>
        )}
        {log.map((entry) => (
          <li
            key={entry.id}
            className="grid grid-cols-[minmax(120px,.8fr)_1.4fr_.8fr] gap-3 border-b px-0.5 py-2 max-[620px]:grid-cols-[1fr_auto]"
            data-limited={entry.status === 429 ? '' : undefined}
          >
            <span className="max-[620px]:col-span-full max-[620px]:text-[.8125rem] max-[620px]:text-muted-foreground">
              {label[entry.client]}
            </span>
            {/* DM Mono ships only weight 400. */}
            <b className="font-mono text-[.875rem] leading-[normal] font-normal text-primary">
              {entry.status === 200 ? '200 OK' : '429 Too Many Requests'}
            </b>
            <span className="text-right text-muted-foreground">
              {entry.status === 200 ? `${entry.remaining} left` : 'blocked'}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default RateLimiterDemo
