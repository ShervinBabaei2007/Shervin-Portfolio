import { useEffect, useState } from 'react'

const zone = 'America/Vancouver'

export type VancouverTime = {
  /** 14:05 PST */
  short: string
  /** 14:05:09 */
  seconds: string
  /** PST · 3h behind you */
  offset: string
}

// The visitor's offset from Vancouver in whole hours, positive when Vancouver is ahead.
function hoursAhead(now: Date) {
  const vancouver = new Date(now.toLocaleString('en-US', { timeZone: zone }))
  const local = new Date(now.toLocaleString('en-US'))
  return Math.round((vancouver.getTime() - local.getTime()) / 3.6e6)
}

function read(now: Date): VancouverTime {
  const time = (options: Intl.DateTimeFormatOptions) =>
    now.toLocaleTimeString('en-CA', { timeZone: zone, hour: '2-digit', minute: '2-digit', hour12: false, ...options })
  const name =
    new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'short' })
      .formatToParts(now)
      .find((part) => part.type === 'timeZoneName')?.value ?? 'PT'
  const ahead = hoursAhead(now)
  const relative = ahead === 0 ? 'same time as you' : `${Math.abs(ahead)}h ${ahead < 0 ? 'behind' : 'ahead of'} you`
  return { short: `${time({})} ${name}`, seconds: time({ second: '2-digit' }), offset: `${name} · ${relative}` }
}

/**
 * The time in Vancouver, ticking every `intervalMs`. It is null on the server and in the first render, so the
 * prerendered HTML and the hydrated page match; the real time arrives right after mount.
 */
export function useVancouverClock(intervalMs: number) {
  const [time, setTime] = useState<VancouverTime | null>(null)
  useEffect(() => {
    const tick = () => setTime(read(new Date()))
    tick()
    const timer = window.setInterval(tick, intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])
  return time
}
