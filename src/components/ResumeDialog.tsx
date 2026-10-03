import { useEffect, useRef } from 'react';
import { ArrowUpRight, FileDown } from 'lucide-react';
import { resume } from '../data/resume';

type ResumeDialogProps = {
  onClose: () => void;
};

function ResumeDialog({ onClose }: ResumeDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open as a modal as soon as the (lazy-loaded) component mounts.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="case-study-dialog resume-dialog"
      aria-labelledby="resume-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
    >
      <div className="case-study-content resume-content">
        <div className="case-study-header">
          <p className="eyebrow">
            <span className="eyebrow-mark">CV</span> RESUME
          </p>
          <div className="resume-toolbar">
            <a className="resume-download" href="/Shervin_Babaei_Resume.pdf" download="Shervin_Babaei_Resume.pdf">
              Download PDF <FileDown size={16} />
            </a>
            <form method="dialog">
              <button className="case-study-close" aria-label="Close resume">
                ×
              </button>
            </form>
          </div>
        </div>

        <header className="resume-head">
          <h2 id="resume-title">{resume.name}</h2>
          <p className="resume-role">{resume.title}</p>
          <p className="resume-contact">
            <span>{resume.location}</span>
            <a href={`mailto:${resume.email}`}>{resume.email}</a>
            {resume.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </p>
        </header>

        <section className="resume-section" aria-labelledby="resume-summary">
          <h3 id="resume-summary">Summary</h3>
          <p>{resume.summary}</p>
        </section>

        <section className="resume-section" aria-labelledby="resume-education">
          <h3 id="resume-education">Education</h3>
          <div className="resume-row-split">
            <strong>
              {resume.education.school} – {resume.education.gpa}
            </strong>
            <span>{resume.education.date}</span>
          </div>
          <p>{resume.education.program}</p>
          <p className="resume-muted">
            <b>Relevant coursework:</b> {resume.education.coursework}
          </p>
        </section>

        <section className="resume-section" aria-labelledby="resume-skills">
          <h3 id="resume-skills">Skills</h3>
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
          <h3 id="resume-projects">Projects</h3>
          {resume.projects.map((project) => (
            <article className="resume-project" key={project.name}>
              <div className="resume-row-split">
                <strong>
                  {project.name}
                  {project.detail && <> – {project.detail}</>}
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
            </article>
          ))}
        </section>
      </div>
    </dialog>
  );
}

export default ResumeDialog;
