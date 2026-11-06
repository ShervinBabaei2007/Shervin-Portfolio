import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { projects } from '../data/projects'

const languageLabel = { js: 'JavaScript', ts: 'TypeScript', tsx: 'React (TSX)', python: 'Python' } as const

/** One real excerpt per language, picked from the case studies' snippets. */
const entries = (() => {
  const seen = new Set<string>()
  return projects.flatMap((project) => {
    if (!project.snippet || seen.has(project.snippet.language)) return []
    seen.add(project.snippet.language)
    return [{ id: project.snippet.language, project, snippet: project.snippet }]
  })
})()

function CodeShowcase() {
  const [active, setActive] = useState<string>(entries[0]?.id ?? '')
  const [copied, setCopied] = useState(false)
  const entry = entries.find((item) => item.id === active)
  if (!entry) return null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(entry.snippet.code)
      setCopied(true)
      toast.success('Code copied')
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.error('Could not copy the code')
    }
  }

  return (
    <section className="section-wrap" id="code" aria-labelledby="code-title">
      <div className="section-heading">
        <div><p className="eyebrow"><span className="eyebrow-mark">03</span> CODE</p><h2 id="code-title">Real code, real repos<span>.</span></h2></div>
        <p className="section-aside">Each excerpt is copied from a project<br />you can open on GitHub.</p>
      </div>
      <Card>
        <CardHeader>
          <ToggleGroup type="single" variant="outline" value={active} onValueChange={(value) => value && setActive(value)} aria-label="Code language">
            {entries.map((item) => <ToggleGroupItem key={item.id} value={item.id}>{languageLabel[item.snippet.language]}</ToggleGroupItem>)}
          </ToggleGroup>
          <CardTitle className="mt-2 font-mono text-sm">{entry.snippet.file}</CardTitle>
          <CardDescription>{entry.snippet.caption} From {entry.project.name}.</CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <Button type="button" variant="outline" size="sm" className="absolute top-2 right-8" onClick={copy}>
            {copied ? <Check /> : <Copy />} {copied ? 'Copied' : 'Copy'}
          </Button>
          <pre className="max-h-96 overflow-auto rounded-md bg-background p-4 font-mono text-xs leading-relaxed" tabIndex={0} aria-label={`Code from ${entry.snippet.file}`}>
            <code>{entry.snippet.code}</code>
          </pre>
        </CardContent>
      </Card>
    </section>
  )
}

export default CodeShowcase
