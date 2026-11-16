import AboutSection from '@/components/home/AboutSection'
import Hero from '@/components/home/Hero'
import LabSection from '@/components/home/LabSection'
import WorkSection from '@/components/home/WorkSection'
import WriteupsSection from '@/components/home/WriteupsSection'

/** The home page: hero, selected work, writeups, the lab and about. The contact band is part of the footer. */
function HomePage() {
  return (
    <>
      <Hero />
      <WorkSection />
      <WriteupsSection />
      <LabSection />
      <AboutSection />
    </>
  )
}

export default HomePage
