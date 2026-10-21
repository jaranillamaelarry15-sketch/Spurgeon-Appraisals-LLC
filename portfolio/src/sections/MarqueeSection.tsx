import { useEffect, useRef, useState } from 'react'

const files = import.meta.glob('../assets/marquee/*.webp', { eager: true, import: 'default' }) as Record<string, string>
const IMAGES = Object.keys(files).sort().map((k) => files[k])

function Row({ images, transform }: { images: string[]; transform: string }) {
  return (
    <div className="flex gap-3" style={{ transform, willChange: 'transform' }}>
      {[...images, ...images, ...images].map((src, i) => (
        <img key={i} src={src} alt="" loading="lazy" className="h-[270px] w-[420px] max-w-none shrink-0 rounded-2xl object-cover" />
      ))}
    </div>
  )
}

export default function MarqueeSection() {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY
      setOffset((window.scrollY - top + window.innerHeight) * 0.3)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const half = Math.ceil(IMAGES.length / 2)
  return (
    <section ref={ref} className="flex flex-col gap-3 overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40" aria-label="Work gallery">
      <Row images={IMAGES.slice(0, half)} transform={`translateX(${offset - 200 - half * 432}px)`} />
      <Row images={IMAGES.slice(half)} transform={`translateX(${-(offset - 200)}px)`} />
    </section>
  )
}
