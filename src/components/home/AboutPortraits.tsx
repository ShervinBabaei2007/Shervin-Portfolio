import { BorderBeam } from '@/components/ui/border-beam'
import { cn } from '@/lib/utils'

type Photo = {
  name: string
  alt: string
  /** Pixel widths of the generated files, smallest first. */
  widths: [number, number]
  sizes: string
  className: string
}

// Files come from `node scripts/portrait.mjs` (public/about/portrait-*-*.*), all 4:5. The beach shot is the hero: it
// fills the left two columns and both rows, with the other two photos stacked beside it.
const hero: Photo = {
  name: 'portrait-c',
  alt: 'Shervin Babaei in an olive zip hoodie on a rocky shoreline, with the water and the bay behind him',
  widths: [480, 720],
  sizes: '(min-width: 640px) 342px, 62vw',
  className: 'col-span-2 row-span-2 max-[620px]:col-span-1 max-[620px]:row-span-1 max-[620px]:aspect-[4/5]',
}

const supporting: Photo[] = [
  {
    name: 'portrait-a',
    alt: 'Shervin Babaei outdoors in a grey hoodie, in front of a carved wooden totem',
    widths: [320, 480],
    sizes: '(min-width: 640px) 163px, 30vw',
    className: 'aspect-[4/5]',
  },
  {
    name: 'portrait-b',
    alt: 'Shervin Babaei in a red polo, seated at home',
    widths: [320, 480],
    sizes: '(min-width: 640px) 163px, 30vw',
    className: 'aspect-[4/5]',
  },
]

/** One framed photo; the featured one loads eagerly and gets the glowing border. */
function Card({ photo, featured = false }: { photo: Photo; featured?: boolean }) {
  const {
    name,
    alt,
    widths: [small, large],
    sizes,
    className,
  } = photo

  // Lists both generated widths of the photo in the given file format.
  function srcSet(extension: string): string {
    return `/about/${name}-${small}.${extension} ${small}w, /about/${name}-${large}.${extension} ${large}w`
  }

  return (
    <figure
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 ring-1 ring-black/20',
        'shadow-[0_24px_60px_-24px_rgba(0,0,0,.75)]',
        featured && 'shadow-[0_30px_80px_-28px_color-mix(in_srgb,var(--primary)_45%,transparent)]',
        className,
      )}
    >
      <picture>
        <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
        <img
          src={`/about/${name}-${large}.jpg`}
          srcSet={srcSet('jpg')}
          sizes={sizes}
          width={large}
          // Every photo is 4:5, so the height is 1.25 times the width.
          height={Math.round(large * 1.25)}
          alt={alt}
          loading={featured ? 'eager' : 'lazy'}
          decoding="async"
          className="size-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
        />
      </picture>
      {featured && (
        <BorderBeam size={120} duration={9} colorFrom="var(--primary)" colorTo="var(--primary)" borderWidth={1.5} />
      )}
    </figure>
  )
}

/** The photo grid in the About section: one large photo with two smaller ones beside it. */
function AboutPortraits() {
  return (
    <div
      role="group"
      aria-label="Photos of Shervin"
      className="mt-8 grid max-w-[520px] grid-cols-3 gap-4 pb-6 max-[620px]:mt-6 max-[620px]:gap-3 max-[620px]:pb-2"
    >
      <Card photo={hero} featured />
      {supporting.map((photo) => (
        <Card key={photo.name} photo={photo} />
      ))}
    </div>
  )
}

export default AboutPortraits
