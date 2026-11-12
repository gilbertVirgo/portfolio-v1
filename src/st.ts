import type { CSSProperties } from 'react'

// Lets the artboard's inline style strings be pasted into JSX unchanged.
export function st(css: string): CSSProperties {
  const out: Record<string, string> = {}
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const prop = decl.slice(0, i).trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    if (prop) out[prop] = decl.slice(i + 1).trim()
  }
  return out as CSSProperties
}
