import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '@/components/shared/Reveal'
import SectionHeading from '@/components/shared/SectionHeading'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { facts } from '@/data/facts'
import { site } from '@/data/site'

type Faq = { id: string; question: string; answer: ReactNode }

// Links inside an answer must read as links without hovering: coloured, bold and underlined.
const linkClass =
  'font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary'

const link = (to: string, label: string) => (
  <Link className={linkClass} to={to}>
    {label}
  </Link>
)

const { skillmatch, hackathon } = facts
const { availability } = site
const start = availability.from
  ? `I am available from ${availability.from}${availability.term ? ` for ${availability.term}` : ''}. `
  : ''

// What an employer asks first: can you start, where do you fit, can you deliver, is the code tested, how do you
// debug, do you use AI, what do you want, can I check it. Each answer is plain language: the claim, then the proof,
// then a link. Figures come from src/data (facts, site, projects, notes), so they cannot drift from the rest of the
// site. Do not claim more than the case studies and writeups do: the race-condition fix there is a proposed fix.
const faqs: Faq[] = [
  {
    id: 'available',
    question: 'Are you available, and where?',
    answer: `${start}I am open to ${availability.roles} in ${availability.area}. I graduate from BCIT in ${site.graduation} with an ${facts.gpa} academic average.`,
  },
  {
    id: 'role',
    question: 'What role would you fill on a team?',
    answer: (
      <>
        I am a full-stack developer, so I can take either side of a feature. On {link('/work/skillmatch', 'SkillMatch')}
        , a team of {skillmatch.teamSize}, I led backend and DevOps: {skillmatch.myMergedPrs} of the team’s{' '}
        {skillmatch.teamMergedPrs} merged pull requests and {skillmatch.myCommits} of its {skillmatch.teamCommits}{' '}
        commits were mine. On {link('/work/gitscribe', 'GitScribe')} I led the front end. I am most useful where the two
        meet: connecting a screen to the API and database behind it.
      </>
    ),
  },
  {
    id: 'deliver',
    question: 'Can you deliver under a deadline?',
    answer: (
      <>
        Yes. {link('/work/skillmatch', 'SkillMatch')} was built by a team of {skillmatch.teamSize} in four weeks and
        shipped as a live app. {link('/work/gitscribe', 'GitScribe')} was built in 24 hours at {hackathon.name}, where I
        led the front end and we placed in the {hackathon.placement.toLowerCase()} teams.
      </>
    ),
  },
  {
    id: 'quality',
    question: 'How do you make sure your code works?',
    answer: (
      <>
        I write automated tests, so a change that breaks something gets caught straight away.{' '}
        {link('/work/network-growth-assistant', 'Network Growth Assistant')}, my biggest solo project, has 1,523 unit
        tests and 305 database tests, plus a browser test suite that also scans for accessibility problems. All of it
        runs in CI on GitHub Actions. My Python projects use pytest.
      </>
    ),
  },
  {
    id: 'debug',
    question: 'Tell me about a bug you tracked down.',
    answer: (
      <>
        <p>
          In SkillMatch, the Attend button switched off once a workshop was full, which stops one person from
          overbooking it. But two people could click at the same moment, both pass the seat check, and both get the last
          seat. That is called a race condition. I traced it to the server never checking the seat count itself, and
          wrote up the fix: one database update that checks the seat count and adds the person in the same step.
        </p>
        <p className="mt-3">
          In my Discord bot, one web request inside asynchronous code froze the whole bot while the local AI model was
          thinking. Moving it onto a worker thread fixed it.
        </p>
        <p className="mt-3">
          Read the full writeups: {link('/writeups/skillmatch-attend-race-condition', 'the SkillMatch race condition')}{' '}
          and {link('/writeups/one-blocking-call-froze-my-bot', 'the frozen Discord bot')}.
        </p>
      </>
    ),
  },
  {
    id: 'ai',
    question: 'Have you worked with AI?',
    answer: (
      <>
        <p>
          Yes, it is part of how I work. BCIT has taught us to use Claude Code, and I use AI in my day-to-day coding.
        </p>
        <p className="mt-3">
          I also build with it. {link('/work/gitscribe', 'GitScribe')}, where I led the front end, suggests a commit
          message from your code changes. In {link('/work/network-growth-assistant', 'Network Growth Assistant')}, every
          message the app drafts has to pass a check so it cannot claim anything it cannot back up, such as saying we
          have met when we have not. Most of those messages come from fixed templates, not an AI at all.{' '}
          {link('/writeups/stopping-an-ai-from-inventing-facts', 'Read how that check works')}.
        </p>
        <p className="mt-3">
          I also run local models like Qwen through LM Studio and Ollama, and built a Discord bot around one.
        </p>
      </>
    ),
  },
  {
    id: 'next',
    question: 'What are you looking for in a first role?',
    answer:
      'A co-op or internship on a team where code review is part of the culture. I want to learn how good teams build, test, and ship software. I am open to whatever role the team needs most, and I will take on hard problems to get there.',
  },
  {
    id: 'verify',
    question: 'How can I check what is on your site?',
    answer: (
      <>
        Every number about my projects is counted from a repository or its commit history, not estimated. Each{' '}
        {link('/projects', 'project')} has a case study with its source code, and the SkillMatch team repository shows
        exactly who wrote what. All my code is on{' '}
        <a className={linkClass} href={site.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        .
      </>
    ),
  },
]

const accordionClass = 'rounded-xl border bg-card px-6 shadow-sm max-[620px]:px-4'
// Two columns on wide screens keep the section compact, with no empty column beside a long list.
const columns = [faqs.slice(0, 4), faqs.slice(4)]

/** The eight questions an employer asks first, answered up front. */
function FaqSection() {
  return (
    <section className="section-wrap section-y" id="faq" aria-labelledby="faq-title">
      <SectionHeading
        id="faq-title"
        number="05"
        eyebrow="FOR EMPLOYERS"
        title="Quick answers"
        aside="What a hiring manager usually wants to know first, answered up front."
      />
      <Reveal>
        <div className="grid items-start gap-4 lg:grid-cols-2 lg:gap-8">
          {columns.map((items) => (
            <Accordion key={items[0].id} type="single" collapsible className={accordionClass}>
              {items.map(({ id, question, answer }) => (
                <AccordionItem key={id} value={id}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>{answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

export default FaqSection
