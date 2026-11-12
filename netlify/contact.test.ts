import { afterEach, expect, test, vi } from 'vitest'
import { validate } from './functions/contact'
import handler from './functions/contact'

const { sendMail, createTransport } = vi.hoisted(() => {
  const sendMail = vi.fn().mockResolvedValue({})
  return { sendMail, createTransport: vi.fn(() => ({ sendMail })) }
})
vi.mock('nodemailer', () => ({ default: { createTransport } }))

const good = { name: 'Sam Taylor', email: 'sam@example.org', message: 'We need a website.', company: '' }

test('accepts a complete message', () => {
  expect(validate(good)).toEqual({ ok: true, name: 'Sam Taylor', email: 'sam@example.org', message: 'We need a website.', spam: false })
})

test('flags the honeypot', () => {
  expect(validate({ ...good, company: 'Acme' })).toMatchObject({ ok: true, spam: true })
})

test.each([
  [{ ...good, name: '  ' }, 'Please enter your name.'],
  [{ ...good, email: 'nope' }, 'Please enter a valid email address.'],
  [{ ...good, email: 'a,b@example.org' }, 'Please enter a valid email address.'],
  [{ ...good, message: '' }, 'Please enter a message.'],
  [{ ...good, name: 'a'.repeat(101) }, 'Name is too long.'],
  [{ ...good, message: 'a'.repeat(5001) }, 'Message is too long.'],
  [{ ...good, name: 'Sam\r\nBcc: x@y.z' }, 'Please enter your name.'],
  [{ ...good, email: 'sam@example.org\nBcc: x@y.z' }, 'Please enter a valid email address.'],
  [null, 'Invalid request.'],
  ['text', 'Invalid request.'],
])('rejects %j', (body, error) => {
  expect(validate(body)).toEqual({ ok: false, error })
})

const call = (method: string, body?: unknown) =>
  handler(new Request('http://localhost/.netlify/functions/contact', {
    method,
    headers: { 'content-type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  }))

afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks() })

test('honeypot gets a fake success and no mail', async () => {
  const res = await call('POST', { ...good, company: 'Acme' })
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ ok: true })
  expect(createTransport).not.toHaveBeenCalled()
})

test('GET is 405 with Allow: POST', async () => {
  const res = await call('GET')
  expect(res.status).toBe(405)
  expect(res.headers.get('Allow')).toBe('POST')
})

test('invalid body is 400 and sends nothing', async () => {
  const res = await call('POST', { ...good, name: '' })
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ ok: false, error: 'Please enter your name.' })
  expect(createTransport).not.toHaveBeenCalled()
})

test('valid POST sends the enquiry to the owner, then a confirmation to the visitor', async () => {
  vi.stubEnv('GMAIL_USER', 'me@example.com')
  vi.stubEnv('GMAIL_APP_PASSWORD', 'secret')
  const res = await call('POST', good)
  expect(res.status).toBe(200)
  expect(sendMail).toHaveBeenCalledTimes(2)
  expect(sendMail.mock.calls[0][0]).toMatchObject({ to: 'me@example.com', replyTo: { name: 'Sam Taylor', address: 'sam@example.org' } })
  const confirmation = sendMail.mock.calls[1][0]
  expect(confirmation).toMatchObject({ to: 'sam@example.org', subject: 'Thanks — your message reached me' })
  expect(confirmation.html).toContain('Thanks, Sam.')
  expect(confirmation.html).not.toContain('{{name}}')
  expect(confirmation.html).not.toContain('We need a website.') // never echo the visitor's message
  expect(confirmation.text).toContain('within three working days')
})

test('confirmation escapes HTML in the name', async () => {
  vi.stubEnv('GMAIL_USER', 'me@example.com')
  vi.stubEnv('GMAIL_APP_PASSWORD', 'secret')
  await call('POST', { ...good, name: '<img/src=x> Taylor' })
  const { html, text } = sendMail.mock.calls[1][0]
  expect(html).toContain('Thanks, &lt;img/src=x&gt;.')
  expect(html).not.toContain('<img/src=x>')
  expect(text).toContain('Thanks, <img/src=x>.')
})

test('a failed confirmation does not fail the enquiry', async () => {
  vi.stubEnv('GMAIL_USER', 'me@example.com')
  vi.stubEnv('GMAIL_APP_PASSWORD', 'secret')
  vi.spyOn(console, 'error').mockImplementation(() => {})
  sendMail.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error('smtp down'))
  const res = await call('POST', good)
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ ok: true })
})

// --- Turnstile -----------------------------------------------------------------------------

const withTurnstile = () => {
  vi.stubEnv('GMAIL_USER', 'me@example.com')
  vi.stubEnv('GMAIL_APP_PASSWORD', 'secret')
  vi.stubEnv('TURNSTILE_SECRET_KEY', 'ts-secret')
}
const siteverify = (result: unknown) => {
  const f = vi.fn(async () => new Response(JSON.stringify(result), { headers: { 'content-type': 'application/json' } }))
  vi.stubGlobal('fetch', f)
  return f
}
afterEach(() => { vi.unstubAllGlobals() })

test('with Turnstile on, a missing token is refused before any network call or mail', async () => {
  withTurnstile()
  const f = siteverify({ success: true })
  const res = await call('POST', good)
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ ok: false, error: 'Please complete the verification and try again.' })
  expect(f).not.toHaveBeenCalled()
  expect(createTransport).not.toHaveBeenCalled()
})

test('with Turnstile on, a token Cloudflare rejects sends nothing', async () => {
  withTurnstile()
  siteverify({ success: false, 'error-codes': ['invalid-input-response'] })
  const res = await call('POST', { ...good, 'cf-turnstile-response': 'bad' })
  expect(res.status).toBe(400)
  expect(createTransport).not.toHaveBeenCalled()
})

test('with Turnstile on, a verified token lets the enquiry through', async () => {
  withTurnstile()
  const f = siteverify({ success: true })
  const res = await call('POST', { ...good, 'cf-turnstile-response': 'tok-123' })
  expect(res.status).toBe(200)
  expect(sendMail).toHaveBeenCalledTimes(2)
  const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit]
  expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify')
  expect(init.method).toBe('POST')
  const sent = init.body as URLSearchParams
  expect(sent.get('secret')).toBe('ts-secret')
  expect(sent.get('response')).toBe('tok-123')
})

test('with Turnstile on, an unreachable verifier fails closed', async () => {
  withTurnstile()
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('network') }))
  const res = await call('POST', { ...good, 'cf-turnstile-response': 'tok-123' })
  expect(res.status).toBe(503)
  expect(createTransport).not.toHaveBeenCalled()
})

test('honeypot still short-circuits before Turnstile', async () => {
  withTurnstile()
  const f = siteverify({ success: true })
  const res = await call('POST', { ...good, company: 'Acme' })
  expect(res.status).toBe(200)
  expect(f).not.toHaveBeenCalled()
})
