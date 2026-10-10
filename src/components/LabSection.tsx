import { ArrowUpRight, FlaskConical } from 'lucide-react'
import { Link } from 'react-router-dom'
import RateLimiterDemo from './RateLimiterDemo'

function LabSection() {
  return (
    <section className="lab-section section-wrap" id="lab" aria-labelledby="lab-title">
      <div className="section-heading lab-heading">
        <div>
          <p className="eyebrow"><span className="eyebrow-mark">03</span> THE LAB</p>
          <h2 id="lab-title">Break the assumption<span>.</span></h2>
        </div>
        <p className="section-aside">I learn fastest when a system disagrees with me. <br />So here&apos;s one mistake you can reproduce yourself.</p>
      </div>

      <div className="lab-story">
        <div className="lab-story-mark" aria-hidden="true"><FlaskConical size={22} /></div>
        <div>
          <span>THE ASSUMPTION THAT FAILED</span>
          <p>I gave every ThinkBoard visitor the same Redis rate-limit key. One busy person could spend everyone else&apos;s request budget.</p>
        </div>
        <div>
          <span>WHAT CHANGED IN MY MODEL</span>
          <p>A rate limiter is only fair if its identity matches the thing you&apos;re trying to protect. The algorithm was fine; my key was wrong.</p>
        </div>
      </div>

      <RateLimiterDemo compact />

      <p className="lab-afterword">
        The interesting part isn&apos;t the mistake. It&apos;s being able to reproduce it, explain the system behind it, and name the better design.
        <Link to="/work/thinkboard"> Read the ThinkBoard case study <ArrowUpRight size={15} /></Link>
      </p>
    </section>
  )
}

export default LabSection
