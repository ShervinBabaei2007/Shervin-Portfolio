import { ArrowRight, Code2 } from 'lucide-react'
import { Link } from 'react-router-dom'

function AboutSection() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="section-wrap about-grid">
        <div className="about-heading"><p className="eyebrow"><span className="eyebrow-mark">03</span> A LITTLE ABOUT ME</p><h2 id="about-title">Curious by<br />default<span>.</span></h2><div className="about-stamp"><Code2 size={22} /><span>BUILD<br />UNDERSTAND<br />REPEAT</span></div></div>
        <div className="about-copy">
          <p className="about-lead">I came to full-stack development because I wanted to understand the whole picture, not just the screen.</p>
          <p>I&apos;m studying for a Diploma in Full-Stack Web Development at BCIT, with an 88% GPA and an expected graduation in May 2027. My coursework includes object-oriented programming, databases, Agile development, UX/UI, and web application development.</p>
          <p>I like understanding how an application works from the interface through the API and data layer. That curiosity is why my side projects lean toward the parts users never see: rate limiters, async workers, and running a language model on my own machine. I&apos;m also learning lower-level languages like C, and I&apos;m looking for an internship, co-op, or junior role where I can contribute, learn from a team, and keep building that understanding.</p>
          <Link className="text-link about-link" to="/resume">Read my resume <ArrowRight size={15} /></Link>
        </div>
        <div className="about-footnote"><span>BASED IN</span><b>Vancouver / Burnaby</b><span>FOCUSED ON</span><b>Full-stack + CS</b></div>
      </div>
    </section>
  )
}

export default AboutSection
