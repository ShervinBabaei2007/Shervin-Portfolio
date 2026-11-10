import { ArrowUpRight, FlaskConical } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageIntro from '@/components/shared/PageIntro'
import RateLimiterDemo from '@/components/shared/RateLimiterDemo'

const storyLabel = 'font-mono text-label leading-[normal] tracking-[.04em] text-primary'
const storyBody = 'mt-[7px] max-w-[44ch] leading-[1.62]'

function LabPage() {
  return (
    <section className="section-wrap page-y print:hidden" aria-labelledby="lab-title">
      <PageIntro
        eyebrow="THE LAB"
        id="lab-title"
        title="Break the assumption"
        lead="I learn fastest when a system disagrees with me. So here's one mistake you can reproduce yourself."
      />

      <div className="mt-[42px] grid grid-cols-[54px_minmax(0,1fr)_minmax(0,1fr)] gap-x-7 border-y py-[22px] max-[900px]:grid-cols-[44px_minmax(0,1fr)] max-[900px]:gap-5 max-[620px]:mt-7 max-[620px]:grid-cols-1">
        <div
          className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground max-[620px]:mb-3.5"
          aria-hidden="true"
        >
          <FlaskConical size={22} />
        </div>
        <div>
          <span className={storyLabel}>THE ASSUMPTION THAT FAILED</span>
          <p className={storyBody}>
            I gave every ThinkBoard visitor the same Redis rate-limit key. One busy person could spend everyone
            else&apos;s request budget.
          </p>
        </div>
        <div className="border-l pl-7 max-[900px]:col-start-2 max-[900px]:mt-[18px] max-[900px]:border-t max-[900px]:border-l-0 max-[900px]:pt-[18px] max-[900px]:pl-0 max-[620px]:col-auto">
          <span className={storyLabel}>WHAT CHANGED IN MY MODEL</span>
          <p className={storyBody}>
            A rate limiter is only fair if its identity matches the thing you&apos;re trying to protect. The algorithm
            was fine; my key was wrong.
          </p>
        </div>
      </div>

      <RateLimiterDemo compact />

      <p className="mt-[18px] max-w-[72ch] text-[.9375rem] leading-[1.6] text-muted-foreground">
        The interesting part isn&apos;t the mistake. It&apos;s being able to reproduce it, explain the system behind it,
        and name the better design.{' '}
        <Link
          className="inline-flex items-center gap-1 font-semibold text-primary no-underline hover:underline hover:underline-offset-[3px]"
          to="/work/thinkboard"
        >
          Read the ThinkBoard case study <ArrowUpRight size={15} />
        </Link>
      </p>
    </section>
  )
}

export default LabPage
