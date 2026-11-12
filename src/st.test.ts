import { expect, test } from 'vitest'
import { st } from './st'

test('parses a CSS declaration string into a React style object', () => {
  expect(st('aspect-ratio: 16 / 10; border-top: 1px solid #3a3a3a; left: 50%')).toEqual({
    aspectRatio: '16 / 10',
    borderTop: '1px solid #3a3a3a',
    left: '50%',
  })
})

test('keeps colons inside values and ignores empty declarations', () => {
  expect(st('background-image: url(a:b);;')).toEqual({ backgroundImage: 'url(a:b)' })
})
