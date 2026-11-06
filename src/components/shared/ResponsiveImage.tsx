import images from '@/data/images.json'

type ImageInfo = { width: number; height: number; small?: { src: string; width: number } }
const catalog = images as Record<string, ImageInfo>

type ResponsiveImageProps = {
  src: string
  alt: string
  /** How wide the image is drawn, for the browser to pick a file. See MDN "sizes". */
  sizes: string
  priority?: boolean
}

/**
 * Screenshot with intrinsic width/height (no layout shift) and, when a 480px
 * copy exists, a srcset so phones download the smaller file.
 * Sizes come from src/data/images.json, written by `npm run images`.
 */
function ResponsiveImage({ src, alt, sizes, priority = false }: ResponsiveImageProps) {
  const info = catalog[src]
  return (
    <img
      src={src}
      alt={alt}
      width={info?.width}
      height={info?.height}
      srcSet={info?.small ? `${info.small.src} ${info.small.width}w, ${src} ${info.width}w` : undefined}
      sizes={info?.small ? sizes : undefined}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}

export default ResponsiveImage
