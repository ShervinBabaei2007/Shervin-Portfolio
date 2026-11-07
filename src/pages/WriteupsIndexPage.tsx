import NoteCard from '@/components/shared/NoteCard'
import PageIntro from '@/components/shared/PageIntro'
import { notes } from '../data/notes'
import { findProject } from '../data/projects'

function WriteupsIndexPage() {
  return (
    <section className="section-wrap pt-16 pb-[110px]" aria-labelledby="writeups-index-title">
      <PageIntro
        wide
        eyebrow="WRITEUPS"
        id="writeups-index-title"
        title="Writeups on things I built and got wrong"
        lead="Each writeup starts from real code in one of my projects, explains what it actually does, and ends with what I would change."
      />
      <ul className="m-0 mt-2 grid list-none gap-3.5 p-0">
        {notes.map((note) => (
          <NoteCard key={note.slug} note={note} project={findProject(note.project)?.name} />
        ))}
      </ul>
    </section>
  )
}

export default WriteupsIndexPage
