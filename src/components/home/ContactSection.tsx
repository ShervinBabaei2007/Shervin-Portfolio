import { ArrowUpRight, FileText, Github, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'
import ContactForm from '@/components/home/ContactForm'
import VancouverGlobe from '@/components/home/VancouverGlobe'
import CopyEmailButton from '@/components/shared/CopyEmailButton'
import SectionHeading from '@/components/shared/SectionHeading'
import { Button } from '@/components/ui/button'
import { Highlighter } from '@/components/ui/highlighter'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { availabilityLine, site } from '@/data/site'

const links = [
  { label: 'LinkedIn', detail: 'Connect professionally', href: site.linkedin, Icon: Linkedin },
  { label: 'GitHub', detail: "See what I'm building", href: site.github, Icon: Github },
]

function ContactSection() {
  return (
    <section className="border-t py-20 max-[620px]:py-14" id="contact" aria-labelledby="contact-title">
      <div className="section-wrap grid items-stretch gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col">
          <SectionHeading
            id="contact-title"
            number="05"
            eyebrow="NEXT STEP"
            title={
              <>
                Have an{' '}
                <Highlighter action="underline" color="#f5b042" strokeWidth={2.5} iterations={2} padding={3} isView>
                  interesting problem
                </Highlighter>
              </>
            }
            punctuation="?"
          />
          <p className="mt-6 leading-relaxed text-muted-foreground">
            {availabilityLine()} Tell me what you&apos;re building and I&apos;ll reply within two business days.
          </p>
          <div className="mt-8">
            <VancouverGlobe />
          </div>
          <ul className="mt-6 grid gap-2 lg:mt-auto lg:pt-6" aria-label="Contact and social links">
            {links.map(({ label, detail, href, Icon }) => (
              <li key={label}>
                <Button asChild variant="outline" className="h-12 w-full justify-between px-4">
                  <a href={href} target="_blank" rel="noreferrer">
                    <span className="inline-flex items-center gap-3">
                      <Icon /> {label}
                      <span className="font-normal text-muted-foreground">{detail}</span>
                    </span>
                    <ArrowUpRight />
                  </a>
                </Button>
              </li>
            ))}
            <li>
              <Button asChild variant="outline" className="h-12 w-full justify-between px-4">
                <Link to="/resume">
                  <span className="inline-flex items-center gap-3">
                    <FileText /> Resume
                    <span className="font-normal text-muted-foreground">View resume</span>
                  </span>
                  <ArrowUpRight />
                </Link>
              </Button>
            </li>
          </ul>
        </div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Send a message</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span>
                Or email{' '}
                <a className="text-foreground underline underline-offset-4" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </span>
              <CopyEmailButton />
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default ContactSection
