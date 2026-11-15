import images from '@/data/images.json'

// Pixel sizes of every generated screenshot, keyed by its path (written by `npm run images`).
const catalog = images as Record<string, { width: number; height: number }>

/**
 * A screenshot's shape: phone shots (over 1.2 times taller than wide) are 'portrait', the rest 'wide'.
 * An image missing from the catalog has no known shape.
 */
export function screenshotShape(src: string): 'portrait' | 'wide' | undefined {
  const info = catalog[src]
  if (!info) return undefined
  return info.height / info.width > 1.2 ? 'portrait' : 'wide'
}
