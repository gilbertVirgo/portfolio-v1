import { drift } from './drift'

// Scrolling that the page does for, or instead of, the visitor.
//
// Mockups (.capture) cannot be scrolled by hand. Each scrolls itself slowly down and back up while on
// screen (drift.ts).
//
// Belts (.belt) scroll sideways, each inside a .pin. The pin is made as tall as the belt plus its
// sideways overflow; the belt sticks at the middle of the screen while the page scrolls through the pin,
// and every pixel scrolled down moves it a pixel sideways. So the whole belt is seen before the page
// moves on, by wheel, touch, keys or scrollbar alike, and scrolling up runs it back. A sideways swipe
// on a pinned belt moves the page to match, so the two never disagree.
export function scrollIntent(): () => void {
  const stops = [...document.querySelectorAll<HTMLElement>('.capture')].map((el) => drift(el))

  const pins = [...document.querySelectorAll<HTMLElement>('.pin')].map((pin) => {
    const belt = pin.firstElementChild as HTMLElement
    let top = 0 // where the belt sticks: centred, or at the top if taller than the screen
    let range = 0 // sideways overflow, and so the extra height of the pin
    // Where the page puts the belt: at its start until it sticks, then 1px sideways per 1px down
    const want = () => Math.min(range, Math.max(0, top - pin.getBoundingClientRect().top))
    const fromPage = () => { belt.scrollLeft = want() }
    const fromBelt = () => {
      const d = belt.scrollLeft - want()
      if (Math.abs(d) < 1) return // our own write, or rounding
      const r = pin.getBoundingClientRect()
      const stuck = r.top <= top + 1 && r.bottom >= top + belt.offsetHeight - 1
      if (stuck) scrollBy(0, d)
      else fromPage() // not stuck: the page decides where the belt is
    }
    const measure = () => {
      range = belt.scrollWidth - belt.clientWidth
      top = Math.max(0, (innerHeight - belt.offsetHeight) / 2)
      belt.style.top = top + 'px'
      pin.style.height = belt.offsetHeight + range + 'px'
      fromPage()
    }
    const ro = new ResizeObserver(measure) // children too: images loading change the overflow
    ;[belt, ...belt.children].forEach((el) => ro.observe(el))
    belt.addEventListener('scroll', fromBelt, { passive: true })
    return { measure, fromPage, stop: () => { ro.disconnect(); belt.removeEventListener('scroll', fromBelt) } }
  })
  const onScroll = () => pins.forEach((p) => p.fromPage())
  const onResize = () => pins.forEach((p) => p.measure())
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', onResize)

  return () => {
    stops.forEach((stop) => stop())
    pins.forEach((p) => p.stop())
    removeEventListener('scroll', onScroll)
    removeEventListener('resize', onResize)
  }
}
