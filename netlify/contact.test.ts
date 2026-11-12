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

test('valid POST sends one mail to the owner with replyTo', async () => {
  vi.stubEnv('GMAIL_USER', 'me@example.com')
  vi.stubEnv('GMAIL_APP_PASSWORD', 'secret')
  const res = await call('POST', good)
  expect(res.status).toBe(200)
  expect(sendMail).toHaveBeenCalledTimes(1)
  expect(sendMail.mock.calls[0][0]).toMatchObject({ to: 'me@example.com', replyTo: { name: 'Sam Taylor', address: 'sam@example.org' } })
})
