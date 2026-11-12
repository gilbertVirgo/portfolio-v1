import { expect, test } from 'vitest'
import { stanzaFrame } from './frame'

const titles = (t: number) => stanzaFrame(t).rows.flatMap((r) => (r.kind === 'head' ? [r.title] : []))

test('loops every 16 beats', () => {
  expect(stanzaFrame(16)).toEqual(stanzaFrame(0))
})

test('overlays open in order: menu, song modal, menu, bible modal', () => {
  const overlay = Array.from({ length: 16 }, (_, t) => {
    const f = stanzaFrame(t)
    return f.menu ? 'menu' : f.songModal ? 'song' : f.bibleModal ? 'bible' : '-'
  })
  expect(overlay).toEqual(['-', 'menu', 'song', 'song', 'song', '-', 'menu', 'bible', 'bible', 'bible', 'bible', '-', '-', '-', '-', '-'])
})

test('rail gains the song, then the reading', () => {
  expect(titles(0)).toEqual(['Welcome'])
  expect(titles(5)).toEqual(['Welcome', 'Be Thou My Vision'])
  expect(titles(11)).toEqual(['Welcome', 'Be Thou My Vision', 'John 3:16–17 · KJV'])
})

test('song search filters to one result', () => {
  expect(stanzaFrame(2).songs).toHaveLength(5)
  expect(stanzaFrame(3).songs.map((s) => s.title)).toEqual(['Be Thou My Vision'])
  expect(stanzaFrame(3).q).toBe('be thou')
})

test('bible preview: empty, fetching, then verse', () => {
  expect(stanzaFrame(7).pvText).toBe('')
  expect(stanzaFrame(8).pvText).toBe('Fetching verses…')
  expect(stanzaFrame(9).pvText).toMatch(/^For God so loved the world/)
})

test('stage follows content and goes live at beat 13', () => {
  expect([0, 5, 11].map((t) => stanzaFrame(t).stage)).toEqual(['text', 'song', 'bible'])
  expect(stanzaFrame(12).verseNo).toBe('17')
  expect(stanzaFrame(12).live).toBe(false)
  expect(stanzaFrame(13).live).toBe(true)
})

test('song slides carry bars, never text', () => {
  const songThumbs = stanzaFrame(5).rows.filter((r) => r.kind === 'thumb' && r.pill !== '')
  expect(songThumbs).toHaveLength(3)
  for (const r of songThumbs) if (r.kind === 'thumb') expect(r.text).toBe('')
})
