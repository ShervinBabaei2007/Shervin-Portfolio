import { lazy, Suspense, useEffect, useRef, useState, type FormEvent } from 'react'
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
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { contactLimits, contactTopics, emailPattern } from '@/data/contact'
import { site } from '@/data/site'
import { cn } from '@/lib/utils'

const MESSAGE_MAX = contactLimits.message
// A field marked invalid turns its inherited text red; typed text stays the normal colour, because red on the dark field is only 4.3:1.
const FIELD_TEXT = 'text-foreground'
// Fields sit on the page colour inside the tinted form card.
const FIELD_BOX = 'rounded-md border-input bg-canvas shadow-none'

type Values = { name: string; email: string; topic: string; message: string }
type Errors = Partial<Record<keyof Values, string>>

// The first topic is chosen to start with, the most common reason to write.
const emptyValues: Values = { name: '', email: '', topic: contactTopics[0], message: '' }

// Returns an error message for each field that is missing or wrong; an empty object means the form is valid.
function validate({ name, email, topic, message }: Values): Errors {
  const errors: Errors = {}
  if (!name.trim()) errors.name = 'Enter your name.'
  if (!email.trim()) errors.email = 'Enter an email address I can reply to.'
  else if (!emailPattern.test(email.trim())) errors.email = "That email address doesn't look right."
  if (!contactTopics.includes(topic)) errors.topic = 'Choose what this is about.'
  if (!message.trim()) errors.message = 'Write a short message so I know how to help.'
  return errors
}

// Fields in the order they appear on screen, so focus goes to the topmost problem.
const fieldOrder: (keyof Values)[] = ['topic', 'name', 'email', 'message']
// The id to focus for the first invalid field (for the topic, its first radio button).
const focusId: Record<keyof Values, string> = {
  name: 'contact-name',
  email: 'contact-email',
  topic: 'contact-topic-0',
  message: 'contact-message',
}

// Loaded only after a message is sent, so the confetti library stays out of the page's first download.
const Confetti = lazy(() => import('@/components/ui/confetti').then((module) => ({ default: module.Confetti })))

// Turns a failed send into a message a visitor can understand.
function sendErrorMessage(caught: unknown): string {
  // A network failure surfaces as a TypeError ("Failed to fetch"), which means nothing to a visitor.
  if (caught instanceof TypeError) return "I couldn't reach the server. Check your connection and try again."
  if (caught instanceof Error) return caught.message
  return 'Something went wrong.'
}

/** The contact form: checks the fields, posts to /api/contact, then shows a thank-you message. */
function ContactForm() {
  const [values, setValues] = useState<Values>(emptyValues)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [serverError, setServerError] = useState<string | null>(null)
  const [celebrate, setCelebrate] = useState(false)
  const confirmation = useRef<HTMLDivElement>(null)

  // Confetti only for people who have not asked for less motion. Checked after sending, in the browser,
  // so it is safe while the page is prerendered and follows the setting as it is at that moment.
  useEffect(() => {
    if (status !== 'sent') return
    setCelebrate(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    confirmation.current?.focus()
  }, [status])

  // Stores a field's new value as the visitor types.
  const update = (field: keyof Values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    // Once a field has been flagged, re-check it as it is edited so the message goes away when it is fixed.
    if (errors[field]) setErrors((current) => ({ ...current, [field]: validate({ ...values, [field]: value })[field] }))
  }

  // Checks a field when the visitor leaves it, but only if something was typed, so tabbing past a field stays quiet.
  const check = (field: keyof Values) => {
    if (!values[field]) return
    setErrors((current) => ({ ...current, [field]: validate(values)[field] }))
  }

  // Validates, focuses the first bad field if any, otherwise sends the message.
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
      setServerError(sendErrorMessage(caught))
      setStatus('idle')
    }
  }

  if (status === 'sent') {
    return (
      <Empty ref={confirmation} className="border" role="status" tabIndex={-1}>
        {celebrate && (
          <Suspense fallback={null}>
            <Confetti
              className="pointer-events-none fixed inset-0 z-50 size-full"
              aria-hidden="true"
              options={{ particleCount: 90, spread: 70, startVelocity: 38, origin: { y: 0.7 } }}
            />
          </Suspense>
        )}
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
              // Wait a tick so the form is back on screen before focusing its first field.
              window.setTimeout(() => document.getElementById(focusId.name)?.focus(), 0)
            }}
          >
            Send another message
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  // Links a field to its error message for screen readers, only while it has one.
  const describedBy = (field: keyof Values) => (errors[field] ? `contact-${field}-error` : undefined)

  return (
    <form className="flex flex-1 flex-col text-left" noValidate onSubmit={onSubmit}>
      <FieldGroup className="flex-1 gap-6">
        {/* The topic is a row of pills; underneath they are radio buttons, so arrow keys and screen readers work. */}
        <FieldSet data-invalid={Boolean(errors.topic)} className="gap-3">
          <FieldLegend variant="label">What is this about?</FieldLegend>
          <RadioGroupPrimitive.Root
            className="flex flex-wrap gap-2"
            value={values.topic}
            onValueChange={(value) => update('topic', value)}
            aria-invalid={Boolean(errors.topic)}
            aria-describedby={describedBy('topic')}
            aria-required="true"
            aria-label="What is this about?"
          >
            {contactTopics.map((topic, index) => (
              <RadioGroupPrimitive.Item
                key={topic}
                value={topic}
                id={`contact-topic-${index}`}
                className="inline-flex h-10 cursor-pointer items-center rounded-full border border-foreground/25 bg-transparent px-4 text-[15px] text-foreground transition-colors hover:border-foreground data-[state=checked]:border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background pointer-coarse:h-11"
              >
                {topic}
              </RadioGroupPrimitive.Item>
            ))}
          </RadioGroupPrimitive.Root>
          {errors.topic && <FieldError id="contact-topic-error">{errors.topic}</FieldError>}
        </FieldSet>

        <div className="grid items-start gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="contact-name">Name</FieldLabel>
            <Input
              id="contact-name"
              name="name"
              value={values.name}
              onChange={(event) => update('name', event.target.value)}
              onBlur={() => check('name')}
              maxLength={contactLimits.name}
              autoComplete="name"
              className={cn(FIELD_TEXT, FIELD_BOX, 'h-12')}
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
              value={values.email}
              onChange={(event) => update('email', event.target.value)}
              onBlur={() => check('email')}
              maxLength={contactLimits.email}
              autoComplete="email"
              className={cn(FIELD_TEXT, FIELD_BOX, 'h-12')}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describedBy('email')}
              aria-required="true"
            />
            {errors.email && <FieldError id="contact-email-error">{errors.email}</FieldError>}
          </Field>
        </div>

        <Field className="flex-1" data-invalid={Boolean(errors.message)}>
          <div className="flex items-baseline justify-between gap-3">
            <FieldLabel htmlFor="contact-message">Message</FieldLabel>
            <FieldDescription className="shrink-0 font-mono text-[13px]" aria-live="off">
              {values.message.length} / {MESSAGE_MAX}
            </FieldDescription>
          </div>
          <Textarea
            id="contact-message"
            name="message"
            value={values.message}
            onChange={(event) => update('message', event.target.value)}
            onBlur={() => check('message')}
            className={cn(FIELD_TEXT, FIELD_BOX, 'field-sizing-fixed min-h-[168px] flex-1')}
            maxLength={MESSAGE_MAX}
            rows={6}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy('message')}
            aria-required="true"
          />
          {errors.message && <FieldError id="contact-message-error">{errors.message}</FieldError>}
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

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Button
            type="submit"
            disabled={status === 'sending'}
            aria-busy={status === 'sending'}
            className="h-12 rounded-full bg-foreground px-6 text-base text-background hover:bg-primary-fill hover:text-primary-foreground"
          >
            {status === 'sending' ? (
              <>
                <Spinner aria-hidden="true" role="presentation" /> Sending…
              </>
            ) : (
              'Send message'
            )}
          </Button>
          <p className="m-0 text-[15px] text-muted-foreground">I reply within two business days.</p>
        </div>
      </FieldGroup>
    </form>
  )
}

export default ContactForm
