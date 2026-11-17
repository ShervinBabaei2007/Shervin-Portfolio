/**
 * The animated ASCII noise behind the hero. It ripples around the pointer and thins out around every [data-calm]
 * element in the canvas's parent, so text on top of it stays readable. Colours come from the canvas's own CSS
 * (`color` for the characters, --color-highlight for the ripple), so it follows the theme.
 * With reduced motion it draws one still frame, and again on resize.
 */
export function startAsciiField(canvas: HTMLCanvasElement, { motion }: { motion: boolean }) {
  const context = canvas.getContext('2d')
  if (!context) return () => {}
  const chars = ' .·:-=+*#%'
  const pointer = { x: -1e4, y: -1e4 }
  const glow = { x: 0, y: 0, strength: 0 }
  let visible = true
  let frame = 0
  let last = 0

  const onPointer = (event: PointerEvent) => {
    pointer.x = event.clientX
    pointer.y = event.clientY
  }

  const draw = (time: number) => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (!width || !height) return
    if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.clearRect(0, 0, width, height)
    context.globalAlpha = 1

    const style = getComputedStyle(canvas)
    const ink =
      style.color
        .match(/[\d.]+/g)
        ?.slice(0, 3)
        .join(',') ?? '27,26,24'
    const accent = style.getPropertyValue('--color-highlight').trim() || '#c6532c'

    const box = canvas.getBoundingClientRect()
    const px = pointer.x - box.left
    const py = pointer.y - box.top
    const inside = motion && px >= 0 && py >= 0 && px <= width && py <= height
    glow.x = px
    glow.y = py
    glow.strength += ((inside ? 1 : 0) - glow.strength) * (inside ? 0.25 : 0.03)

    const pad = 28
    const fall = Math.max(90, width * 0.08)
    const calm = [...(canvas.parentElement?.querySelectorAll('[data-calm]') ?? [])].map((element) => {
      const rect = element.getBoundingClientRect()
      return {
        left: rect.left - box.left - pad,
        top: rect.top - box.top - pad,
        right: rect.right - box.left + pad,
        bottom: rect.bottom - box.top + pad,
      }
    })

    const cellWidth = width < 640 ? 11 : 13
    const cellHeight = cellWidth * 1.35
    context.font = `${cellWidth - 1}px "JetBrains Mono Variable", monospace`
    context.textBaseline = 'top'
    const cols = Math.ceil(width / cellWidth)
    const rows = Math.ceil(height / cellHeight)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const qx = x * cellWidth
        const qy = y * cellHeight
        const nx = x * 0.07
        const ny = y * 0.11
        let value =
          (Math.sin(nx + time * 0.00035) +
            Math.sin(ny * 1.4 - time * 0.00027 + nx * 0.4) +
            Math.sin((nx - ny) * 0.6 + time * 0.0002)) /
            6 +
          0.5
        value = Math.pow(value, 2.2)
        let quiet = 1
        for (const zone of calm) {
          const dx = Math.max(zone.left - qx, 0, qx - zone.right)
          const dy = Math.max(zone.top - qy, 0, qy - zone.bottom)
          quiet = Math.min(quiet, Math.min(1, Math.hypot(dx, dy) / fall))
        }
        const distance = Math.hypot(qx - glow.x, qy - glow.y)
        // The ripple thins out around text too, so the name and tagline are never painted over.
        const ripple =
          distance < 260 && glow.strength > 0.01
            ? (1 - distance / 260) *
              (0.55 + 0.45 * Math.sin(distance * 0.07 - time * 0.008)) *
              glow.strength *
              quiet *
              quiet
            : 0
        const level = Math.min(0.999, value * 0.8 * (0.1 + 0.9 * quiet) + ripple * 0.9)
        const index = Math.floor(level * chars.length)
        if (index < 1) continue
        // The ripple's characters are drawn faint, so it reads as a soft tint rather than solid orange.
        const rippling = ripple > 0.28
        context.globalAlpha = rippling ? 0.3 : 1
        context.fillStyle = rippling ? accent : `rgba(${ink},${(0.06 + level * 0.24).toFixed(3)})`
        context.fillText(chars[index], qx, qy)
      }
    }
  }

  // Off screen the loop stops scheduling frames altogether, and starts again when the canvas comes back.
  const loop = (time: number) => {
    frame = 0
    if (!visible) return
    if (time - last > 33) {
      draw(time)
      last = time
    }
    frame = requestAnimationFrame(loop)
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible && motion && !frame) frame = requestAnimationFrame(loop)
  })
  observer.observe(canvas)

  if (motion) {
    window.addEventListener('pointermove', onPointer, { passive: true })
    frame = requestAnimationFrame(loop)
  } else {
    const still = () => draw(4000)
    still()
    window.addEventListener('resize', still)
    // The still frame is redrawn when the theme changes, since nothing else would repaint it.
    const themeWatch = new MutationObserver(still)
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => {
      observer.disconnect()
      themeWatch.disconnect()
      window.removeEventListener('resize', still)
    }
  }

  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    window.removeEventListener('pointermove', onPointer)
  }
}
