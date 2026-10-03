import { useState } from 'react'
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

  const selectSkill = (skill: string) => {
    setActiveSkill((current) => current === skill ? null : skill)
  }

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
