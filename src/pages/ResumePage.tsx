import { ArrowUpRight, FileDown } from 'lucide-react'
import { resume } from '../data/resume'

function ResumePage() {
  return (
    <article className="resume-page section-wrap" aria-labelledby="resume-title">
      <div className="resume-toolbar">
        <p className="eyebrow">RESUME</p>
        <a
          className="button button-secondary resume-download"
          href="/Shervin_Babaei_Resume.pdf"
          download="Shervin_Babaei_Resume.pdf"
        >
          Download PDF <FileDown size={16} />
        </a>
      </div>

      <div className="resume-sheet">
        <header className="resume-head">
          <h1 id="resume-title">{resume.name}</h1>
          <p className="resume-role">{resume.title}</p>
          <p className="resume-contact">
            <span>{resume.location}</span>
            <span className="print-only">{resume.phone}</span>
            <a href={`mailto:${resume.email}`}>{resume.email}</a>
            {resume.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </p>
        </header>

        <section className="resume-section" aria-labelledby="resume-summary">
          <h2 id="resume-summary">Summary</h2>
          <p>{resume.summary}</p>
        </section>

        <section className="resume-section" aria-labelledby="resume-education">
          <h2 id="resume-education">Education</h2>
          <div className="resume-row-split">
            <strong>
              {resume.education.school}, {resume.education.gpa}
            </strong>
            <span>{resume.education.date}</span>
          </div>
          <p>{resume.education.program}</p>
          <p className="resume-muted">
            <b>Relevant coursework:</b> {resume.education.coursework}
          </p>
        </section>

        <section className="resume-section" aria-labelledby="resume-skills">
          <h2 id="resume-skills">Skills</h2>
          <dl className="resume-skills">
            {resume.skills.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="resume-section" aria-labelledby="resume-projects">
          <h2 id="resume-projects">Projects</h2>
          {resume.projects.map((project) => (
            <div className="resume-project" key={project.name}>
              <div className="resume-row-split">
                <strong>
                  {project.name}
                  {project.detail && <>, {project.detail}</>}
                </strong>
                <span>{project.date}</span>
              </div>
              {project.links && (
                <p className="resume-links">
                  {project.links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                      {link.label} <ArrowUpRight size={13} />
                    </a>
                  ))}
                </p>
              )}
              <p className="resume-stack">{project.stack}</p>
              {project.role && (
                <p className="resume-muted">
                  <b>Role:</b> {project.role}
                </p>
              )}
              <ul>
                {project.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
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
