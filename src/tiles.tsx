import { useEffect, useRef, type ReactNode } from 'react'

// Tiles that sit beside the mockups in a project's belt (styles.css, "Belt and tiles"). They show what
// a screenshot can't: the landing video, the headline build-in and the button hover, set in HTML with
// each client site's own fonts and CSS. Decorative: each tile is one labelled image to assistive tech.

const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Runs `on` while the element is at least half on screen and `off` when it leaves.
function useInView(ref: { current: Element | null }, on: () => void, off: () => void) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? on() : off()), { threshold: 0.5 })
    io.observe(el)
    return () => { io.disconnect(); off() }
  }, [])
}

// Landing video, muted and looping, under the page's headline and buttons. preload="none": the poster
// frame is all that downloads until the tile is on screen. Paused off screen; never plays under reduced motion.
export function HeroTile({ site, video, poster, label, children }: { site: string; video: string; poster: string; label: string; children: ReactNode }) {
  const ref = useRef<HTMLVideoElement>(null)
  useInView(ref, () => {
    const v = ref.current
    if (!v || still()) return
    v.muted = true // React does not reliably set the attribute, and autoplay needs it
    v.play().catch(() => {})
  }, () => ref.current?.pause())
  return (
    <div className={`tile hero ${site}`} role="img" aria-label={label}>
      <video ref={ref} src={video} poster={poster} muted loop playsInline preload="none" />
      {children}
    </div>
  )
}

// Selhurst headline: each word wipes up in turn when the tile comes into view, then again every few
// seconds while it stays. Replayed by re-adding a class, so nothing remounts and each run is finite.
export function WordReveal({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const timer = useRef(0)
  useInView(ref, () => {
    const el = ref.current
    if (!el) return
    const play = () => { el.classList.remove('play'); el.getBoundingClientRect(); el.classList.add('play') }
    play()
    if (!still()) timer.current = window.setInterval(play, 5000)
  }, () => clearInterval(timer.current))
  return <h3 ref={ref}>{text.split(' ').map((w, i) => <span key={i} className="word-reveal" style={{ animationDelay: `${i * 0.15}s` }}>{w}</span>)}</h3>
}

const arrow = <svg viewBox="0 0 512 512" aria-hidden="true"><path fill="currentColor" d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" /></svg>

// Highbury's two buttons. They respond to a real pointer; with `demo` they also take turns looking
// hovered until a pointer arrives, so the fill is seen on touch screens too.
export function HbcButtons({ demo }: { demo?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const timer = useRef(0)
  const hands = useRef(false)
  useInView(ref, () => {
    const el = ref.current
    if (!el || !demo || still()) return
    let i = 0
    timer.current = window.setInterval(() => {
      if (!hands.current) [...el.children].forEach((b, n) => b.classList.toggle('on', n === i % 3)) // third beat: both at rest
      i++
    }, 1100)
  }, () => clearInterval(timer.current))
  const enter = () => { hands.current = true; [...(ref.current?.children ?? [])].forEach((b) => b.classList.remove('on')) }
  return (
    <div ref={ref} className="row" onPointerEnter={enter} onPointerLeave={() => { hands.current = false }}>
      <span className="hbc-button primary">Visit us{arrow}<span className="underlay" /></span>
      <span className="hbc-button secondary">Find out more{arrow}<span className="underlay" /></span>
    </div>
  )
}
