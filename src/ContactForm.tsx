import { useState, type FormEvent } from 'react'
import { st } from './st'

const FIELD = 'background: transparent; border: 0; border-bottom: 1px solid #9a9a9a; color: #ffffff; font: inherit; font-weight: 500; font-size: 20px; padding: 8px 0; border-radius: 0'

export function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('sending'); setError('')
    const body = Object.fromEntries(new FormData(e.currentTarget))
    try {
      const res = await fetch('/.netlify/functions/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json().catch(() => ({}))
      if (res.ok) return setState('sent')
      setError(data.error || 'Could not send your message. Please try again.')
    } catch {
      setError('Could not send your message. Please check your connection and try again.')
    }
    setState('idle')
  }

  if (state === 'sent') return <p role="status" tabIndex={-1} ref={(n) => n?.focus()} style={st('flex: 3 1 480px; margin: 0; font-size: 20px; font-weight: 500')}>Thank you — your message is on its way. I’ll reply by email.</p>

  return (
    <form method="post" onSubmit={submit} style={st('flex: 3 1 480px; min-width: 0; display: flex; flex-direction: column; gap: 28px; max-width: 760px')}>
      <div style={st('display: flex; flex-wrap: wrap; gap: 28px 32px')}>
        <label style={st('flex: 1 1 220px; display: flex; flex-direction: column; gap: 4px')}>Name
          <input type="text" name="name" autoComplete="name" required maxLength={100} style={st('min-height: 48px; ' + FIELD)} />
        </label>
        <label style={st('flex: 1 1 220px; display: flex; flex-direction: column; gap: 4px')}>Email
          <input type="email" name="email" autoComplete="email" required style={st('min-height: 48px; ' + FIELD)} />
        </label>
      </div>
      <label style={st('display: flex; flex-direction: column; gap: 4px')}>What do you need?
        <textarea name="message" rows={4} required maxLength={5000} style={st(FIELD + '; resize: vertical')} />
      </label>
      {/* honeypot: hidden from people, tempting to bots */}
      <div hidden><input type="text" name="company" autoComplete="off" /></div>
      {error && <p role="alert" style={st('margin: 0; color: #ffb4b4')}>{error}</p>}
      <button type="submit" disabled={state === 'sending'} style={st('align-self: flex-start; min-height: 52px; padding: 0 32px; background: #ffffff; color: #0a0a0a; border: 0; border-radius: 999px; font: inherit; font-weight: 600; font-size: 17px; cursor: pointer')}>
        {state === 'sending' ? 'Sending…' : 'Send'}
      </button>
    </form>
  )
}
