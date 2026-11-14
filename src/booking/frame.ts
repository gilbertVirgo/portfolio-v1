export type Day = { n: number; bg: string; fg: string; dot: string }
export type BookingFrame = {
  screen: 'size' | 'calendar' | 'details' | 'review' | 'done'
  steps: [string, string, string] // colours of progress dashes 2–4
  size: number
  days: Day[]; picked: boolean
  name: string; email: string; phone: string
  payBorder: string; payMark: string
  btn: string
  cx: string; cy: string
}

// How long each beat lasts. The + clicks and field fills run quick; 700ms still
// leaves the 0.6s cursor glide time to land before the next field fills.
export const bookingBeatMs = [700, 500, 1100, 1300, 1300, 700, 700, 700, 1100, 1300, 1300, 1300, 1300] as const

// 13 beats. The cursor rests on the control the next beat acts on.
export function bookingFrame(t: number): BookingFrame {
  const f = t % 13
  const RED = '#A8192E', GREY = '#d9d9d9'
  const screenIndex = f < 3 ? 0 : f < 5 ? 1 : f < 9 ? 2 : f < 11 ? 3 : 4
  const picked = f >= 4
  const avail = [3, 6, 10, 13, 17, 20, 24, 27]
  const days: Day[] = []
  for (let n = 1; n <= 28; n++) {
    const sel = picked && n === 13
    days.push({ n, bg: sel ? RED : '#ffffff', fg: sel ? '#ffffff' : '#282828', dot: sel ? '#ffffff' : avail.indexOf(n) >= 0 ? RED : 'transparent' })
  }
  const NEXT = ['50%', '93.5%']
  const PLUS = ['44%', '36%']
  const cur = [PLUS, PLUS, NEXT, ['75.5%', '40.4%'], NEXT, ['50%', '35%'], ['50%', '50.7%'], ['50%', '66.4%'], NEXT, ['50%', '65.6%'], NEXT, NEXT, NEXT][f]
  return {
    screen: (['size', 'calendar', 'details', 'review', 'done'] as const)[screenIndex],
    steps: [screenIndex >= 1 ? RED : GREY, screenIndex >= 2 ? RED : GREY, screenIndex >= 3 ? RED : GREY],
    size: f === 0 ? 1 : f === 1 ? 2 : 3,
    days, picked,
    name: f >= 6 ? 'Sam Taylor' : '', email: f >= 7 ? 'sam@example.org' : '', phone: f >= 8 ? '07700 900123' : '',
    payBorder: f >= 10 ? '0.5cqw solid ' + RED : '0.3cqw solid #8a8a8a', payMark: f >= 10 ? 'Selected' : '',
    btn: screenIndex === 3 ? 'CONFIRM ›' : screenIndex === 4 ? 'DONE' : 'NEXT ›',
    cx: cur[0], cy: cur[1],
  }
}
