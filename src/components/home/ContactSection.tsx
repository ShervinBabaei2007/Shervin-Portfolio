import { ArrowUpRight, Download, Github, Linkedin, Mail, MessageSquare, type LucideIcon } from 'lucide-react'
import ContactForm from '@/components/home/ContactForm'
import VancouverGlobe from '@/components/home/VancouverGlobe'
import CopyEmailButton from '@/components/shared/CopyEmailButton'
import SectionHeading from '@/components/shared/SectionHeading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Highlighter } from '@/components/ui/highlighter'
import { availabilityLine, site } from '@/data/site'
import { highlightColor } from '@/lib/colors'
import { raised } from '@/lib/surfaces'
import { cn } from '@/lib/utils'

// One row of the details card: an icon chip, a label with its detail, and what sits at the right edge.
const row =
  'flex items-center gap-4 border-t px-5 py-4 no-underline transition-colors max-[620px]:px-4 max-[620px]:py-3.5'
const chip = 'grid size-10 flex-none place-items-center rounded-lg bg-primary/10 text-primary'

// External profile links, then the resume.
const links: { label: string; detail: string; href: string; Icon: LucideIcon; download?: string }[] = [
  { label: 'LinkedIn', detail: 'Connect professionally', href: site.linkedin, Icon: Linkedin },
  { label: 'GitHub', detail: "See what I'm building", href: site.github, Icon: Github },
  {
    label: 'Resume',
    detail: 'Download PDF',
    href: '/Shervin-Babaei-Resume.pdf',
    Icon: Download,
    download: 'Shervin-Babaei-Resume.pdf',
  },
]

/** The home page contact section: availability on the left with every way to reach me, the form on the right. */
function ContactSection() {
  return (
    <section className="border-t section-y" id="contact" aria-labelledby="contact-title">
      <div className="section-wrap grid grid-cols-[minmax(0,1fr)] items-stretch gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex min-w-0 flex-col">
          <SectionHeading
            id="contact-title"
            number="05"
            eyebrow="NEXT STEP"
            title={
              <>
                Have an{' '}
                <Highlighter
                  action="underline"
                  color={highlightColor}
                  strokeWidth={2.5}
                  iterations={2}
                  padding={3}
                  isView
                >
                  interesting problem
                </Highlighter>
              </>
            }
            punctuation="?"
            className="mb-6"
          />
          <p className="measure leading-relaxed text-muted-foreground">
            {availabilityLine()} Tell me what you&apos;re building and I&apos;ll reply within two business days.
          </p>
          {/* Everything in one card: where I am, then email, profiles and the resume as a tidy list. */}
          <Card className={cn('mt-8 gap-0 overflow-hidden rounded-2xl py-0', raised)}>
            <div className="[&>div]:rounded-none [&>div]:border-0 [&>div]:bg-muted/40">
              <VancouverGlobe />
            </div>
            <ul className="m-0 list-none p-0" aria-label="Contact and social links">
              <li className={`${row} flex-wrap max-[620px]:gap-y-3`}>
                <span className={chip} aria-hidden="true">
                  <Mail size={18} />
                </span>
                <span className="min-w-[11rem] flex-1">
                  <span className="block font-semibold">Email</span>
                  <a
                    className="block [overflow-wrap:anywhere] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    href={`mailto:${site.email}`}
                  >
                    {site.email}
                  </a>
                </span>
                <CopyEmailButton />
              </li>
              {links.map(({ label, detail, href, Icon, download }) => (
                <li key={label}>
                  <a
                    className={`${row} group hover:bg-muted focus-visible:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring`}
                    href={href}
                    {...(download ? { download } : { target: '_blank', rel: 'noreferrer' })}
                  >
                    <span className={chip} aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-foreground">{label}</span>
                      <span className="block text-muted-foreground">{detail}</span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="flex-none text-muted-foreground transition-colors group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <Card className={cn('h-full min-w-0 gap-0 overflow-hidden rounded-2xl py-0', raised)}>
          {/* A tinted header strip, so the form reads as a finished panel and not a white box on the page. */}
          <CardHeader className="flex items-center gap-4 border-b bg-muted/70 px-6 py-5 max-[620px]:px-4">
            <span className={chip} aria-hidden="true">
              <MessageSquare size={18} />
            </span>
            <div className="grid gap-1">
              <CardTitle className="text-h3">Send a message</CardTitle>
              <CardDescription className="text-base">
                Tell me about the role or the project. It goes straight to my inbox.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col p-6 max-[620px]:p-4">
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default ContactSection
