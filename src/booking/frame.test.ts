import { expect, test } from 'vitest'
import { bookingFrame } from './frame'

test('loops every 13 beats', () => {
  expect(bookingFrame(13)).toEqual(bookingFrame(0))
})

test('walks size → calendar → details → review → done', () => {
  const screens = Array.from({ length: 13 }, (_, t) => bookingFrame(t).screen)
  expect(screens).toEqual(['size', 'size', 'size', 'calendar', 'calendar', 'details', 'details', 'details', 'details', 'review', 'review', 'done', 'done'])
})

test('group size counts 1, 2, 3', () => {
  expect([0, 1, 2].map((t) => bookingFrame(t).size)).toEqual([1, 2, 3])
})

test('cursor reaches a control one beat before it reacts', () => {
  // beat 3: cursor is on day 13, not yet picked; beat 4: picked
  expect(bookingFrame(3).picked).toBe(false)
  expect([bookingFrame(3).cx, bookingFrame(3).cy]).toEqual(['75.5%', '40.4%'])
  expect(bookingFrame(4).picked).toBe(true)
  expect(bookingFrame(4).days[12]).toMatchObject({ n: 13, bg: '#A8192E', fg: '#ffffff' })
})

test('details fill in one field per beat', () => {
  expect(bookingFrame(5)).toMatchObject({ name: '', email: '', phone: '' })
  expect(bookingFrame(8)).toMatchObject({ name: 'Sam Taylor', email: 'sam@example.org', phone: '07700 900123' })
})

test('every beat is complete', () => {
  for (let t = 0; t < 13; t++) {
    const f = bookingFrame(t)
    expect(f.days).toHaveLength(28)
    expect(f.cx).toMatch(/%$/)
    expect(f.btn).not.toBe('')
  }
})
