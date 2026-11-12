export type RailRow =
  | { kind: 'head'; title: string; caret: string }
  | { kind: 'thumb'; n: number; text: string; bar: string; w1: string; w2: string; pill: string; pillBg: string; wash: string; ring: string }
export type SongRow = { title: string; bg: string; addBg: string; addFg: string }
export type StanzaFrame = {
  rows: RailRow[]
  menu: boolean; hiSong: string; hiBible: string
  songModal: boolean; q: string; qInk: string; songs: SongRow[]; songCount: string
  bibleModal: boolean; ref: string; refInk: string; pvRef: string; pvTr: string; pvText: string; readBg: string
  stage: 'text' | 'song' | 'bible'; verseNo: string; verse: string; stageLabel: string
  live: boolean
  cx: string; cy: string
}

// 16 beats: add song -> add Bible reading -> present. The cursor rests on the control the next beat acts on.
export function stanzaFrame(t: number): StanzaFrame {
  const g = t % 16
  const hasSong = g >= 5, hasBible = g >= 11, live = g >= 13
  const V16 = 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.'
  const V17 = 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.'
  const focus = hasBible ? 'bible' : hasSong ? 'song' : 'text'
  const sel = g >= 12 ? 'b2' : hasBible ? 'b1' : hasSong ? 's1' : 'w'
  const rows: RailRow[] = []
  let num = 0
  const head = (title: string, open: boolean) => rows.push({ kind: 'head', title, caret: open ? '▾' : '▸' })
  const thumb = (id: string, o: { text?: string; song?: boolean; w1?: string; w2?: string; pill?: string }) => {
    num++
    const on = id === sel
    rows.push({
      kind: 'thumb', n: num, text: o.text || '', bar: o.song ? '#FBFBEF' : 'transparent', w1: o.w1 || '0', w2: o.w2 || '0',
      pill: o.pill || '', pillBg: o.pill ? '#a1caa8' : 'transparent',
      wash: on ? (live ? '#FBE4D2' : '#E4EAF6') : 'transparent',
      ring: on ? '0.2cqw solid ' + (live ? '#f58549' : '#4A6BC8') : '0 solid transparent',
    })
  }
  head('Welcome', focus === 'text')
  if (focus === 'text') thumb('w', { text: 'Welcome' }); else num += 1
  if (hasSong) {
    head('Be Thou My Vision', focus === 'song')
    if (focus === 'song') {
      thumb('s1', { song: true, pill: 'Verse 1', w1: '60%', w2: '46%' })
      thumb('s2', { song: true, pill: 'Verse 1', w1: '52%', w2: '58%' })
      thumb('s3', { song: true, pill: 'Verse 2', w1: '64%', w2: '40%' })
    } else num += 8
  }
  if (hasBible) {
    head('John 3:16–17 · KJV', true)
    thumb('b1', { text: '16 For God so loved the world…' })
    thumb('b2', { text: '17 For God sent not his Son…' })
  }
  const q = g === 2 ? '' : 'be thou'
  const all = ['A Mighty Fortress Is Our God', 'Abide with Me', 'Amazing Grace', 'Be Thou My Vision', 'It Is Well with My Soul']
  const songs = (g === 2 ? all : ['Be Thou My Vision']).map((title) => {
    const hit = g >= 3 && title === 'Be Thou My Vision'
    return { title, bg: hit ? '#E4EAF6' : 'transparent', addBg: g === 4 && hit ? '#2E2E2E' : '#FFFFFF', addFg: g === 4 && hit ? '#FAFAFA' : '#2E2E2E' }
  })
  const typedRef = g === 7 ? '' : 'john 3:16-17'
  const ADD = ['10.5%', '96.4%'], ADDSONG = ['70.8%', '50.8%'], REF = ['50%', '48%'], READ = ['66.6%', '68.2%'], PRESENT = ['94%', '3.2%']
  const zc = [ADD, ['8%', '70.2%'], ['45%', '34%'], ADDSONG, ADDSONG, ADD, ['8%', '74.1%'], REF, REF, READ, READ, ['11%', '47.1%'], PRESENT, PRESENT, ['62%', '55%'], ['62%', '55%']][g]
  return {
    rows,
    menu: g === 1 || g === 6,
    hiSong: g === 1 ? '#EDEDED' : 'transparent', hiBible: g === 6 ? '#EDEDED' : 'transparent',
    songModal: g >= 2 && g <= 4,
    q: q || 'Search songs', qInk: q ? '#2E2E2E' : '#5A5A5A',
    songs, songCount: songs.length === 1 ? '1 song' : songs.length + ' songs',
    bibleModal: g >= 7 && g <= 10,
    ref: typedRef || 'John 3:16–18', refInk: typedRef ? '#2E2E2E' : '#5A5A5A',
    pvRef: g >= 9 ? 'John 3:16–17' : '', pvTr: g >= 9 ? 'KJV' : '', pvText: g === 8 ? 'Fetching verses…' : g >= 9 ? V16 : '',
    readBg: g === 10 ? '#505050' : '#2E2E2E',
    stage: hasBible ? 'bible' : hasSong ? 'song' : 'text',
    verseNo: sel === 'b2' ? '17' : '16', verse: sel === 'b2' ? V17 : V16,
    stageLabel: live ? 'On screen now' : hasBible ? 'Reading · fitted to the screen automatically' : hasSong ? 'Song · split into slides by verse' : 'Text slide',
    live,
    cx: zc[0], cy: zc[1],
  }
}
