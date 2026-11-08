import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useCopy } from '@/hooks/useCopy'
import { site } from '@/data/site'

/**
 * Copies the email address. The button says "Copied" for a couple of seconds, and a toast confirms it (or
 * explains that copying was blocked), the same message the command palette shows for its copy action.
 */
function CopyEmailButton() {
  const { copied, copy } = useCopy()

  const onClick = async () => {
    if (await copy(site.email)) toast.success('Email copied', { description: site.email })
    else toast.error('Could not copy', { description: `Email me at ${site.email}` })
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={() => void onClick()} className="print:hidden">
      {copied ? <Check /> : <Copy />}
      {copied ? 'Copied' : 'Copy email'}
    </Button>
  )
}

export default CopyEmailButton
