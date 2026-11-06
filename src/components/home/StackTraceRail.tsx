import { useEffect, useState } from 'react'

const stops = [
  { id: 'home', label: 'ENTRY', detail: 'who I am' },
  { id: 'work', label: 'WORK', detail: 'what shipped' },
  { id: 'lab', label: 'LAB', detail: 'break it' },
  { id: 'about', label: 'WHY', detail: 'why I dig' },
  { id: 'notes', label: 'LEARN', detail: 'what changed' },
  { id: 'contact', label: 'NEXT', detail: 'build together' },
] as const

function StackTraceRail() {
  const [activeId, setActiveId] = useState<(typeof stops)[number]['id']>('home')

  useEffect(() => {
    const elements = stops
      .map((stop) => document.getElementById(stop.id))
      .filter((element): element is HTMLElement => Boolean(element))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0]
        if (visible?.target.id) setActiveId(visible.target.id as (typeof stops)[number]['id'])
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: 0 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="stack-trace-rail" aria-label="Trace this portfolio down the stack">
      <span className="stack-trace-title">TRACE</span>
      <ol>
        {stops.map((stop, index) => (
          <li key={stop.id} className={activeId === stop.id ? 'is-active' : undefined}>
            <a href={`#${stop.id}`} aria-current={activeId === stop.id ? 'location' : undefined}>
              <span className="stack-trace-node">{String(index + 1).padStart(2, '0')}</span>
              <span className="stack-trace-copy">
                <b>{stop.label}</b>
                <small>{stop.detail}</small>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default StackTraceRail
