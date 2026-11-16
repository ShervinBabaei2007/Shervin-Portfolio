import ContactForm from '@/components/shared/ContactForm'
import PageHero from '@/components/shared/PageHero'
import Reveal from '@/components/shared/Reveal'
import { useCopy } from '@/hooks/useCopy'
import { useVancouverClock } from '@/hooks/useVancouverClock'
import { availabilityLine, site } from '@/data/site'
import { toast } from 'sonner'

const routes = [
  { label: 'LinkedIn', detail: 'Connect professionally', href: site.linkedin, mark: '↗' },
  { label: 'GitHub', detail: "See what I'm building", href: site.github, mark: '↗' },
  {
    label: 'Resume',
    detail: 'Download PDF',
    href: '/Shervin-Babaei-Resume.pdf',
    mark: '↓',
    download: 'Shervin-Babaei-Resume.pdf',
  },
]

const rowClass = 'flex items-center justify-between gap-4 border-b border-foreground/15 py-[22px]'
const labelClass = 'block font-mono text-[13px] text-muted-foreground'
const valueClass = 'block font-display text-[clamp(1.25rem,1.8vw,1.5rem)] font-semibold tracking-[-0.025em]'

/** The Contact page: every way to reach me on the left, the form on the right. */
function ContactPage() {
  const { copied, copy } = useCopy()
  const clock = useVancouverClock(15_000)

  const copyEmail = async () => {
    if (await copy(site.email)) toast.success('Email copied', { description: site.email })
    else toast.error('Could not copy', { description: `Email me at ${site.email}` })
  }

  return (
    <>
      <PageHero
        id="contact-page-title"
        command="mail shervin"
        width="medium"
        title={
          <>
            Have an interesting <span className="text-primary">problem?</span>
          </>
        }
        lead={`${availabilityLine()} Tell me what you're building and I'll reply within two business days.`}
      />
      <section className="section-wrap pb-[clamp(88px,10vw,144px)]" aria-label="Ways to reach me">
        <div className="flex flex-wrap items-start gap-[clamp(40px,5vw,72px)]">
          <Reveal>
            <div className="min-w-0 flex-[5_1_320px] border-t border-foreground/15">
              <div className={rowClass}>
                <span className="min-w-0">
                  <span className={labelClass}>Email</span>
                  <a
                    href={`mailto:${site.email}`}
                    className={`${valueClass} flex min-h-11 items-center [overflow-wrap:anywhere] text-foreground no-underline hover:text-primary`}
                  >
                    {site.email}
                  </a>
                </span>
                <button
                  type="button"
                  onClick={() => void copyEmail()}
                  aria-label={copied ? 'Email copied' : 'Copy email'}
                  className="h-11 flex-none cursor-pointer rounded-full border border-foreground/25 bg-transparent px-4 font-mono text-[13px] text-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              {routes.map(({ label, detail, href, mark, download }) => (
                <a
                  key={label}
                  href={href}
                  {...(download ? { download } : { target: '_blank', rel: 'noreferrer' })}
                  className={`${rowClass} text-foreground no-underline transition-colors hover:text-primary`}
                >
                  <span>
                    <span className={labelClass}>{label}</span>
                    <span className={valueClass}>{detail}</span>
                  </span>
                  <span aria-hidden="true">{mark}</span>
                </a>
              ))}
              <p className="mt-6 mb-0 font-mono text-[13px] text-muted-foreground">
                {site.location}
                {clock && ` · local time ${clock.short.split(' ')[0]}`}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex min-w-0 flex-[7_1_420px] flex-col gap-6 rounded-lg bg-surface-hover p-[clamp(24px,3vw,40px)]">
              <div>
                <h2 className="m-0 text-[clamp(1.75rem,2.6vw,2.25rem)] leading-none tracking-[-0.035em]">
                  Send a message
                </h2>
                <p className="mt-2 mb-0 text-base text-text-body">
                  Tell me about the role or the project. It goes straight to my inbox.
                </p>
              </div>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default ContactPage
