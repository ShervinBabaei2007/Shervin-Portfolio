import { useState, type FormEvent } from 'react'
import { CircleAlert } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { site } from '@/data/site'

const topics = ['Job Opportunity', 'Project Collaboration', 'General Inquiry']

function ContactForm() {
  const [topic, setTopic] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!topic) {
      toast.error('Pick a topic first')
      return
    }
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setSending(true)
    setError(null)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, topic }),
      })
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error ?? 'Something went wrong.')
      }
      toast.success('Message sent!', { description: "Thanks for reaching out. I'll respond within two business days." })
      form.reset()
      setTopic('')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Something went wrong.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form className="grid gap-3 text-left" onSubmit={onSubmit}>
      <Input name="name" placeholder="Your name" aria-label="Your name" required maxLength={100} autoComplete="name" />
      <Input
        name="email"
        type="email"
        placeholder="you@company.com"
        aria-label="Your email"
        required
        maxLength={200}
        autoComplete="email"
      />
      <Select value={topic} onValueChange={setTopic}>
        <SelectTrigger className="w-full" aria-label="Topic">
          <SelectValue placeholder="What is this about?" />
        </SelectTrigger>
        <SelectContent>
          {topics.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Textarea
        name="message"
        placeholder="Tell me what you're building"
        aria-label="Message"
        required
        maxLength={5000}
        rows={5}
      />
      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {error && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Message not sent</AlertTitle>
          <AlertDescription>
            {error} You can also email{' '}
            <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </AlertDescription>
        </Alert>
      )}
      <Button type="submit" disabled={sending}>
        {sending ? 'Sending...' : 'Send message'}
      </Button>
    </form>
  )
}

export default ContactForm
