import { ArrowUpRight, FileDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { resume } from '../data/resume'
import { Button } from '@/components/ui/button'

/*
 * The print: variants below also produce the downloadable PDF (npm run resume:pdf prints this page),
 * so they are tuned for one US Letter page. The @page size and margins live in tailwind.css.
 * Sizes mirror the old stylesheet's computed result: its `.resume-sheet p` rule (9.5pt) outranked the
 * per-class print sizes, so every <p> prints at 9.5pt. Change these with the PDF in view.
 */
const tapTarget =
  "max-[620px]:relative max-[620px]:after:absolute max-[620px]:after:inset-y-[-12px] max-[620px]:after:inset-x-[-4px] max-[620px]:after:content-['']"
const contactLink = cn('text-primary underline underline-offset-[3px]', tapTarget)
const sectionClass = 'mt-[26px] border-t pt-[18px] print:mt-2 print:pt-1.5'
const sectionHeading =
  'mb-3 font-mono text-[.875rem] leading-[normal] font-normal tracking-[.06em] uppercase print:mb-1.5 print:text-[9pt]'
// Built as plain strings (not cn): tailwind-merge would drop the leading-* when a text-* size follows it.
const bodyBase = 'mt-1.5 leading-[1.6] print:mt-px print:leading-[1.26]'
const bodyText = `${bodyBase} print:text-[9.5pt]`
const mutedText = `${bodyBase} text-[.9375rem] text-muted-foreground print:text-[9.5pt]`
const stackText = `${bodyBase} font-mono text-meta print:text-[9.5pt]`
const rowSplit = 'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1'
const rowDate = 'font-mono text-meta leading-[normal] text-muted-foreground print:text-[8.5pt]'

function ResumePage() {
  return (
    <article
      className="section-wrap max-w-[860px] pt-10 pb-[100px] print:max-w-none print:p-0"
      aria-labelledby="resume-title"
    >
      <div className="flex items-center justify-between gap-3.5 print:hidden">
        <p className="eyebrow">RESUME</p>
        <Button asChild variant="outline" size="lg" className="h-11 px-[17px] text-control font-semibold">
          <a href="/Shervin_Babaei_Resume.pdf" download="Shervin_Babaei_Resume.pdf">
            Download PDF <FileDown />
          </a>
        </Button>
      </div>

      <div className="mt-[18px] rounded-[12px] border bg-card px-10 pt-9 pb-10 max-[620px]:px-[18px] max-[620px]:pt-[22px] max-[620px]:pb-[26px] print:m-0 print:rounded-none print:border-0 print:bg-transparent print:p-0 print:text-[9.5pt]">
        <header>
          <h1 id="resume-title" className="text-[2.5rem] leading-[1.1] max-[620px]:text-[2rem] print:text-[20pt]">
            {resume.name}
          </h1>
          <p className="mt-1.5 text-[1.125rem] text-muted-foreground print:text-[9.5pt]">{resume.title}</p>
          <p className="mt-3 flex flex-wrap gap-x-[18px] gap-y-1 text-[.9375rem] print:mt-1.5 print:text-[9.5pt]">
            {resume.links.map((link) => (
              <a className={contactLink} key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </p>
        </header>

        <section className={sectionClass} aria-labelledby="resume-summary">
          <h2 id="resume-summary" className={sectionHeading}>
            Summary
          </h2>
          <p className={bodyText}>{resume.summary}</p>
        </section>

        <section className={sectionClass} aria-labelledby="resume-education">
          <h2 id="resume-education" className={sectionHeading}>
            Education
          </h2>
          <div className={rowSplit}>
            <strong>
              {resume.education.school}, {resume.education.gpa}
            </strong>
            <span className={rowDate}>{resume.education.date}</span>
          </div>
          <p className={bodyText}>{resume.education.program}</p>
          <p className={mutedText}>
            <b>Relevant coursework:</b> {resume.education.coursework}
          </p>
        </section>

        <section className={sectionClass} aria-labelledby="resume-skills">
          <h2 id="resume-skills" className={sectionHeading}>
            Skills
          </h2>
          <dl className="grid gap-2 print:gap-0.5">
            {resume.skills.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[minmax(150px,.35fr)_1fr] gap-x-4 gap-y-1 max-[620px]:grid-cols-1 print:grid-cols-[1.4in_1fr]"
              >
                <dt className="font-semibold print:text-[9.5pt]">{label}</dt>
                <dd className="text-muted-foreground print:text-[9.5pt]">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={sectionClass} aria-labelledby="resume-projects">
          <h2 id="resume-projects" className={sectionHeading}>
            Projects
          </h2>
          {resume.projects.map((project, index) => (
            <div
              className={cn(
                index > 0 && 'mt-[22px] border-t border-dashed pt-[18px] print:mt-1.5 print:pt-1.5',
                'print:break-inside-avoid',
              )}
              key={project.name}
            >
              <div className={rowSplit}>
                <strong>
                  {project.name}
                  {project.detail && <>, {project.detail}</>}
                </strong>
                <span className={rowDate}>{project.date}</span>
              </div>
              {project.links && (
                <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[.875rem] leading-[1.6] font-semibold print:mt-px print:mr-3.5 print:inline-flex print:text-[9.5pt] print:leading-[1.26]">
                  {project.links.map((link) => (
                    <a
                      className={cn(
                        contactLink,
                        'inline-flex min-h-7 items-center gap-1 print:min-h-0 print:[&_svg]:hidden',
                      )}
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label} <ArrowUpRight size={13} />
                    </a>
                  ))}
                </p>
              )}
              <p className={project.links ? `${stackText} print:inline` : stackText}>{project.stack}</p>
              {project.role && (
                <p className={mutedText}>
                  <b>Role:</b> {project.role}
                </p>
              )}
              <ul className="mt-2.5 list-disc pl-5 print:mt-1 print:pl-[15px]">
                {project.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="my-1.5 leading-[1.6] print:my-0.5 print:text-[9.2pt] print:leading-[1.26]"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </article>
  )
}

export default ResumePage
