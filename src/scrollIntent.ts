import { drift } from './drift'

// Scrolling that the page does for, or instead of, the visitor.
//
// Mockups (.capture) cannot be scrolled by hand. Each scrolls itself slowly down and back up while on
// screen (drift.ts), pausing only while a mouse is over it.
//
// Belts (.belt) scroll sideways. While one is fully on screen, an up or down wheel moves it sideways
// instead of the page, until it reaches that end; then the wheel goes back to the page. Wheel and
// trackpad only: a vertical swipe on a touch screen still moves the page.
export function scrollIntent(): () => void {
  const stops = [...document.querySelectorAll<HTMLElement>('.capture')].map((el) => drift(el))

  const onWheel = (e: WheelEvent) => {
    const el = e.currentTarget as HTMLElement
    if (e.ctrlKey || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return // pinch zoom, or already sideways
    const r = el.getBoundingClientRect()
    if (r.top < -8 || r.bottom > innerHeight + 8) return // 8px slack for toolbar jitter
    const room = e.deltaY > 0 ? el.scrollWidth - el.clientWidth - el.scrollLeft : el.scrollLeft
    if (room < 1) return
    e.preventDefault()
    el.scrollLeft += e.deltaY * (e.deltaMode === 1 ? 16 : 1) // deltaMode 1: lines, not pixels
  }
  const belts = [...document.querySelectorAll<HTMLElement>('.belt')]
  belts.forEach((el) => el.addEventListener('wheel', onWheel, { passive: false }))

  return () => {
    stops.forEach((stop) => stop())
    belts.forEach((el) => el.removeEventListener('wheel', onWheel))
  }
}
