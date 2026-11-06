import { useEffect, useState } from 'react'
import { Copy, Download, FileText, Home, Mail, NotebookPen, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Kbd } from '@/components/ui/kbd'
import { projects } from '../data/projects'
import { site } from '../data/site'

/** Opens from anywhere with Ctrl/⌘ + K, or from the trigger button in the hero. */
function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const run = (action: () => void) => {
    setOpen(false)
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
    <>
      <Button
        type="button"
        variant="outline"
        className="justify-between gap-6 text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <span className="inline-flex items-center gap-2">
          <Search /> Search portfolio...
        </span>
        <span className="inline-flex items-center gap-1" aria-hidden="true">
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </span>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
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
    </>
  )
}

export default CommandPalette
