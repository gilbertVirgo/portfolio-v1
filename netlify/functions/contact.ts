import nodemailer from 'nodemailer'
import { confirmationHtml } from '../lib/confirmation-email'

type Valid = { ok: true; name: string; email: string; message: string; spam: boolean }
type Invalid = { ok: false; error: string }

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export function validate(body: unknown): Valid | Invalid {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid request.' }
  const b = body as Record<string, unknown>
  const name = str(b.name), email = str(b.email), message = str(b.message)
  // CR/LF in a header field is a header-injection attempt, so treat it as invalid input
  if (!name || /[\r\n]/.test(name)) return { ok: false, error: 'Please enter your name.' }
  if (name.length > 100) return { ok: false, error: 'Name is too long.' }
  if (!/^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]+$/.test(email) || email.length > 254) return { ok: false, error: 'Please enter a valid email address.' }
  if (!message) return { ok: false, error: 'Please enter a message.' }
  if (message.length > 5000) return { ok: false, error: 'Message is too long.' }
  return { ok: true, name, email, message, spam: str(b.company) !== '' }
}

const VERIFY_ERROR = 'Please complete the verification and try again.'

const json = (status: number, data: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', ...headers } })

export default async (req: Request) => {
  if (req.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed.' }, { Allow: 'POST' })
  const body: unknown = await req.json().catch(() => null)
  const v = validate(body)
  if (!v.ok) return json(400, v)
  if (v.spam) return json(200, { ok: true }) // honeypot filled: pretend success, send nothing

  // Cloudflare Turnstile. Enforced whenever TURNSTILE_SECRET_KEY is set; with no key the check is
  // skipped (local development). Any doubt — no token, rejected token, verifier unreachable — sends nothing.
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
  if (turnstileSecret) {
    const token = str((body as Record<string, unknown>)['cf-turnstile-response'])
    if (!token || token.length > 2048) return json(400, { ok: false, error: VERIFY_ERROR })
    try {
      const params = new URLSearchParams({ secret: turnstileSecret, response: token })
      const ip = req.headers.get('x-nf-client-connection-ip')
      if (ip) params.set('remoteip', ip)
      const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: params })
      const result = (await res.json()) as { success?: boolean }
      if (result.success !== true) return json(400, { ok: false, error: VERIFY_ERROR })
    } catch (err) {
      console.error('contact: turnstile verification unavailable', err)
      return json(503, { ok: false, error: 'Verification is unavailable right now. Please try again in a moment.' })
    }
  }

  const user = process.env.GMAIL_USER, pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) return json(500, { ok: false, error: 'Sending is not configured.' })
  const transport = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } })
  try {
    await transport.sendMail({
      from: `"Portfolio contact" <${user}>`,
      to: user,
      replyTo: { name: v.name, address: v.email },
      subject: `New project enquiry from ${v.name}`,
      text: `${v.message}\n\n— ${v.name} <${v.email}>`,
    })
  } catch (err) {
    console.error('contact: send failed', err)
    return json(500, { ok: false, error: 'Could not send your message. Please try again.' })
  }

  // The enquiry is delivered; a failed confirmation must not turn that into an error for the visitor.
  // The confirmation carries only the visitor's first name (escaped) — never their message — so the
  // form cannot be used to deliver someone else's text to an arbitrary address.
  const first = v.name.split(/\s+/)[0]
  try {
    await transport.sendMail({
      from: `"Gil Virgo" <${user}>`,
      to: v.email,
      subject: 'Thanks — your message reached me',
      html: confirmationHtml.replaceAll('{{name}}', escapeHtml(first)),
      text: `Thanks, ${first}.\n\nYour message has reached me. I read every enquiry myself and will reply by email within three working days.\n\nIf anything changes in the meantime, just reply to this email.\n\nGil Virgo\nhttps://gilbertvirgo.co.uk`,
    })
  } catch (err) {
    console.error('contact: confirmation failed', err)
  }
  return json(200, { ok: true })
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

// Netlify rate limiting: at most 5 submissions a minute per IP, so the form cannot be used to flood
// the inbox or to spray confirmation emails at other people's addresses.
// Netlify requires a `path` alongside `rateLimit`; the form posts to this path.
export const config = { path: '/api/contact', rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ['ip', 'domain'] } }
