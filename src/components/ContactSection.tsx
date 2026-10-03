import { ArrowUpRight, FileDown, Github, Linkedin } from 'lucide-react'

function ContactSection() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="section-wrap contact-inner">
        <div className="contact-copy"><p className="eyebrow"><span className="eyebrow-mark">05</span> NEXT STEP</p><h2 id="contact-title">Have a good<br />problem<span>?</span></h2><p>I&apos;m looking for an internship, co-op, or junior role in Vancouver or Burnaby. Let&apos;s talk about what you&apos;re building.</p><a className="button button-light" href="mailto:shervinb22@gmail.com">Email me <ArrowUpRight size={16} /></a></div>
        <div className="contact-links" aria-label="Contact and social links">
          <a href="https://www.linkedin.com/in/shervin-babaei/" target="_blank" rel="noreferrer"><span><Linkedin size={17} /> LINKEDIN</span><b>Connect professionally</b><ArrowUpRight size={16} /></a>
          <a href="https://github.com/ShervinBabaei2007" target="_blank" rel="noreferrer"><span><Github size={17} /> GITHUB</span><b>See what I&apos;m building</b><ArrowUpRight size={16} /></a>
          <a className="resume-row" href="/Shervin_Babaei_Resume.pdf" download="Shervin_Babaei_Resume.pdf"><span><FileDown size={17} /> RESUME</span><b>Download PDF</b><ArrowUpRight size={16} /></a>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
