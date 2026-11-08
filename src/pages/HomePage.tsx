import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AboutSection from '@/components/home/AboutSection'
import ContactSection from '@/components/home/ContactSection'
import AtAGlance from '@/components/home/AtAGlance'
import Hero from '@/components/home/Hero'
import ProjectsSection from '@/components/home/ProjectsSection'
import SkillsSection from '@/components/home/SkillsSection'

// useLayoutEffect warns during prerendering; the scroll fix only matters in the browser.
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

function HomePage() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  // The command palette sends a skill here in the navigation state. Apply it once, show the matching work, and
  // clear the state so a reload does not apply it again.
  useEffect(() => {
    const skill = (location.state as { skill?: string } | null)?.skill
    if (!skill) return
    setActiveSkill(skill)
    navigate(location.pathname + location.hash, { replace: true, state: null })
    requestAnimationFrame(() => document.getElementById('work')?.scrollIntoView())
  }, [location, navigate])

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
      <Hero />
      <AtAGlance />
      <ProjectsSection activeSkill={activeSkill} onClearSkill={() => setActiveSkill(null)} />
      <AboutSection />
      <SkillsSection activeSkill={activeSkill} onSkillSelect={selectSkill} />
      <ContactSection />
    </>
  )
}

export default HomePage
