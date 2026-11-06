import { Copy, Download, FileText, FlaskConical, Home, Mail, NotebookPen } from 'lucide-react'
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
import { projects } from '@/data/projects'
import { site } from '@/data/site'

type Props = { open: boolean; onOpenChange: (open: boolean) => void }

/** The palette's dialog and its items. Loaded the first time the palette opens. */
function CommandPaletteDialog({ open, onOpenChange }: Props) {
  const navigate = useNavigate()

  const run = (action: () => void) => {
    onOpenChange(false)
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
      onOpenChange={onOpenChange}
      title="Search portfolio"
      description="Jump to a project, page, or contact action."
    >
      <CommandInput placeholder="Search projects, pages, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Projects">
          {projects.map((project) => (
            <CommandItem
              key={project.slug}
              value={`${project.name} ${project.category} ${project.subtitle}`}
              onSelect={() => run(() => navigate(`/work/${project.slug}`))}
            >
              <FileText /> {project.name}
              <span className="ml-auto text-xs text-muted-foreground">{project.category}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => run(() => navigate('/'))}>
            <Home /> Home
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate('/notes'))}>
            <NotebookPen /> Notes
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
