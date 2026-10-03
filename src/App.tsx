import { useLayoutEffect, useRef, useState } from 'react'
import AboutSection from './components/AboutSection'
import CaseStudyDialog from './components/CaseStudyDialog'
import ContactSection from './components/ContactSection'
import Hero from './components/Hero'
import ProjectsSection from './components/ProjectsSection'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'
import SkillsSection from './components/SkillsSection'
import type { Project } from './data/projects'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [activeSkill, setActiveSkill] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Selecting a skill filters the project grid in the section ABOVE the skills section.
  // That changes the page height, so remember where the clicked chip sits on screen
  // and put it back in the same place once React has re-rendered.
  const scrollAnchor = useRef<{ el: HTMLElement; top: number } | null>(null)

  const selectSkill = (skill: string, trigger: HTMLElement) => {
    scrollAnchor.current = { el: trigger, top: trigger.getBoundingClientRect().top }
    setActiveSkill((current) => current === skill ? null : skill)
  }

  useLayoutEffect(() => {
    const anchor = scrollAnchor.current
    if (!anchor) return
    scrollAnchor.current = null
    const shift = anchor.el.getBoundingClientRect().top - anchor.top
    if (shift !== 0) window.scrollBy({ top: shift, behavior: 'instant' })
  }, [activeSkill])

  return (
    <div className={darkMode ? 'site-shell theme-dark' : 'site-shell'}>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader darkMode={darkMode} onToggleTheme={() => setDarkMode((current) => !current)} />
      <main id="main">
        <Hero onOpenProject={setSelectedProject} />
        <ProjectsSection
          activeSkill={activeSkill}
          onClearSkill={() => setActiveSkill(null)}
          onOpenProject={setSelectedProject}
        />
        <AboutSection />
        <SkillsSection activeSkill={activeSkill} onSkillSelect={selectSkill} />
        <ContactSection />
      </main>
      <SiteFooter />
      <CaseStudyDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  )
}

export default App
