// Mockups (.capture) scroll inside the page, so a swipe or wheel passing over one could get caught in
// it. A mockup only takes scrolling when it is fully on screen and the page has been still for a
// moment. Otherwise it is .locked (styles.css) and the scroll goes to the page. The first time a
// scrollable mockup unlocks, a "Scroll me" hint shows on it until it is scrolled or HINT_MS passes,
// one hint at a time.
const SETTLE_MS = 250
const HINT_MS = 2500

export function scrollIntent(): () => void {
  const caps = [...document.querySelectorAll<HTMLElement>('.capture')]
  const hinted = new Set<HTMLElement>()
  let settled = true
  let timer = 0
  let showing = false

  const hint = (el: HTMLElement) => {
    hinted.add(el)
    showing = true
    const tip = document.createElement('span')
    tip.className = 'hint'
    tip.textContent = 'Scroll me'
    tip.setAttribute('aria-hidden', 'true')
    el.after(tip)
    tip.getBoundingClientRect() // commit opacity 0 so .show fades in
    tip.classList.add('show')
    let done = false
    const hide = () => {
      if (done) return
      done = true
      showing = false
      el.removeEventListener('scroll', hide)
      tip.classList.remove('show')
      setTimeout(() => tip.remove(), 400)
    }
    el.addEventListener('scroll', hide)
    setTimeout(hide, HINT_MS)
  }

  const update = () => caps.forEach((el) => {
    const r = el.getBoundingClientRect()
    const open = settled && r.height > 0 && r.top >= -8 && r.bottom <= innerHeight + 8 // 8px slack for toolbar jitter
    el.classList.toggle('locked', !open)
    if (open && !showing && !hinted.has(el) && el.scrollHeight > el.clientHeight + 1) hint(el)
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
  addEventListener('toggle', update, true) // More work opening reveals mockups without a scroll
  addEventListener('load', update, true) // a lazy screenshot loading makes its mockup scrollable
  return () => {
    clearTimeout(timer)
    removeEventListener('scroll', onScroll)
    removeEventListener('resize', update)
    removeEventListener('toggle', update, true)
    removeEventListener('load', update, true)
    document.querySelectorAll('.hint').forEach((t) => t.remove())
  }
}
