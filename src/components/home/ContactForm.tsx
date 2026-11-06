import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CircleAlert, CircleCheck } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { site } from '@/data/site'

/** Keep these in step with api/contact.ts, which re-checks everything on the server. */
const topics = ['Job Opportunity', 'Project Collaboration', 'General Inquiry']
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MESSAGE_MAX = 5000

type Values = { name: string; email: string; topic: string; message: string }
type Errors = Partial<Record<keyof Values, string>>

const emptyValues: Values = { name: '', email: '', topic: '', message: '' }

function validate({ name, email, topic, message }: Values): Errors {
  const errors: Errors = {}
  if (!name.trim()) errors.name = 'Enter your name.'
  if (!email.trim()) errors.email = 'Enter an email address I can reply to.'
  else if (!emailPattern.test(email.trim())) errors.email = "That email address doesn't look right."
  if (!topics.includes(topic)) errors.topic = 'Choose what this is about.'
  if (!message.trim()) errors.message = 'Write a short message so I know how to help.'
  return errors
}

const fieldOrder: (keyof Values)[] = ['name', 'email', 'topic', 'message']
// The id to focus for the first invalid field (for the topic, its first radio button).
const focusId: Record<keyof Values, string> = {
  name: 'contact-name',
  email: 'contact-email',
  topic: 'contact-topic-0',
  message: 'contact-message',
}

function ContactForm() {
  const [values, setValues] = useState<Values>(emptyValues)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [serverError, setServerError] = useState<string | null>(null)
  const confirmation = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'sent') confirmation.current?.focus()
  }, [status])

  const update = (field: keyof Values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    // Once a field has been flagged, re-check it as it is edited so the message goes away when it is fixed.
    if (errors[field]) setErrors((current) => ({ ...current, [field]: validate({ ...values, [field]: value })[field] }))
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    const first = fieldOrder.find((field) => found[field])
    if (first) {
      document.getElementById(focusId[first])?.focus()
      return
    }
    // Hidden honeypot for bots; real visitors never fill it.
    const website = new FormData(event.currentTarget).get('website')
    setStatus('sending')
    setServerError(null)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, website }),
      })
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error ?? 'Something went wrong.')
      }
      setValues(emptyValues)
      setStatus('sent')
    } catch (caught) {
      setServerError(caught instanceof Error ? caught.message : 'Something went wrong.')
      setStatus('idle')
    }
  }

  if (status === 'sent') {
    return (
      <Empty ref={confirmation} className="border" role="status" tabIndex={-1}>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleCheck />
          </EmptyMedia>
          <EmptyTitle>Message sent</EmptyTitle>
          <EmptyDescription>Thanks for reaching out. I&apos;ll reply within two business days.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setStatus('idle')
              setErrors({})
              window.setTimeout(() => document.getElementById(focusId.name)?.focus(), 0)
            }}
          >
            Send another message
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  const describedBy = (field: keyof Values) => (errors[field] ? `contact-${field}-error` : undefined)

  return (
    <form className="flex flex-1 flex-col text-left" noValidate onSubmit={onSubmit}>
      <FieldGroup className="flex-1 gap-5">
        <div className="grid items-start gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="contact-name">Name</FieldLabel>
            <Input
              id="contact-name"
              name="name"
              value={values.name}
              onChange={(event) => update('name', event.target.value)}
              maxLength={100}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy('name')}
              aria-required="true"
            />
            {errors.name && <FieldError id="contact-name-error">{errors.name}</FieldError>}
          </Field>

          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="contact-email">Email</FieldLabel>
            <Input
              id="contact-email"
              name="email"
              type="email"
              placeholder="you@company.com"
              value={values.email}
              onChange={(event) => update('email', event.target.value)}
              maxLength={200}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describedBy('email')}
              aria-required="true"
            />
            {errors.email && <FieldError id="contact-email-error">{errors.email}</FieldError>}
          </Field>
        </div>

        <FieldSet data-invalid={Boolean(errors.topic)}>
          <FieldLegend variant="label">What is this about?</FieldLegend>
          <RadioGroup
            className="flex flex-wrap gap-x-6 gap-y-2"
            value={values.topic}
            onValueChange={(value) => update('topic', value)}
            aria-invalid={Boolean(errors.topic)}
            aria-describedby={describedBy('topic')}
            aria-required="true"
          >
            {topics.map((topic, index) => (
              <Field className="w-auto" key={topic} orientation="horizontal">
                <RadioGroupItem value={topic} id={`contact-topic-${index}`} aria-invalid={Boolean(errors.topic)} />
                <FieldLabel className="font-normal" htmlFor={`contact-topic-${index}`}>
                  {topic}
                </FieldLabel>
              </Field>
            ))}
          </RadioGroup>
          {errors.topic && <FieldError id="contact-topic-error">{errors.topic}</FieldError>}
        </FieldSet>

        <Field className="flex-1" data-invalid={Boolean(errors.message)}>
          <FieldLabel htmlFor="contact-message">Message</FieldLabel>
          <Textarea
            id="contact-message"
            name="message"
            value={values.message}
            onChange={(event) => update('message', event.target.value)}
            className="field-sizing-fixed min-h-24 flex-1"
            placeholder="Tell me what you're building"
            maxLength={MESSAGE_MAX}
            rows={4}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy('message')}
            aria-required="true"
          />
          <div className="flex items-start justify-between gap-3">
            {errors.message ? <FieldError id="contact-message-error">{errors.message}</FieldError> : <span />}
            <FieldDescription className="shrink-0 font-mono text-label" aria-live="off">
              {values.message.length} / {MESSAGE_MAX}
            </FieldDescription>
          </div>
        </Field>

        {/* Honeypot for bots; hidden from people and assistive tech. */}
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        {serverError && (
          <Alert variant="destructive">
            <CircleAlert />
            <AlertTitle>Message not sent</AlertTitle>
            <AlertDescription>
              {serverError} You can also email{' '}
              <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              .
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>
          {status === 'sending' ? (
            <>
              <Spinner aria-hidden="true" role="presentation" /> Sending...
            </>
          ) : (
            'Send message'
          )}
        </Button>
      </FieldGroup>
    </form>
  )
}

export default ContactForm
