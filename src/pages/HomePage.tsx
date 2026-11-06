import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import AboutSection from '@/components/home/AboutSection'
import ContactSection from '@/components/home/ContactSection'
import Hero from '@/components/home/Hero'
import JourneySection from '@/components/home/JourneySection'
import LabSection from '@/components/home/LabSection'
import NotesSection from '@/components/home/NotesSection'
import ProjectsSection from '@/components/home/ProjectsSection'
import SkillsSection from '@/components/home/SkillsSection'
import StackTraceRail from '@/components/home/StackTraceRail'

const CodeShowcase = lazy(() => import('@/components/home/CodeShowcase'))

/**
 * The code showcase is not needed for the first paint or for search, so it is
 * left out of the prerendered HTML (a skeleton holds its space) and loaded after mount.
 */
function DeferredCodeShowcase() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const placeholder = <Skeleton className="section-wrap my-16 h-96" aria-hidden="true" />
  return mounted ? (
    <Suspense fallback={placeholder}>
      <CodeShowcase />
    </Suspense>
  ) : (
    placeholder
  )
}

// useLayoutEffect warns during prerendering; the scroll fix only matters in the browser.
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

function HomePage() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null)

  // Selecting a skill filters the project grid in the section ABOVE the skills section.
  // That changes the page height, so remember where the clicked chip sits on screen
  // and put it back in the same place once React has re-rendered.
  const scrollAnchor = useRef<{ el: HTMLElement; top: number } | null>(null)

  const selectSkill = (skill: string, trigger: HTMLElement) => {
    scrollAnchor.current = { el: trigger, top: trigger.getBoundingClientRect().top }
    setActiveSkill((current) => (current === skill ? null : skill))
  }

  useBrowserLayoutEffect(() => {
    const anchor = scrollAnchor.current
    if (!anchor) return
    scrollAnchor.current = null
    const shift = anchor.el.getBoundingClientRect().top - anchor.top
    if (shift !== 0) window.scrollBy({ top: shift, behavior: 'instant' })
  }, [activeSkill])

  return (
    <>
      <StackTraceRail />
      <Hero />
      <ProjectsSection activeSkill={activeSkill} onClearSkill={() => setActiveSkill(null)} />
      <DeferredCodeShowcase />
      <LabSection />
      <AboutSection />
      <JourneySection />
      <SkillsSection activeSkill={activeSkill} onSkillSelect={selectSkill} />
      <NotesSection />
      <ContactSection />
    </>
  )
}

export default HomePage
