import images from '@/data/images.json'

type ImageInfo = { width: number; height: number; avif?: boolean; small?: { src: string; width: number } }
// Size and variant info for every image, keyed by its path.
const catalog = images as Record<string, ImageInfo>

type ResponsiveImageProps = {
  src: string
  alt: string
  /** How wide the image is drawn, for the browser to pick a file. See MDN "sizes". */
  sizes: string
  /** Above-the-fold images load eagerly and are fetched first. */
  priority?: boolean
}

// The AVIF copy sits next to each WebP file under the same name.
const toAvif = (path: string) => path.replace(/\.webp$/, '.avif')

/**
 * Screenshot with intrinsic width/height (no layout shift), an AVIF source for
 * browsers that support it, and, when a 480px copy exists, a srcset so phones
 * download the smaller file. File info comes from src/data/images.json,
 * written by `npm run images`.
 */
function ResponsiveImage({ src, alt, sizes, priority = false }: ResponsiveImageProps) {
  const info = catalog[src]
  const srcSet = info?.small ? `${info.small.src} ${info.small.width}w, ${src} ${info.width}w` : undefined
  // `sizes` only matters when there is a choice of files.
  const sizesAttr = info?.small ? sizes : undefined
  return (
    // display: contents keeps the <picture> wrapper from affecting layout; the <img> stays the layout box.
    <picture className="contents">
      {info?.avif && (
        <source
          type="image/avif"
          srcSet={
            info.small ? `${toAvif(info.small.src)} ${info.small.width}w, ${toAvif(src)} ${info.width}w` : toAvif(src)
          }
          sizes={sizesAttr}
        />
      )}
      <img
        src={src}
        alt={alt}
        width={info?.width}
        height={info?.height}
        srcSet={srcSet}
        sizes={sizesAttr}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
      />
    </picture>
  )
}

export default ResponsiveImage
