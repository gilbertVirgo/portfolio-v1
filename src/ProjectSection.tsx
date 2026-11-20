import type { Project } from './projects'
import { st } from './st'

const PAD = 'clamp(16px, 2.5cqw, 36px)'

// No orphans in short headings (text-wrap: pretty leaves 2-4 word lines alone): the last two words go in
// an inline-block, so they share a line when they fit and split, one word a line, when they don't.
export const noOrphan = (s: string) => {
  const i = s.lastIndexOf(' ', s.lastIndexOf(' ') - 1)
  return i < 0 ? s : <>{s.slice(0, i + 1)}<span style={{ display: 'inline-block' }}>{s.slice(i + 1)}</span></>
}

export function ProjectSection({ p, index, total }: { p: Project; index: number; total: number }) {
  const n = String(index + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0')
  const head = (
    <>
      <div className="meta" style={st(`display: flex; flex-wrap: wrap; gap: 8px 32px; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid ${p.fg}`)}>
        <span style={st('flex: 1 1 160px')}>{n}</span>
        <span style={st('flex: 2 1 280px')}>{p.disciplines}</span>
        <span className="meta-links" style={st('flex: 1 1 200px; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; text-align: right')}>{p.links}</span>
      </div>
      <h2 style={st('margin: clamp(24px, 3cqw, 40px) 0 clamp(28px, 4.5cqw, 64px); font-size: min(168px, max(11cqw, min(18cqw, 138px))); font-weight: 600; line-height: 0.88; letter-spacing: -0.02em')}>{noOrphan(p.title)}</h2>
    </>
  )
  return (
    <section id={p.id} style={st(`background: ${p.bg}; color: ${p.fg}; padding: 0 ${p.bleed ? '0' : PAD} 112px`)}>
      {p.bleed ? <div style={st(`padding: 0 ${PAD}`)}>{head}</div> : head}
      {p.bleed ? p.stage : <div className="stage" style={st('display: flex; flex-wrap: wrap; gap: 48px; align-items: flex-end')}>{p.stage}</div>}
    </section>
  )
}

