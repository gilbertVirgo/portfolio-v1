import { expect, test } from 'vitest'
import { validate } from './contact'

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
