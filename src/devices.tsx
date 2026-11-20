import { useRef, type ReactNode, type SyntheticEvent } from 'react'
import { st } from './st'
import { still, useInView } from './tiles'

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
// Skeleton shimmer until the screen loads (or fails, so it never sweeps forever). Set by classList,
// not className, so a re-render can't drop classes other code adds.
export function Capture(p: { src: string; alt: string; ratio: string; bg: string; radius: string }) {
  const done = (e: SyntheticEvent<HTMLImageElement>) => e.currentTarget.parentElement!.classList.add('loaded')
  return (
    <div className="capture" style={st(`aspect-ratio: ${p.ratio}; overflow: hidden; background: ${p.bg}; border-radius: ${p.radius}`)}>
      <img src={p.src} alt={p.alt} loading="lazy" onLoad={done} onError={done} style={st('width: 100%; display: block')} />
    </div>
  )
}

// Print pieces as the objects they are (styles.css, "Print"). Sized in em off the belt's unit, so they
// stand as tall as the laptop. The art is described once, on the outer element.

// A pavement A-board: two boards hinged at the top, a poster on each, turning slowly while on screen.
export function ABoard({ front, back, label }: { front: string; back: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useInView(ref, () => ref.current?.classList.add('run'), () => ref.current?.classList.remove('run'))
  const board = (side: string, src: string) => (
    <div className={`board ${side}`}>
      <div className="face"><img src={src} alt="" loading="lazy" /><i className="shade" /></div>
      <div className="rear"><i className="shade" /></div>
      <i className="edge l" /><i className="edge r" /><i className="edge top" /><i className="leg l" /><i className="leg r" />
    </div>
  )
  return (
    <div ref={ref} className="print aboard" role="img" aria-label={label}>
      <i className="ground" />
      <div className="tilt"><div className="spin">{board('front', front)}{board('back', back)}</div></div>
    </div>
  )
}

// A pull-up roller banner, front on. Rail and base stretch to the art's width. Each time it comes into
// view the graphic rolls up out of the base (.up); it drops back out of sight when it leaves.
export function Roller({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useInView(ref, () => ref.current?.classList.add('up'), () => ref.current?.classList.remove('up'))
  return (
    <div ref={ref} className="print roller">
      <i className="ground" />
      <div className="pull"><div className="roll"><i className="rail" /><div className="graphic"><img src={src} alt={alt} loading="lazy" /></div></div></div>
      <div className="cassette"><i className="foot l" /><i className="foot r" /></div>
    </div>
  )
}

// A flyer hanging at an angle. It turns over every few seconds while on screen (`lag` delays the first
// turn, so two flyers side by side take turns); a tap, click or mouse over turns it at once.
export function Flyer({ front, back, label, lag = 0 }: { front: string; back: string; label: string; lag?: number }) {
  const ref = useRef<HTMLButtonElement>(null)
  const timer = useRef(0)
  const turn = () => ref.current?.classList.toggle('over')
  const start = (wait: number) => {
    clearInterval(timer.current) // clears the first-turn timeout too: they share one id pool
    if (!still()) timer.current = window.setTimeout(() => { turn(); timer.current = window.setInterval(turn, 4000) }, wait)
  }
  const now = () => { turn(); start(4000) }
  useInView(ref, () => start(4000 + lag), () => clearInterval(timer.current))
  return (
    <div className="print flyer" role="group" aria-label={label}>
      <i className="ground" />
      <button ref={ref} type="button" aria-label="Turn the flyer over" onClick={now} onPointerEnter={(e) => e.pointerType === 'mouse' && now()}>
        <span className="sheet"><img src={front} alt="" loading="lazy" /></span>
        <span className="sheet back"><img src={back} alt="" loading="lazy" /></span>
      </button>
    </div>
  )
}
