/**
 * Contact form endpoint (Vercel Function). Sends the message to CONTACT_TO_EMAIL through Resend.
 * Env vars: RESEND_API_KEY, CONTACT_TO_EMAIL, and optionally CONTACT_FROM_EMAIL
 * (a sender on a domain verified in Resend; defaults to Resend's onboarding address).
 * Optional: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN make the rate limit
 * shared across every function instance. Without them each warm instance counts alone.
 */
const topics = ['Job Opportunity', 'Project Collaboration', 'General Inquiry']

// 5 messages per IP per 10 minutes.
const hits = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_HITS = 5

/** Fixed-window counter in Upstash Redis, shared by all instances. Returns null if Redis is unavailable. */
async function limitedByRedis(ip: string): Promise<boolean | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  const window = Math.floor(Date.now() / WINDOW_MS)
  const key = `contact:${ip}:${window}`
  try {
    const response = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, String(WINDOW_MS / 1000)],
      ]),
    })
    if (!response.ok) return null
    const [count] = (await response.json()) as Array<{ result: number }>
    return count.result > MAX_HITS
  } catch {
    return null
  }
}

/** Per-instance fallback: weaker, because serverless instances do not share memory. */
function limitedInMemory(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS)
  hits.set(ip, [...recent, now])
  return recent.length >= MAX_HITS
}

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } })

const clean = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const limited = (await limitedByRedis(ip)) ?? limitedInMemory(ip)
  if (limited)
    return json({ error: 'Too many messages. Please try again later.' }, 429, {
      'Retry-After': String(WINDOW_MS / 1000),
    })

  let data: Record<string, unknown>
  try {
    data = await request.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success to bots.
  if (clean(data.website, 100)) return json({ ok: true })

  const name = clean(data.name, 100)
  const email = clean(data.email, 200)
  const topic = clean(data.topic, 50)
  const message = clean(data.message, 5000)
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !topics.includes(topic)) {
    return json({ error: 'Please fill in every field with a valid email.' }, 400)
  }

  const key = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  if (!key || !to) return json({ error: 'The contact form is not configured yet.' }, 503)

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>',
      to: [to],
      reply_to: email,
      subject: `[Portfolio] ${topic} from ${name}`,
      html: `<p><b>${escapeHtml(name)}</b> (${escapeHtml(email)}) &middot; ${escapeHtml(topic)}</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
    }),
  })
  if (!response.ok) return json({ error: 'Could not send the message. Please email me directly.' }, 502)
  return json({ ok: true })
}
