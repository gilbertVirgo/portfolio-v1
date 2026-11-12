import { useBeat } from '../useBeat'
import { st } from '../st'
import { stanzaFrame } from './frame'

const modalWrap = st('position: absolute; inset: 0; background: #2E2E2E66; display: flex; align-items: center; justify-content: center')
const modalTitle = st('font-weight: 600; font-size: 1.7cqw; letter-spacing: -0.02em')
const fieldLabel = (margin: string) => st(`font-weight: 600; font-size: 0.9cqw; color: #505050; margin: ${margin}`)
const menuItem = st('padding: 0.6cqw 0.8cqw')

export function StanzaJourney() {
  const [ref, beat] = useBeat()
  const z = stanzaFrame(beat)
  const live = z.live
  const field = live ? '#1E1E1E' : '#DEDEDE'
  const labelInk = live ? '#FAFAFA' : '#505050'
  const stageRing = live ? '0.25cqw solid #f58549' : '0 solid transparent'
  const btn = live ? { text: 'Stop', key: 'Esc', bg: '#2E2E2E', fg: '#FAFAFA' } : { text: 'Present', key: 'F5', bg: '#f58549', fg: '#2E2E2E' }
  return (
    <div ref={ref} role="img" aria-label="Animated walkthrough of Stanza: add a song from the library, add a Bible reading by typing a reference, then present" style={st('position: relative; aspect-ratio: 16 / 10; overflow: hidden; container-type: inline-size; background: #FAFAFA; color: #2E2E2E; border-radius: 4px')}>
      <div aria-hidden="true" style={st('position: absolute; inset: 0; display: flex; flex-direction: column; letter-spacing: -0.01em; font-family: Inter, sans-serif; font-size: 1.05cqw')}>
      <div style={st('display: flex; align-items: center; gap: 1.2cqw; padding: 0.8cqw 1.4cqw; border-bottom: 0.1cqw solid #D5D5D5')}>
        <span style={st('color: #505050; font-weight: 500')}>‹ Services</span>
        <span style={st('font-weight: 600; font-size: 1.15cqw')}>Sunday morning</span>
        <span style={st('border: 0.1cqw solid #D5D5D5; padding: 0.3cqw 0.8cqw; border-radius: 2cqw; color: #505050; font-size: 0.95cqw')}>Sun 23 Aug</span>
        <span style={st('flex: 1')} />
        <span style={st('font-weight: 600; font-size: 0.95cqw; letter-spacing: 0.08em; color: #9C4310')}>{live ? 'LIVE' : ''}</span>
        <span style={st(`background: ${btn.bg}; color: ${btn.fg}; padding: 0.55cqw 1.2cqw; border-radius: 0.5cqw; font-weight: 600; display: flex; gap: 0.7cqw; align-items: center`)}>
          {btn.text}
          <span style={st('border: 0.1cqw solid currentColor; border-radius: 0.3cqw; padding: 0 0.4cqw; font-size: 0.8cqw')}>{btn.key}</span>
        </span>
      </div>
      <div style={st('flex: 1; min-height: 0; display: flex')}>
        <div style={st('width: 21cqw; border-right: 0.1cqw solid #D5D5D5; padding: 0.9cqw; display: flex; flex-direction: column; gap: 0.6cqw')}>
          {z.rows.map((r, i) =>
            r.kind === 'head' ? (
              <div key={i}>
                <div style={st('display: flex; align-items: center; gap: 0.6cqw; padding: 0.5cqw 0.4cqw; font-weight: 600; font-size: 1cqw; border-bottom: 0.1cqw solid #D5D5D5')}>
                  <span style={st('color: #9B9B9B')}>{r.caret}</span>
                  <span style={st('flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis')}>{r.title}</span>
                  <span style={st('color: #5A5A5A')}>⋯</span>
                </div>
              </div>
            ) : (
              <div key={i}>
                <div style={st(`display: flex; gap: 0.6cqw; padding: 0.4cqw; border-radius: 0.6cqw; background: ${r.wash}; color: #5A5A5A`)}>
                  <span style={st('font-size: 0.85cqw; width: 1.1cqw; font-weight: 500')}>{r.n}</span>
                  <span style={st(`position: relative; flex: 1; aspect-ratio: 16 / 9; background: #000000; color: #FBFBEF; border-radius: 0.3cqw; display: flex; flex-direction: column; gap: 0.5cqw; align-items: center; justify-content: center; text-align: center; font-size: 0.7cqw; font-weight: 600; line-height: 1.2; padding: 0.8cqw; outline: ${r.ring}; outline-offset: 0.15cqw`)}>
                    {r.text}
                    <span style={st(`width: ${r.w1}; height: 0.5cqw; border-radius: 0.3cqw; background: ${r.bar}`)} />
                    <span style={st(`width: ${r.w2}; height: 0.5cqw; border-radius: 0.3cqw; background: ${r.bar}`)} />
                    <span style={st(`position: absolute; left: 0.4cqw; bottom: 0.4cqw; background: ${r.pillBg}; color: #2E2E2E; border-radius: 0.3cqw; padding: 0 0.4cqw; font-size: 0.65cqw`)}>{r.pill}</span>
                  </span>
                </div>
              </div>
            ),
          )}
          <span style={st('flex: 1')} />
          <span style={st('background: #2E2E2E; color: #FAFAFA; border-radius: 0.5cqw; padding: 0.7cqw; text-align: center; font-weight: 600')}>+ Add content</span>
        </div>
        <div style={st(`flex: 1; background: ${field}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.2cqw; padding: 2cqw; transition: background 0.4s ease`)}>
          <div style={st(`width: 88%; aspect-ratio: 16 / 9; background: #000000; color: #FBFBEF; display: flex; flex-direction: column; gap: 1.6cqw; align-items: center; justify-content: center; text-align: center; padding: 4cqw 5cqw; box-shadow: 0 0.6cqw 2cqw #00000033; outline: ${stageRing}`)}>
            {z.stage === 'text' && (
              <div style={st('font-weight: 600; font-size: 5cqw; letter-spacing: -0.045em')}>Welcome</div>
            )}
            {z.stage === 'song' && (
              <>
                <span style={st('width: 62%; height: 2.2cqw; border-radius: 1.1cqw; background: #FBFBEF')} />
                <span style={st('width: 48%; height: 2.2cqw; border-radius: 1.1cqw; background: #FBFBEF')} />
                <span style={st('font-size: 0.9cqw; color: #BDB9AE; margin-top: 2cqw')}>Be Thou My Vision · Public domain</span>
              </>
            )}
            {z.stage === 'bible' && (
              <>
                <div style={st('font-weight: 600; font-size: 2.5cqw; line-height: 1.2; letter-spacing: -0.03em; text-wrap: balance')}>
                  <sup style={st('font-size: 0.62em; color: #BDB9AE; margin-right: 0.4cqw')}>{z.verseNo}</sup>{z.verse}
                </div>
                <div style={st('font-weight: 600; font-size: 1.4cqw; color: #BDB9AE')}>John 3:16–17 · KJV</div>
              </>
            )}
          </div>
          <div style={st(`font-size: 1cqw; color: ${labelInk}; font-weight: 500`)}>{z.stageLabel}</div>
        </div>
      </div>
      {z.menu && (
        <div style={st('position: absolute; left: 0.9cqw; bottom: 4.6cqw; width: 19cqw; background: #FFFFFF; border: 0.1cqw solid #B8B8B8; border-radius: 0.7cqw; box-shadow: 0 0.6cqw 2cqw #00000033; padding: 0.5cqw; font-weight: 500')}>
          <div style={st(`display: flex; justify-content: space-between; padding: 0.6cqw 0.8cqw; border-radius: 0.4cqw; background: ${z.hiSong}`)}>
            Song<span style={st('color: #5A5A5A; font-size: 0.9cqw')}>⌘M</span>
          </div>
          <div style={st(`padding: 0.6cqw 0.8cqw; border-radius: 0.4cqw; background: ${z.hiBible}`)}>Bible reading</div>
          <div style={menuItem}>Sermon slides</div>
          <div style={menuItem}>Video</div>
          <div style={menuItem}>Notices</div>
          <div style={menuItem}>Text slide</div>
        </div>
      )}
      {z.songModal && (
        <div style={modalWrap}>
          <div style={st('width: 54cqw; background: #FFFFFF; border-radius: 1cqw; padding: 2cqw; box-shadow: 0 1cqw 3cqw #00000055')}>
            <div style={modalTitle}>Add a song</div>
            <div style={st('display: flex; gap: 1cqw; margin: 1.4cqw 0 1cqw')}>
              <span style={st(`flex: 1; border: 0.1cqw solid #B8B8B8; border-radius: 0.5cqw; padding: 0.7cqw 1cqw; color: ${z.qInk}; outline: 0.2cqw solid #4A6BC8`)}>{z.q}</span>
              <span style={st('border: 0.1cqw solid #B8B8B8; border-radius: 0.5cqw; padding: 0.7cqw 1cqw; font-weight: 500')}>+ New song</span>
            </div>
            {z.songs.map((s) => (
              <div key={s.title} style={st(`display: flex; align-items: center; gap: 1cqw; padding: 0.8cqw 0.6cqw; border-bottom: 0.1cqw solid #EDEDED; background: ${s.bg}`)}>
                <span style={st('flex: 1')}>
                  <span style={st('display: block; font-weight: 600')}>{s.title}</span>
                  <span style={st('display: block; color: #5A5A5A; font-size: 0.9cqw')}>Hymn · Public domain</span>
                </span>
                <span style={st('color: #505050; font-weight: 500')}>Preview</span>
                <span style={st(`background: ${s.addBg}; color: ${s.addFg}; border: 0.1cqw solid #2E2E2E; border-radius: 0.5cqw; padding: 0.5cqw 1cqw; font-weight: 600`)}>Add song</span>
              </div>
            ))}
            <div style={st('color: #5A5A5A; font-size: 0.9cqw; margin-top: 1cqw')}>{z.songCount} · ↑↓ to move, Tab for its buttons</div>
          </div>
        </div>
      )}
      {z.bibleModal && (
        <div style={modalWrap}>
          <div style={st('width: 46cqw; background: #FFFFFF; border-radius: 1cqw; padding: 2cqw; box-shadow: 0 1cqw 3cqw #00000055')}>
            <div style={modalTitle}>Add a Bible passage</div>
            <div style={fieldLabel('1.4cqw 0 0.5cqw')}>Translation</div>
            <span style={st('display: inline-block; background: #2E2E2E; color: #FAFAFA; border-radius: 0.5cqw; padding: 0.5cqw 1.2cqw; font-weight: 600')}>KJV</span>
            <div style={fieldLabel('1.2cqw 0 0.5cqw')}>Passage</div>
            <div style={st(`border: 0.1cqw solid #B8B8B8; border-radius: 0.5cqw; padding: 0.7cqw 1cqw; color: ${z.refInk}; outline: 0.2cqw solid #4A6BC8`)}>{z.ref}</div>
            <div style={st('border: 0.1cqw solid #D5D5D5; border-radius: 0.6cqw; padding: 1cqw 1.2cqw; margin-top: 1.2cqw; min-height: 7.4cqw; background: #FAFAFA')}>
              <div style={st('font-weight: 600')}>{z.pvRef} <span style={st('color: #5A5A5A; font-weight: 500')}>{z.pvTr}</span></div>
              <div style={st('color: #505050; line-height: 1.4; margin-top: 0.4cqw')}>{z.pvText}</div>
            </div>
            <div style={st('display: flex; justify-content: flex-end; gap: 0.8cqw; margin-top: 1.4cqw')}>
              <span style={st('border: 0.1cqw solid #B8B8B8; border-radius: 0.5cqw; padding: 0.6cqw 1.2cqw; font-weight: 500')}>Cancel</span>
              <span style={st(`background: ${z.readBg}; color: #FAFAFA; border-radius: 0.5cqw; padding: 0.6cqw 1.2cqw; font-weight: 600`)}>Add reading</span>
            </div>
          </div>
        </div>
      )}
      <span style={st(`position: absolute; left: ${z.cx}; top: ${z.cy}; width: 2.4cqw; height: 2.4cqw; margin: -1.2cqw 0 0 -1.2cqw; border-radius: 50%; background: #2E2E2E33; border: 0.15cqw solid #2E2E2E; box-shadow: 0 0 0 0.15cqw #FAFAFA; transition: left 0.6s ease, top 0.6s ease; pointer-events: none`)} />
      </div>
    </div>
  )
}
