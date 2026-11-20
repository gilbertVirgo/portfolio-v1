const SPEED = 40 // px per second

// Scrolls an element slowly down to its end and back up, over and over, while it is on screen. Hover
// does not pause it. Does nothing under reduced motion.
export function drift(el: HTMLElement): () => void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  let frame = 0
  let last = 0
  let pos = 0 // scrollTop only holds whole pixels, so the fraction is kept here
  let dir = 1
  let visible = false
  const step = (now: number) => {
    frame = requestAnimationFrame(step)
    const dt = Math.min(now - last, 100)
    last = now
    if (!visible) return
    const max = el.scrollHeight - el.clientHeight
    pos += dir * SPEED * dt / 1000
    if (pos >= max) { pos = max; dir = -1 } else if (pos <= 0) { pos = 0; dir = 1 }
    el.scrollTop = pos
  }
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
  io.observe(el)
  frame = requestAnimationFrame(step)
  return () => {
    cancelAnimationFrame(frame)
    io.disconnect()
  }
}
