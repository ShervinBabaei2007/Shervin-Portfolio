import type { Project } from '@/data/projects'

/** Every section a case study can have; each is also the section's HTML id. */
export type SectionId =
  'what' | 'does' | 'works' | 'media' | 'why' | 'built' | 'code' | 'run' | 'outcome' | 'tradeoff' | 'learned' | 'next'

export type CaseStudySection = {
  id: SectionId
  /** The table-of-contents entry. */
  label: string
  /** `intro` sections sit full width above the article; `article` sections share the column beside the table of contents. */
  placement: 'intro' | 'article'
}

/**
 * The sections a case study has, in reading order. A project only gets the sections it has content for, so this
 * is the one place that decides which exist: the table of contents and the page body both read this list, and the
 * page keeps one renderer per `SectionId`, so an id can neither be listed without a section nor rendered without a
 * table-of-contents entry.
 */
export function caseStudySections(project: Project): CaseStudySection[] {
  const hasMedia = Boolean(project.video || project.screenshots || project.illustration)
  const sections: (CaseStudySection & { show: boolean })[] = [
    { id: 'what', label: 'What it is', placement: 'intro', show: Boolean(project.overview) },
    { id: 'does', label: 'What it can do', placement: 'intro', show: Boolean(project.features) },
    { id: 'works', label: 'How it works', placement: 'article', show: Boolean(project.howItWorks) },
    {
      id: 'media',
      label: project.video || project.screenshots ? 'Screenshots' : 'Illustration',
      placement: 'article',
      show: hasMedia,
    },
    { id: 'why', label: 'Why', placement: 'article', show: true },
    { id: 'built', label: 'What I built', placement: 'article', show: true },
    { id: 'code', label: 'The code', placement: 'article', show: Boolean(project.snippet) },
    { id: 'run', label: 'See it run', placement: 'article', show: Boolean(project.terminal) },
    { id: 'outcome', label: 'Outcome', placement: 'article', show: true },
    { id: 'tradeoff', label: 'The trade-off', placement: 'article', show: true },
    { id: 'learned', label: 'What I learned', placement: 'article', show: true },
    { id: 'next', label: 'Fix next', placement: 'article', show: true },
  ]
  return sections.filter((section) => section.show).map(({ id, label, placement }) => ({ id, label, placement }))
}
