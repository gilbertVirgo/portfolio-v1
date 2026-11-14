import { useEffect, useRef, useState } from 'react'

// ms: one duration for every beat, or a per-beat list (beat t lasts ms[t % length]).
export function useBeat(ms: number | readonly number[] = 1300) {
  const ref = useRef<HTMLDivElement>(null)
  const [beat, setBeat] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const dur = (b: number) => (typeof ms === 'number' ? ms : ms[b % ms.length])
    let b = 0
    let id: ReturnType<typeof setTimeout> | undefined
    const next = () => { id = setTimeout(() => { setBeat(++b); next() }, dur(b)) }
    const io = new IntersectionObserver((entries) => {
      clearTimeout(id)
      if (entries[entries.length - 1].isIntersecting) next()
    })
    if (ref.current) io.observe(ref.current)
    return () => { clearTimeout(id); io.disconnect() }
  }, [ms])
  return [ref, beat] as const
}
