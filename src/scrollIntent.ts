// Touch screens: a near-full-width mockup would catch swipes meant for the page. So a mockup takes a
// swipe only when it is fully on screen and the page has been still for a moment (a flick passing
// through doesn't catch). Otherwise it is .locked (styles.css) and the swipe scrolls the page.
// Mouse and trackpad keep native behaviour.
const SETTLE_MS = 250

export function scrollIntent(): () => void {
  if (!matchMedia('(pointer: coarse)').matches) return () => {}
  const caps = [...document.querySelectorAll<HTMLElement>('.capture')]
  let settled = true
  let timer = 0
  const update = () => caps.forEach((el) => {
    const r = el.getBoundingClientRect()
    const full = r.height > 0 && r.top >= -8 && r.bottom <= innerHeight + 8 // 8px slack for toolbar jitter
    el.classList.toggle('locked', !(full && settled))
  })
  const onScroll = () => {
    settled = false
    clearTimeout(timer)
    timer = window.setTimeout(() => { settled = true; update() }, SETTLE_MS)
    update()
  }
  update()
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', update)
  return () => { clearTimeout(timer); removeEventListener('scroll', onScroll); removeEventListener('resize', update) }
}
