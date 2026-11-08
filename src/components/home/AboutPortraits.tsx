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
  className: 'col-span-2 row-span-2',
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

function Card({ photo, featured = false }: { photo: Photo; featured?: boolean }) {
  const {
    name,
    alt,
    widths: [small, large],
    sizes,
    className,
  } = photo
  return (
    <figure
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 ring-1 ring-black/20',
        'shadow-[0_24px_60px_-24px_rgba(0,0,0,.75)]',
        featured && 'shadow-[0_30px_80px_-28px_rgba(138,164,255,.45)]',
        className,
      )}
    >
      <picture>
        <source
          type="image/avif"
          srcSet={`/about/${name}-${small}.avif ${small}w, /about/${name}-${large}.avif ${large}w`}
          sizes={sizes}
        />
        <source
          type="image/webp"
          srcSet={`/about/${name}-${small}.webp ${small}w, /about/${name}-${large}.webp ${large}w`}
          sizes={sizes}
        />
        <img
          src={`/about/${name}-${large}.jpg`}
          srcSet={`/about/${name}-${small}.jpg ${small}w, /about/${name}-${large}.jpg ${large}w`}
          sizes={sizes}
          width={large}
          height={Math.round(large * 1.25)}
          alt={alt}
          loading={featured ? 'eager' : 'lazy'}
          decoding="async"
          className="size-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
        />
      </picture>
      {featured && <BorderBeam size={120} duration={9} colorFrom="#8aa4ff" colorTo="#f5b042" borderWidth={1.5} />}
    </figure>
  )
}

function AboutPortraits() {
  return (
    <div role="group" aria-label="Photos of Shervin" className="mt-8 grid max-w-[520px] grid-cols-3 gap-4 pb-6">
      <Card photo={hero} featured />
      {supporting.map((photo) => (
        <Card key={photo.name} photo={photo} />
      ))}
    </div>
  )
}

export default AboutPortraits
