import { Link } from 'react-router-dom'
import PageHero from '@/components/shared/PageHero'
import RateLimiterDemo from '@/components/shared/RateLimiterDemo'
import { outlinePill } from '@/lib/surfaces'

const storyLabel = 'm-0 font-mono text-[13px] text-primary'
const storyBody = 'mt-2 mb-0 max-w-[48ch] text-[17px] leading-[1.6] text-text-body'

/** The /lab page: the ThinkBoard rate-limit mistake and a demo you can break yourself. */
function LabPage() {
  return (
    <>
      <PageHero
        id="lab-title"
        command="cd ./lab"
        title="Break the assumption"
        lead="I learn fastest when a system disagrees with me. So here's one mistake you can reproduce yourself."
      />
      <section className="section-wrap pb-[clamp(88px,10vw,144px)] print:hidden" aria-label="The experiment">
        {/* The story in two columns, each under a rule, like the facts rows elsewhere on the site. */}
        <div className="grid gap-x-[clamp(24px,4vw,56px)] min-[760px]:grid-cols-2">
          <div className="border-t border-foreground/15 py-5">
            <p className={storyLabel}>The assumption that failed</p>
            <p className={storyBody}>
              I gave every ThinkBoard visitor the same Redis rate-limit key. One busy person could spend everyone
              else&apos;s request budget.
            </p>
          </div>
          <div className="border-t border-foreground/15 py-5">
            <p className={storyLabel}>What changed in my model</p>
            <p className={storyBody}>
              A rate limiter is only fair if its identity matches the thing you&apos;re trying to protect. The algorithm
              was fine; my key was wrong.
            </p>
          </div>
        </div>

        <RateLimiterDemo compact />

        <div className="mt-[clamp(32px,4vw,48px)] flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <p className="m-0 max-w-[64ch] text-base leading-[1.6] text-text-body">
            The interesting part isn&apos;t the mistake. It&apos;s being able to reproduce it, explain the system behind
            it, and name the better design.
          </p>
          <Link to="/work/thinkboard" className={outlinePill}>
            Read the ThinkBoard case study <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  )
}

export default LabPage
