import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import AboutSection from '../components/AboutSection'
import CapabilitiesTable from '../components/CapabilitiesTable'
import CodeShowcase from '../components/CodeShowcase'
import ContactSection from '../components/ContactSection'
import Hero from '../components/Hero'
import JourneySection from '../components/JourneySection'
import LabSection from '../components/LabSection'
import NotesSection from '../components/NotesSection'
import ProjectsSection from '../components/ProjectsSection'
import SkillsSection from '../components/SkillsSection'
import StackTraceRail from '../components/StackTraceRail'

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
      <CodeShowcase />
      <LabSection />
      <AboutSection />
      <JourneySection />
      <SkillsSection activeSkill={activeSkill} onSkillSelect={selectSkill} />
      <CapabilitiesTable />
      <NotesSection />
      <ContactSection />
    </>
  )
}

export default HomePage
