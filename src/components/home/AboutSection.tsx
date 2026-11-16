import { Link } from 'react-router-dom'
import Reveal from '@/components/shared/Reveal'
import { Button } from '@/components/ui/button'
import SectionHeading from '@/components/shared/SectionHeading'
import { portraitSrcSet } from '@/lib/portraits'

// public/about/portrait-a-*, all 4:5.
const srcSet = (extension: string) => portraitSrcSet('portrait-a', [320, 480], extension)
const sizes = '(min-width: 900px) 380px, 90vw'

const links = [
  { to: '/resume', label: 'Read my resume' },
  { to: '/how-its-built', label: 'How this site is built' },
]

const textLink =
  'inline-flex min-h-11 items-center whitespace-nowrap text-foreground underline decoration-1 underline-offset-4 hover:text-primary'

/** About: a portrait, the one sentence that explains how I work, and the story behind it. */
function AboutSection() {
  return (
    <section className="section-wrap py-[clamp(88px,10vw,144px)]" id="about" aria-labelledby="about-title">
      <SectionHeading id="about-title" number="04" title="About" className="mb-[clamp(40px,5vw,64px)]" />
      <div className="flex flex-wrap items-center gap-[clamp(40px,6vw,96px)]">
        <Reveal>
          <figure className="m-0 min-w-0 flex-[4_1_260px]">
            <picture>
              <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
              <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
              <img
                src="/about/portrait-a-480.jpg"
                srcSet={srcSet('jpg')}
                sizes={sizes}
                width={480}
                height={600}
                alt="Shervin Babaei outdoors in a grey hoodie, in front of a carved wooden totem"
                loading="lazy"
                decoding="async"
                className="block aspect-[4/5] w-full max-w-[380px] rounded-md bg-surface-hover object-cover"
              />
            </picture>
          </figure>
        </Reveal>
        <div className="flex min-w-0 flex-[8_1_420px] flex-col gap-7">
          <Reveal>
            <p className="m-0 font-display text-[clamp(1.875rem,3.4vw,3.125rem)] leading-[1.08] font-medium tracking-[-0.035em] text-foreground">
              I keep following the request because <span className="text-primary">“it works”</span> has never been
              enough for me.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="m-0 max-w-[56ch] text-[17px] leading-[1.6] text-muted-foreground">
              My Discord bot once went silent for everyone while the model was thinking: one HTTP request inside an
              async function was blocking the event loop. A worker thread fixed it, and taught me code can look async
              and still not be.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            {/* The About page is the next step, so it is the one button; the other two are plain links on one line. */}
            <div className="mt-2 flex flex-col items-stretch gap-3">
              <Button
                asChild
                className="h-12 rounded-full bg-foreground px-[22px] text-[15px] font-normal text-background hover:bg-primary-fill hover:text-primary-foreground"
              >
                <Link to="/about">
                  More about me <span aria-hidden="true">→</span>
                </Link>
              </Button>
              <ul className="m-0 flex list-none flex-wrap gap-x-6 p-0 text-[15px] max-[380px]:gap-x-4 max-[380px]:text-[14px]">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className={textLink}>
                      {label}&nbsp;<span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
