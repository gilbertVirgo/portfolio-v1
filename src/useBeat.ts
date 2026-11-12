import { useEffect, useRef, useState } from 'react'

export function useBeat(ms = 1300) {
  const ref = useRef<HTMLDivElement>(null)
  const [beat, setBeat] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let id: ReturnType<typeof setInterval> | undefined
    const io = new IntersectionObserver(([e]) => {
      clearInterval(id)
      id = e.isIntersecting ? setInterval(() => setBeat((b) => b + 1), ms) : undefined
    })
    if (ref.current) io.observe(ref.current)
    return () => { clearInterval(id); io.disconnect() }
  }, [ms])
  return [ref, beat] as const
}
