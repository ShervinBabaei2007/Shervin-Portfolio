import { ArrowUpRight, FlaskConical } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageIntro from '@/components/shared/PageIntro'
import RateLimiterDemo from '@/components/shared/RateLimiterDemo'

function LabPage() {
  return (
    <section className="lab-section section-wrap" aria-labelledby="lab-title">
      <PageIntro
        eyebrow="THE LAB"
        id="lab-title"
        title="Break the assumption"
        lead="I learn fastest when a system disagrees with me. So here's one mistake you can reproduce yourself."
      />

      <div className="lab-story">
        <div className="lab-story-mark" aria-hidden="true">
          <FlaskConical size={22} />
        </div>
        <div>
          <span>THE ASSUMPTION THAT FAILED</span>
          <p>
            I gave every ThinkBoard visitor the same Redis rate-limit key. One busy person could spend everyone
            else&apos;s request budget.
          </p>
        </div>
        <div>
          <span>WHAT CHANGED IN MY MODEL</span>
          <p>
            A rate limiter is only fair if its identity matches the thing you&apos;re trying to protect. The algorithm
            was fine; my key was wrong.
          </p>
        </div>
      </div>

      <RateLimiterDemo compact />

      <p className="lab-afterword">
        The interesting part isn&apos;t the mistake. It&apos;s being able to reproduce it, explain the system behind it,
        and name the better design.{' '}
        <Link to="/work/thinkboard">
          Read the ThinkBoard case study <ArrowUpRight size={15} />
        </Link>
      </p>
    </section>
  )
}

export default LabPage
