import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import FadeIn from '../components/FadeIn'
import { scrollToId } from '../components/Buttons'

const files = import.meta.glob('../assets/tours/*.webp', { eager: true, import: 'default' }) as Record<string, string>
const img = (n: string) => files[`../assets/tours/${n}.webp`]

const CARDS = [
  { src: img('res-001-000'), type: 'Residential', label: 'Ranch home · Canton, MO', span: 'md:col-span-2 md:row-span-2', tour: 'tour-residential' },
  { src: img('farm-aerial'), type: 'Farm', label: '138.76 acres · Howard Co., MO', span: '', tour: 'tour-farm' },
  { src: img('res-019-018'), type: 'Residential', label: 'Kitchen', span: '', tour: 'tour-residential' },
  { src: img('farm-13-1'), type: 'Farm', label: 'Row-crop cropland', span: '', tour: 'tour-farm' },
  { src: img('land-aerial'), type: 'Commercial land', label: '1.056 ac R-3 site · Kirksville', span: '', tour: 'tour-commercial' },
  { src: img('farm-15-1'), type: 'Farm', label: 'Older outbuildings', span: '', tour: 'tour-farm' },
  { src: img('land-026-030'), type: 'Commercial land', label: 'Street frontage', span: 'md:col-span-2', tour: 'tour-commercial' },
  { src: img('res-026-039'), type: 'Residential', label: 'Finished basement', span: '', tour: 'tour-residential' },
]

export default function WorkSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const lift = useTransform(scrollYProgress, [0, 1], [60, -60])
  return (
    <section id="work" ref={ref} className="relative bg-[#01170C] px-4 py-24 sm:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <FadeIn as="h2" y={40} className="max-w-[18ch] font-light leading-[1] tracking-tight" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.8rem)' }}>
            Real properties. <span className="font-serif italic text-[#C0D849]">Every</span> type.
          </FadeIn>
          <FadeIn delay={0.1} as="p" className="max-w-[38ch] text-[#9FB6A9]">
            Photos from appraisals I coordinated, from intake to delivery. Tap any photo to tour the property.
          </FadeIn>
        </div>
        <motion.div style={{ y: lift }} className="mt-14 grid auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[240px] sm:gap-4 md:grid-cols-4">
          {CARDS.map((c, i) => (
            <FadeIn key={c.src + i} delay={(i % 4) * 0.08} y={60} className={`${c.span} min-w-0`}>
              <button type="button" onClick={() => scrollToId(c.tour)} className="group relative block h-full w-full overflow-hidden rounded-2xl border border-white/10 text-left">
                <img src={c.src} alt={c.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                <span className="absolute inset-0 bg-gradient-to-t from-[#01170C]/85 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 right-3">
                  <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-[#C0D849]">{c.type}</span>
                  <span className="block text-sm font-light text-white sm:text-base">{c.label}</span>
                </span>
              </button>
            </FadeIn>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
