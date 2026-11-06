import GitHubActivity from '@/components/home/GitHubActivity'
import NoteCard from '@/components/shared/NoteCard'
import SectionHeading from '@/components/shared/SectionHeading'
import { notes } from '@/data/notes'

function NotesSection() {
  return (
    <section className="section-wrap pt-10 pb-[110px] max-[620px]:pb-14" id="notes" aria-labelledby="notes-title">
      <SectionHeading
        id="notes-title"
        number="08"
        eyebrow="ENGINEERING NOTES"
        title="What the bugs taught me"
        aside={
          <>
            Real failure modes, trade-offs, and fixes I can <br />
            trace back to code—not polished hindsight.
          </>
        }
      />
      {/* With no recent GitHub activity to show, the notes take a single column. */}
      <div className="mt-[30px] grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start gap-9 max-[900px]:grid-cols-1 [&:not(:has([data-github]))]:max-w-[860px] [&:not(:has([data-github]))]:grid-cols-[minmax(0,1fr)]">
        <ul className="m-0 grid list-none gap-3.5 p-0">
          {notes.map((note) => (
            <NoteCard key={note.slug} note={note} />
          ))}
        </ul>
        <GitHubActivity />
      </div>
    </section>
  )
}

export default NotesSection
