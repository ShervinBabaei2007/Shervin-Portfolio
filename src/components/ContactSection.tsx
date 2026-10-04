import { ArrowUpRight, FileText, Github, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { availabilityLine, site } from '../data/site'

function ContactSection() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="section-wrap contact-inner">
        <div className="contact-copy">
          <p className="eyebrow"><span className="eyebrow-mark">06</span> NEXT STEP</p>
          <h2 id="contact-title">Have a good<br />problem<span>?</span></h2>
          <p>{availabilityLine()} Tell me what you&apos;re building and I&apos;ll reply within two business days.</p>
          <a className="button button-light" href={`mailto:${site.email}`}>Email me <ArrowUpRight size={16} /></a>
        </div>
        <div className="contact-links" aria-label="Contact and social links">
          <a href={site.linkedin} target="_blank" rel="noreferrer"><span><Linkedin size={17} /> LINKEDIN</span><b>Connect professionally</b><ArrowUpRight size={16} /></a>
          <a href={site.github} target="_blank" rel="noreferrer"><span><Github size={17} /> GITHUB</span><b>See what I&apos;m building</b><ArrowUpRight size={16} /></a>
          <Link className="resume-row" to="/resume"><span><FileText size={17} /> RESUME</span><b>View resume</b><ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
