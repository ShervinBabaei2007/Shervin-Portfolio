import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '@/components/shared/Reveal'
import SectionHeading from '@/components/shared/SectionHeading'
import { outlinePill } from '@/lib/surfaces'

const CAPACITY = 5
// A quarter token every 300 ms: one whole request back every 1.2 seconds.
const REFILL_STEP = 0.25
const REFILL_MS = 300

type Response = { id: number; ok: boolean; time: string }

/** A token bucket you can empty by clicking: each request takes a token, and an empty bucket answers 429. */
function BucketDemo() {
  const [tokens, setTokens] = useState(CAPACITY)
  const [log, setLog] = useState<Response[]>([])
  const nextId = useRef(0)

  useEffect(() => {
    const timer = window.setInterval(
      () => setTokens((left) => (left < CAPACITY ? Math.min(CAPACITY, left + REFILL_STEP) : left)),
      REFILL_MS,
    )
    return () => window.clearInterval(timer)
  }, [])

  const send = () => {
    const ok = tokens >= 1
    if (ok) setTokens((left) => left - 1)
    const time = new Date().toLocaleTimeString('en-CA', { hour12: false })
    setLog((entries) => [{ id: nextId.current++, ok, time }, ...entries].slice(0, 5))
  }

  return (
    <div
      data-theme="dark"
      className="flex w-full min-w-0 flex-col gap-5 rounded-md bg-[var(--ink-panel)] p-[clamp(20px,2.4vw,32px)] font-mono text-foreground"
    >
      <div className="flex justify-between gap-3 text-[13px] text-muted-foreground">
        <span>Bucket</span>
        <span className="text-foreground">{Math.floor(tokens)} of 5 left</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5" aria-hidden="true">
        {Array.from({ length: CAPACITY }, (_, index) => (
          <div key={index} className="relative h-10 overflow-hidden rounded-[3px] bg-surface-hover">
            <div
              className="absolute inset-x-0 bottom-0 bg-foreground transition-[height] duration-300"
              style={{ height: `${Math.round(Math.max(0, Math.min(1, tokens - index)) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={send}
        className="h-12 cursor-pointer rounded-full border-0 bg-foreground font-mono text-[13px] text-background transition-[background-color,transform] duration-200 hover:bg-primary-fill active:scale-[0.98]"
      >
        Send request
      </button>
      <ol aria-live="polite" className="m-0 flex min-h-[150px] list-none flex-col gap-2 p-0 text-[13px]">
        {log.length === 0 && (
          <li className="text-muted-foreground">Responses appear here. Click quickly to hit the limit.</li>
        )}
        {log.map((entry) => (
          <li key={entry.id} className="flex justify-between gap-3 border-b border-foreground/10 pb-2">
            <span className={entry.ok ? 'text-foreground' : 'text-primary'}>
              {entry.ok ? '200 OK' : '429 Too Many Requests'}
            </span>
            <span className="text-muted-foreground">{entry.time}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** The lab teaser: what the rate-limiter page is, and a small bucket to try right here. */
function LabSection() {
  return (
    <section className="section-wrap pt-[clamp(88px,10vw,144px)]" id="lab" aria-labelledby="lab-title">
      <SectionHeading id="lab-title" number="03" title="Lab" />
      <div className="flex flex-wrap items-start gap-[clamp(32px,5vw,80px)]">
        <Reveal>
          <div className="flex min-w-0 flex-[5_1_320px] flex-col gap-5">
            <h3 className="m-0 text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.1] tracking-[-0.03em]">Rate-limiter lab</h3>
            <p className="m-0 max-w-[46ch] text-[17px] leading-[1.6] text-text-body">
              An interactive page on this site. You send requests to the sliding-window limiter that protects
              ThinkBoard, scaled down so you can hit it by clicking, and watch the point where it starts refusing them.
            </p>
            <p className="m-0 max-w-[46ch] text-[17px] leading-[1.6] text-text-body">
              The bucket here is simpler: five requests, then one more every 1.2 seconds.
            </p>
            <Link to="/lab" className={`${outlinePill} self-start`}>
              Open the full lab <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex min-w-0 flex-[7_1_380px]">
            <BucketDemo />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default LabSection
