import { useEffect, useRef } from 'react'
import type { Project } from './projects'
import { st } from './st'

const PAD = 'clamp(16px, 2.5cqw, 36px)'

export function ProjectSection({ p, index, total }: { p: Project; index: number; total: number }) {
  const n = String(index + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0')
  const head = (
    <>
      <div className="meta" style={st(`display: flex; flex-wrap: wrap; gap: 8px 32px; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid ${p.fg}`)}>
        <span style={st('flex: 1 1 160px')}>{n}</span>
        <span style={st('flex: 2 1 280px')}>{p.disciplines}</span>
        <span className="meta-links" style={st('flex: 1 1 200px; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; text-align: right')}>{p.links}</span>
      </div>
      <Title text={p.title} />
    </>
  )
  return (
    <section id={p.id} style={st(`background: ${p.bg}; color: ${p.fg}; padding: 0 ${p.bleed ? '0' : PAD} 112px`)}>
      {p.bleed ? <div style={st(`padding: 0 ${PAD}`)}>{head}</div> : head}
      {p.bleed ? p.stage : <div className="stage" style={st('display: flex; flex-wrap: wrap; gap: 48px; align-items: flex-end')}>{p.stage}</div>}
    </section>
  )
}

// Project title. If it doesn't fit on one line it runs as a conveyor belt: the .rep copies and the
// animation live in styles.css under .title.belt. Class toggle only, no re-render.
function Title({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    const h = ref.current!
    const first = h.querySelector<HTMLElement>('.title-track > span')!
    const ro = new ResizeObserver(() => {
      const cs = getComputedStyle(h)
      const room = h.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      h.classList.toggle('belt', first.offsetWidth > room)
      h.style.setProperty('--belt-dur', `${Math.round(first.offsetWidth / 90)}s`) // ~90px a second
    })
    ro.observe(h)
    return () => ro.disconnect()
  }, [])
  return (
    <h2 ref={ref} className="title" style={st('margin: clamp(24px, 3cqw, 40px) 0 clamp(28px, 4.5cqw, 64px); font-size: min(168px, max(11cqw, min(18cqw, 138px))); font-weight: 600; line-height: 0.88; letter-spacing: -0.02em')}>
      <span className="title-track">
        <span>{text}</span>
        <span className="rep" aria-hidden="true">·</span>
        <span className="rep" aria-hidden="true">{text}</span>
        <span className="rep" aria-hidden="true">·</span>
      </span>
    </h2>
  )
}
