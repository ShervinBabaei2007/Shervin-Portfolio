import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// rgb(a) from getComputedStyle as #rrggbb, or 'transparent' for a fully clear colour.
function toHex(colour: string) {
  const parts = colour.match(/[\d.]+/g)
  if (!parts) return colour
  if (parts.length === 4 && Number(parts[3]) === 0) return 'transparent'
  return `#${parts
    .slice(0, 3)
    .map((part) => (Number(part) | 0).toString(16).padStart(2, '0'))
    .join('')}`
}

// The lines in the tag: element and size, font, colours, padding and layout.
function describe(element: Element, rect: DOMRect) {
  const style = getComputedStyle(element)
  const family = style.fontFamily
    .split(',')[0]
    .replace(/["']/g, '')
    .replace(/ Variable$/, '')
  const lines = [
    `${element.tagName.toLowerCase()}   ${Math.round(rect.width)} × ${Math.round(rect.height)}`,
    `${family}  ${Math.round(parseFloat(style.fontSize))}px · ${style.fontWeight}`,
    `color  ${toHex(style.color)}`,
  ]
  const background = toHex(style.backgroundColor)
  if (background !== 'transparent') lines.push(`bg     ${background}`)
  if (style.padding && style.padding !== '0px') lines.push(`pad    ${style.padding}`)
  if (style.display === 'flex' || style.display === 'grid')
    lines.push(`${style.display}${style.gap && style.gap !== 'normal' ? `   gap ${style.gap}` : ''}`)
  return lines.join('\n')
}

/**
 * Inspect mode: outlines whatever is under the pointer (or tapped) and labels it with its size, font, colours and
 * spacing, like a browser's element picker. Clicks are caught while it is on, so links do not navigate. Rendered only
 * while active, into <body>, so it never affects the prerendered page.
 */
function InspectOverlay({ onExit }: { onExit: () => void }) {
  const box = useRef<HTMLDivElement>(null)
  const tag = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let last: Element | null = null

    const show = (target: EventTarget | null) => {
      const outline = box.current
      const label = tag.current
      if (!outline || !label) return
      const element = target instanceof Element ? target : null
      if (
        !element ||
        element === document.body ||
        element === document.documentElement ||
        element.closest('[data-inspect-ui]')
      ) {
        outline.style.display = 'none'
        label.style.display = 'none'
        return
      }
      last = element
      const rect = element.getBoundingClientRect()
      Object.assign(outline.style, {
        display: 'block',
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      })
      label.textContent = describe(element, rect)
      label.style.display = 'block'
      const height = label.offsetHeight
      const width = label.offsetWidth
      let top = rect.top - height - 8
      if (top < 72) top = Math.min(rect.bottom + 8, window.innerHeight - height - 8)
      label.style.left = `${Math.min(Math.max(8, rect.left), window.innerWidth - width - 8)}px`
      label.style.top = `${top}px`
    }

    const onMove = (event: MouseEvent) => show(event.target)
    const onScroll = () => last && show(last)
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('[data-inspect-ui]')) return
      event.preventDefault()
      event.stopPropagation()
      show(event.target)
    }

    document.addEventListener('mousemove', onMove, true)
    document.addEventListener('click', onClick, true)
    window.addEventListener('scroll', onScroll, true)
    document.body.style.cursor = 'crosshair'
    document.documentElement.setAttribute('data-native-cursor', '')
    return () => {
      document.removeEventListener('mousemove', onMove, true)
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('scroll', onScroll, true)
      document.body.style.cursor = ''
      document.documentElement.removeAttribute('data-native-cursor')
    }
  }, [])

  return createPortal(
    <>
      <div
        ref={box}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[90] hidden bg-highlight/[0.07] outline-1 outline-highlight transition-[left,top,width,height] duration-[120ms] ease-out outline-dashed"
      />
      <div
        ref={tag}
        aria-hidden="true"
        data-theme="dark"
        className="pointer-events-none fixed top-0 left-0 z-[91] hidden rounded-[4px] bg-[var(--ink-panel)] px-2.5 py-[7px] font-mono text-[12px] leading-[1.55] whitespace-pre text-foreground shadow-[0_10px_30px_-10px_rgb(0_0_0/0.45)]"
      />
      <div
        data-inspect-ui
        data-theme="dark"
        role="status"
        className="fixed bottom-5 left-1/2 z-[92] flex -translate-x-1/2 items-center gap-3.5 rounded-full bg-[var(--ink-panel)] py-1.5 pr-1.5 pl-[18px] font-mono text-[13px] whitespace-nowrap text-foreground shadow-[0_20px_40px_-16px_rgb(0_0_0/0.5)] max-[480px]:pl-3.5"
      >
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
          <span>
            Inspect mode<span className="max-[480px]:hidden"> · hover or click anything</span>
          </span>
        </span>
        <button
          type="button"
          onClick={onExit}
          className="h-11 cursor-pointer rounded-full bg-foreground px-4 font-mono text-[13px] text-background"
        >
          Exit · Esc
        </button>
      </div>
    </>,
    document.body,
  )
}

export default InspectOverlay
