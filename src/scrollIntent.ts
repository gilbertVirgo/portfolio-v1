// Experiment: when may a mockup take a touch swipe instead of the page? Pick a rule with ?scroll=
//   inview  a mockup scrolls only while it is fully on screen; partly visible, swipes move the page
//   settle  as inview, and the page must also have been still for a moment, so a flick passing through doesn't catch
//   tap     a mockup scrolls only after it is tapped; it lets go when it leaves the screen or you tap elsewhere
// Anything else, or a mouse/trackpad: native behaviour. .locked (styles.css) turns the mockup's own scrolling off.
export function scrollIntent(rule: string | null): () => void {
  if (!rule || !matchMedia('(pointer: coarse)').matches) return () => {}
  const caps = [...document.querySelectorAll<HTMLElement>('.capture')]
  const lock = (el: Element, on: boolean) => el.classList.toggle('locked', on)
  caps.forEach((el) => lock(el, true))
  document.documentElement.dataset.scroll = rule

  if (rule === 'tap') {
    const onClick = (e: MouseEvent) => {
      const hit = (e.target as Element).closest('.capture')
      caps.forEach((el) => lock(el, el !== hit))
    }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) lock(e.target, true) }))
    caps.forEach((el) => io.observe(el))
    document.addEventListener('click', onClick)
    return () => { io.disconnect(); document.removeEventListener('click', onClick) }
  }

  let settled = true
  let timer = 0
  const update = () => caps.forEach((el) => {
    const r = el.getBoundingClientRect()
    const full = r.height > 0 && r.top >= -8 && r.bottom <= innerHeight + 8 // 8px slack for toolbar jitter
    lock(el, !(full && settled))
  })
  const onScroll = () => {
    if (rule === 'settle') {
      settled = false
      clearTimeout(timer)
      timer = window.setTimeout(() => { settled = true; update() }, 400)
    }
    update()
  }
  update()
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', update)
  return () => { clearTimeout(timer); removeEventListener('scroll', onScroll); removeEventListener('resize', update) }
}
