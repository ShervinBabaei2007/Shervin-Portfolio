import { useEffect, useState, type ReactNode } from 'react'
import { projects } from '@/data/projects'
import { site } from '@/data/site'
import { useVancouverClock } from '@/hooks/useVancouverClock'

// The project marked "– Current" in its date is the one I am building now.
const current = projects.find((project) => /current/i.test(project.date))

// Whole months from now until graduation, worded for the card. Computed after mount, like the clock.
function untilGraduation(now: Date) {
  const [month, year] = site.graduation.split(' ')
  const target = new Date(`${month} 1, ${year}`)
  const months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
  if (Number.isNaN(months) || months < 0) return null
  return months > 1 ? `in ${months} months` : months === 1 ? 'next month' : 'this month'
}

function Row({ label, value, detail }: { label: string; value: ReactNode; detail?: ReactNode }) {
  return (
    <div className="grid grid-cols-[104px_minmax(0,1fr)] gap-3 border-b border-foreground/10 px-[18px] py-3.5 max-[380px]:grid-cols-[88px_minmax(0,1fr)]">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="m-0 flex min-w-0 flex-col gap-[3px]">
        <span className="flex items-center gap-2 text-foreground">{value}</span>
        {detail && <span className="text-muted-foreground">{detail}</span>}
      </dd>
    </div>
  )
}

type StatusCardProps = { inspecting: boolean; onToggleInspect: () => void }

/** The dark ~/status card in the hero: availability, place, live local time, current project, graduation. */
function StatusCard({ inspecting, onToggleInspect }: StatusCardProps) {
  const clock = useVancouverClock(1000)
  const [graduation, setGraduation] = useState<string | null>(null)
  useEffect(() => setGraduation(untilGraduation(new Date())), [])

  return (
    <div
      data-theme="dark"
      className="overflow-hidden rounded-lg bg-[var(--ink-panel)] font-mono text-[13px] leading-[1.45] text-foreground shadow-[0_40px_80px_-48px_rgb(27_26_24/0.6)]"
    >
      <div className="flex items-center justify-between border-b border-foreground/10 px-[18px] py-3.5 text-muted-foreground">
        <span>~/status</span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
          live
        </span>
      </div>
      <dl className="m-0">
        <Row
          label="status"
          value={
            <>
              <span
                className="size-2 rounded-full bg-success shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-success)_18%,transparent)] motion-safe:animate-[blink_2s_steps(1,end)_infinite]"
                aria-hidden="true"
              />
              Open to work
            </>
          }
          detail="Junior · Co-op · Internship"
        />
        <Row label="location" value={site.location} detail="49.2827° N, 123.1207° W" />
        <Row
          label="local time"
          value={<time suppressHydrationWarning>{clock?.seconds ?? '--:--:--'}</time>}
          detail={clock?.offset ?? 'Pacific time'}
        />
        {current && (
          <Row label="building" value={current.name} detail={current.date.replace(/\s*–\s*current/i, ' → now')} />
        )}
        <Row
          label="graduating"
          value={site.graduation}
          detail={`${site.school}${graduation ? ` · ${graduation}` : ''}`}
        />
      </dl>
      <button
        type="button"
        aria-pressed={inspecting}
        onClick={onToggleInspect}
        className="flex w-full cursor-pointer items-center justify-between gap-3 border-0 bg-primary-fill p-[18px] text-left font-mono text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary-fill-hover max-[380px]:p-3.5"
      >
        <span className="flex items-center gap-2.5">
          <span aria-hidden="true" className="text-base">
            ⌖
          </span>
          {inspecting ? 'Inspecting · click to stop' : 'Inspect how this page is built'}
        </span>
        <span className="flex items-center gap-2 text-[13px] font-normal max-[380px]:hidden">
          press
          <kbd className="inline-flex h-[26px] min-w-[26px] items-center justify-center rounded-[4px] bg-foreground px-1.5 font-mono text-[13px] font-semibold text-background shadow-[0_2px_0_rgb(0_0_0/0.35)]">
            I
          </kbd>
        </span>
      </button>
    </div>
  )
}

export default StatusCard
