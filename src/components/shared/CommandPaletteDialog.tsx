import { useState } from 'react'
import { Copy, Download, FileText, FolderGit2, FlaskConical, Home, Mail, NotebookPen, Wrench } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { notes } from '@/data/notes'
import { projects } from '@/data/projects'
import { site } from '@/data/site'
import { projectsUsing, skillTabs } from '@/data/skills'

type Props = { open: boolean; onOpenChange: (open: boolean) => void }

/** The palette's dialog and its items. Loaded the first time the palette opens. */
function CommandPaletteDialog({ open, onOpenChange }: Props) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const allSkills = skillTabs.flatMap((tab) => tab.skills.map((skill) => skill.name))

  const close = (next: boolean) => {
    if (!next) setQuery('')
    onOpenChange(next)
  }
  const run = (action: () => void) => {
    close(false)
    action()
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      toast.success('Email copied', { description: site.email })
    } catch {
      toast.error('Could not copy', { description: `Email me at ${site.email}` })
    }
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={close}
      title="Search portfolio"
      description="Jump to a project, writeup, page, skill, or contact action."
    >
      <CommandInput placeholder="Search projects, writeups, skills, pages…" value={query} onValueChange={setQuery} />
      <CommandList>
        <CommandEmpty>
          <p className="font-medium text-foreground">Nothing matches that.</p>
          <p className="mt-1 text-muted-foreground">
            Try a project name, a skill like &quot;React&quot;, or &quot;resume&quot;.
          </p>
        </CommandEmpty>
        <CommandGroup heading="Projects">
          {projects.map((project) => (
            <CommandItem
              key={project.slug}
              value={`${project.name} ${project.category} ${project.subtitle}`}
              onSelect={() => run(() => navigate(`/work/${project.slug}`))}
            >
              <FileText /> {project.name}
              <span className="ml-auto text-label text-muted-foreground">{project.category}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Writeups">
          {notes.map((note) => (
            <CommandItem
              key={note.slug}
              value={`${note.title} ${note.summary} writeup`}
              onSelect={() => run(() => navigate(`/writeups/${note.slug}`))}
            >
              <NotebookPen /> {note.title}
            </CommandItem>
          ))}
        </CommandGroup>
        {/* Skills only appear once you type, because there are about thirty of them and they would crowd the list. */}
        {query.trim() && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Skills">
              {allSkills.map((skill) => {
                const count = projectsUsing(skill).length
                return (
                  <CommandItem
                    key={skill}
                    value={`${skill} skill`}
                    onSelect={() => run(() => navigate('/', { state: { skill } }))}
                  >
                    <Wrench /> {skill}
                    <span className="ml-auto text-label text-muted-foreground">
                      {count} {count === 1 ? 'project' : 'projects'}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </>
        )}
        <CommandSeparator />
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => run(() => navigate('/'))}>
            <Home /> Home
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate('/projects'))}>
            <FolderGit2 /> Projects
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate('/writeups'))}>
            <NotebookPen /> Writeups
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate('/lab'))}>
            <FlaskConical /> Lab: rate-limiter demo
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate('/resume'))}>
            <FileText /> Resume
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(() => window.open('/Shervin_Babaei_Resume.pdf', '_blank'))}>
            <Download /> Download resume (PDF)
          </CommandItem>
          <CommandItem onSelect={() => run(() => void copyEmail())}>
            <Copy /> Copy email address
          </CommandItem>
          <CommandItem
            onSelect={() =>
              run(() => {
                window.location.href = `mailto:${site.email}`
              })
            }
          >
            <Mail /> Send an email
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export default CommandPaletteDialog
