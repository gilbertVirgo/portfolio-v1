import type { ReactNode } from 'react'
import { st } from './st'

export function Laptop({ children, outline }: { children: ReactNode; outline?: boolean }) {
  const edge = outline ? '; border: 1px solid #5a5a5a' : ''
  return (
    <div className="laptop" style={st('flex: 4 1 420px; min-width: 0')}>
      <div style={st('background: #0d0d0d; padding: 1.4%; border-radius: 18px 18px 0 0' + edge + (outline ? '; border-bottom: 0' : ''))}>{children}</div>
      <div style={st('height: 14px; background: #0d0d0d; border-top: 1px solid #3a3a3a; border-radius: 0 0 14px 14px; margin: 0 -2%' + edge)} />
    </div>
  )
}

export function Tablet({ children }: { children: ReactNode }) {
  return <div className="tablet" style={st('flex: 1.4 1 260px; max-width: 380px; min-width: 0; background: #0d0d0d; padding: 10px; border-radius: 22px')}>{children}</div>
}

export function Phone({ children }: { children: ReactNode }) {
  return <div className="phone" style={st('flex: 1 1 160px; max-width: 270px; min-width: 0; background: #0d0d0d; padding: 8px; border-radius: 34px')}>{children}</div>
}

// A full-page screenshot behind a screen-shaped window. The visitor cannot scroll it: it scrolls itself
// slowly down and back up (scrollIntent.ts), so the window has no scrollbar and takes no focus.
export function Capture(p: { src: string; alt: string; ratio: string; bg: string; radius: string }) {
  return (
    <div className="capture" style={st(`aspect-ratio: ${p.ratio}; overflow: hidden; background: ${p.bg}; border-radius: ${p.radius}`)}>
      <img src={p.src} alt={p.alt} loading="lazy" style={st('width: 100%; display: block')} />
    </div>
  )
}
