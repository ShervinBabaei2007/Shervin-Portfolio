import { Link } from 'react-router-dom'
import { cn, textLinkClass } from '@/lib/utils'
import { resume } from '../data/resume'
import { Button } from '@/components/ui/button'
import { tone } from '@/lib/buttonTones'

/*
 * One plain, single-column document: no cards, icons or decoration, so it reads the same in a parser, on
 * screen and on paper. The print: variants also produce the downloadable PDF (npm run resume:pdf prints this
 * page). Type is 10pt in print and the PDF may run to two pages; do not shrink it to force one. The @page
 * margins and the navy accent colour (--resume-accent) live in tailwind.css. Change these with the PDF in view.
 */
const tapTarget =
  "max-[620px]:relative max-[620px]:after:absolute max-[620px]:after:inset-y-[-12px] max-[620px]:after:inset-x-[-4px] max-[620px]:after:content-['']"
const accent = 'text-[var(--resume-accent)]'
const link = cn(accent, 'font-semibold underline underline-offset-[3px]', tapTarget)
const section = 'mt-8 print:mt-[4pt]'
const sectionHeading = cn(
  accent,
  'mb-3 border-b border-[var(--resume-accent)] pb-1 text-[.8125rem] leading-[normal] font-bold tracking-[.1em] uppercase print:mb-[4pt] print:break-after-avoid print:pb-[1.5pt] print:text-[10pt]',
)
// Plain strings, not cn: tailwind-merge would drop the leading-* when a text-* size follows it.
const body = 'text-[.9375rem] leading-[1.55] print:text-[9pt] print:leading-[1.22]'
const bodyRow = `mt-1 print:mt-0 ${body}`
const mutedRow = `${bodyRow} text-muted-foreground`
const rowSplit = 'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5'
const rowTitle = 'text-[1rem] font-bold print:text-[10pt]'
const rowDate = 'text-[.875rem] whitespace-nowrap text-muted-foreground print:text-[9.5pt]'

function ResumePage() {
  return (
    <article
      className="section-wrap max-w-[880px] pt-10 pb-[100px] print:m-0 print:w-full print:max-w-none print:p-0"
      aria-labelledby="resume-title"
    >
      <div className="flex items-center justify-between gap-3.5 print:hidden">
        <p className="eyebrow">RESUME</p>
        <Button asChild size="lg" className={cn('h-11 px-[17px] text-control font-semibold shadow-md', tone.ink)}>
          <a href="/Shervin-Babaei-Resume.pdf" download="Shervin-Babaei-Resume.pdf">
            Download PDF
          </a>
        </Button>
      </div>

      <div className="resume-sheet mt-6 rounded-xl border bg-card px-12 pt-10 pb-11 max-[620px]:px-[18px] max-[620px]:pt-[22px] max-[620px]:pb-[26px] print:m-0 print:rounded-none print:border-0 print:bg-transparent print:p-0 print:text-[10pt]">
        <header className="text-center">
          <h1
            id="resume-title"
            className={cn(accent, 'text-[2.75rem] leading-[1.05] font-bold tracking-tight print:text-[26pt]')}
          >
            {resume.name}
          </h1>
          <p className="mt-1.5 text-[1.25rem] text-muted-foreground print:mt-[2pt] print:text-[12.5pt]">
            {resume.title}
          </p>
          <p className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[1rem] print:mt-[4pt] print:text-[10.5pt]">
            {resume.links.map((item) => (
              <a className={link} key={item.href} href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ))}
          </p>
        </header>

        <section className={section} aria-labelledby="resume-summary">
          <h2 id="resume-summary" className={sectionHeading}>
            Summary
          </h2>
          <p className={body}>{resume.summary}</p>
        </section>

        <section className={section} aria-labelledby="resume-education">
          <h2 id="resume-education" className={sectionHeading}>
            Education
          </h2>
          <div className={rowSplit}>
            <strong className={rowTitle}>
              {resume.education.school}, {resume.education.gpa}
            </strong>
            <span className={rowDate}>{resume.education.date}</span>
          </div>
          <p className={bodyRow}>{resume.education.program}</p>
          <p className={mutedRow}>
            <b>Relevant coursework:</b> {resume.education.coursework}
          </p>
        </section>

        <section className={section} aria-labelledby="resume-skills">
          <h2 id="resume-skills" className={sectionHeading}>
            Skills
          </h2>
          <dl className="grid gap-2 print:gap-[1pt]">
            {resume.skills.map(([label, value]) => (
              <div
                key={label}
                className={cn(
                  body,
                  'grid grid-cols-[11.5rem_1fr] gap-x-2 gap-y-0.5 max-[620px]:grid-cols-1 print:block',
                )}
              >
                <dt className="print:after:content-[' '] font-bold print:inline">{label}:</dt>
                <dd className="text-muted-foreground print:inline">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={section} aria-labelledby="resume-projects">
          <h2 id="resume-projects" className={sectionHeading}>
            Projects
          </h2>
          {resume.projects.map((project, index) => (
            <div className={cn(index > 0 && 'mt-6 print:mt-[3pt]', 'print:break-inside-avoid')} key={project.name}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <strong className={rowTitle}>
                  {project.name}
                  {project.detail && <span className="font-normal">, {project.detail}</span>}
                </strong>
                {project.links && (
                  <p
                    className={`${body} order-2 flex basis-full flex-wrap gap-x-2.5 gap-y-1 print:order-none print:basis-auto`}
                  >
                    {project.links.map((item) => (
                      <a
                        className={cn(link, 'inline-flex min-h-7 items-center print:min-h-0 pointer-coarse:min-h-11')}
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.label}
                      </a>
                    ))}
                  </p>
                )}
                <span className={cn(rowDate, 'order-1 ml-auto print:order-none')}>{project.date}</span>
              </div>
              <div className={cn(mutedRow, 'flex flex-wrap gap-x-4 print:mt-[3.5pt]')}>
                {project.role && (
                  <p>
                    <b>Role:</b> {project.role}
                  </p>
                )}
                <p>
                  <b>Stack:</b> {project.stack}
                </p>
              </div>
              <ul className="mt-2 list-disc pl-5 print:mt-[2pt] print:pl-[13pt]">
                {project.bullets.map((bullet) => (
                  <li key={bullet} className={cn(body, 'my-1 print:my-[0.25pt] print:leading-[1.25]')}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
      <p className="mt-8 flex flex-wrap gap-x-6 gap-y-1 print:hidden">
        <Link className={`${textLinkClass} min-h-11`} to="/projects">
          See the work behind it
        </Link>
        <Link className={`${textLinkClass} min-h-11`} to="/#contact">
          Get in touch
        </Link>
      </p>
    </article>
  )
}

export default ResumePage
