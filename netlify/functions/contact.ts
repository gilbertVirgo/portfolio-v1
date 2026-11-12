import nodemailer from 'nodemailer'

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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return { ok: false, error: 'Please enter a valid email address.' }
  if (!message) return { ok: false, error: 'Please enter a message.' }
  if (message.length > 5000) return { ok: false, error: 'Message is too long.' }
  return { ok: true, name, email, message, spam: str(b.company) !== '' }
}

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } })

export default async (req: Request) => {
  if (req.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed.' })
  const v = validate(await req.json().catch(() => null))
  if (!v.ok) return json(400, v)
  if (v.spam) return json(200, { ok: true }) // honeypot filled: pretend success, send nothing

  const user = process.env.GMAIL_USER, pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) return json(500, { ok: false, error: 'Sending is not configured.' })
  try {
    await nodemailer
      .createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } })
      .sendMail({
        from: `"Portfolio contact" <${user}>`,
        to: user,
        replyTo: { name: v.name, address: v.email },
        subject: `New project enquiry from ${v.name}`,
        text: `${v.message}\n\n— ${v.name} <${v.email}>`,
      })
    return json(200, { ok: true })
  } catch (err) {
    console.error('contact: send failed', err)
    return json(500, { ok: false, error: 'Could not send your message. Please try again.' })
  }
}
