const SPEED = 40 // px per second

// Scrolls an element slowly down to its end and back up, over and over, while it is on screen. Paused
// only while a mouse is over it; carries on the moment the mouse leaves. Touch never pauses it, since a
// touch has no "leave". Does nothing under reduced motion.
export function drift(el: HTMLElement): () => void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  let frame = 0
  let last = 0
  let pos = 0 // scrollTop only holds whole pixels, so the fraction is kept here
  let dir = 1
  let hover = false
  let visible = false
  const step = (now: number) => {
    frame = requestAnimationFrame(step)
    const dt = Math.min(now - last, 100)
    last = now
    if (!visible || hover) return
    const max = el.scrollHeight - el.clientHeight
    pos += dir * SPEED * dt / 1000
    if (pos >= max) { pos = max; dir = -1 } else if (pos <= 0) { pos = 0; dir = 1 }
    el.scrollTop = pos
  }
  const enter = (e: PointerEvent) => { if (e.pointerType === 'mouse') hover = true }
  const leave = () => { hover = false }
  el.addEventListener('pointerenter', enter)
  el.addEventListener('pointerleave', leave)
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
  io.observe(el)
  frame = requestAnimationFrame(step)
  return () => {
    cancelAnimationFrame(frame)
    io.disconnect()
    el.removeEventListener('pointerenter', enter)
    el.removeEventListener('pointerleave', leave)
  }
}
