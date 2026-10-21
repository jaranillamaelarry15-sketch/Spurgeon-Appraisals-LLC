import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef, useState } from 'react'
import FadeIn from '../components/FadeIn'
import { scrollToId } from '../components/Buttons'

// Photos come from completed Spurgeon Appraisals reports. Owner, client, address and value are left out on purpose.
const files = import.meta.glob('../assets/tours/*.webp', { eager: true, import: 'default' }) as Record<string, string>
const img = (name: string) => files[`../assets/tours/${name}.webp`]

type Frame = { src: string; label: string; origin?: string; aerial?: boolean }
type Tour = { id: string; type: string; place: string; headline: string; facts: string[]; frames: Frame[] }

const TOURS: Tour[] = [
  {
    id: 'tour-residential',
    type: 'Residential',
    place: 'Canton, Missouri',
    headline: 'Ranch home on 2.64 acres',
    facts: ['Built 2010', '1,848 sq ft GLA', '3 bed · 2 bath + finished basement', '3-car garage + 36×30 shop', 'Lender loan · Form 1004'],
    frames: [
      { src: img('res-aerial'), label: 'From above · the 2.64-acre site', origin: '50% 46%', aerial: true },
      { src: img('res-001-000'), label: 'Front exterior', origin: '55% 50%' },
      { src: img('res-016-009'), label: 'Three-car garage side', origin: '45% 55%' },
      { src: img('res-018-015'), label: 'Rear elevation & walkout', origin: '50% 45%' },
      { src: img('res-017-012'), label: 'Back deck', origin: '60% 50%' },
      { src: img('res-019-017'), label: 'Living room', origin: '50% 50%' },
      { src: img('res-019-018'), label: 'Kitchen & island', origin: '45% 60%' },
      { src: img('res-019-019'), label: 'Sunroom addition', origin: '50% 40%' },
      { src: img('res-023-029'), label: 'Primary bath · heated tile', origin: '50% 55%' },
      { src: img('res-023-030'), label: 'Double vanity', origin: '50% 50%' },
      { src: img('res-025-036'), label: 'Finished basement', origin: '50% 50%' },
      { src: img('res-026-039'), label: 'Basement wet bar', origin: '50% 55%' },
      { src: img('res-027-043'), label: 'Basement steam shower', origin: '50% 45%' },
      { src: img('res-028-046'), label: 'Covered patio', origin: '50% 55%' },
      { src: img('res-029-047'), label: '36×30 insulated shop', origin: '50% 50%' },
      { src: img('res-030-052'), label: 'Shop interior with HVAC', origin: '50% 50%' },
      { src: img('res-031-055'), label: 'Back acreage', origin: '50% 60%' },
    ],
  },
  {
    id: 'tour-farm',
    type: 'Farm',
    place: 'Howard County, Missouri',
    headline: 'Row-crop farm, 138.76 acres',
    facts: ['138.76 deeded acres', 'Primary use: cropland', 'Soil NCCPI 79.2', 'Highway frontage', 'Estate · UAAR farm report'],
    frames: [
      { src: img('farm-aerial'), label: 'From above · boundary & fields', origin: '50% 45%', aerial: true },
      { src: img('farm-14-2'), label: 'Highway frontage', origin: '40% 55%' },
      { src: img('farm-14-1'), label: 'Field entrance', origin: '55% 55%' },
      { src: img('farm-13-0'), label: 'Farmstead yard', origin: '50% 55%' },
      { src: img('farm-13-1'), label: 'Cropland · corn', origin: '60% 55%' },
      { src: img('farm-13-2'), label: 'Field edge & tree line', origin: '45% 55%' },
      { src: img('farm-14-0'), label: 'Old farmstead under the trees', origin: '35% 50%' },
      { src: img('farm-15-0'), label: 'Older house', origin: '45% 55%' },
      { src: img('farm-15-1'), label: 'Old barn', origin: '45% 55%' },
      { src: img('farm-15-2'), label: 'Steel machine shed', origin: '55% 55%' },
    ],
  },
  {
    id: 'tour-commercial',
    type: 'Commercial land',
    place: 'Kirksville, Missouri',
    headline: 'Multifamily development site',
    facts: ['1.056 acres · 46,000 sq ft', 'Vacant land', 'Zoned R-3 multifamily', 'Best use: multifamily site', 'Purchase · narrative report'],
    frames: [
      { src: img('land-aerial'), label: 'From above · parcel outlined in red', origin: '42% 52%', aerial: true },
      { src: img('land-001-001'), label: 'The site from the street', origin: '50% 60%' },
      { src: img('land-026-029'), label: 'Frontage & sidewalk', origin: '45% 55%' },
      { src: img('land-026-030'), label: 'Corner view', origin: '55% 55%' },
      { src: img('land-026-031'), label: 'Street frontage', origin: '50% 55%' },
    ],
  },
]

const ENTER = 0.3

// One photo layer. Each frame arrives zoomed in and settles (zoom out), then pushes forward (zoom in) as the next one fades over it.
function Layer({ f, k, n, progress, reduce }: { f: Frame; k: number; n: number; progress: MotionValue<number>; reduce: boolean }) {
  const local = useTransform(progress, (p) => Math.max(-ENTER - 0.1, Math.min(1.2, p * n - k)))
  const opacity = useTransform(local, (l) => (k === 0 ? 1 : Math.max(0, Math.min(1, (l + ENTER) / ENTER))))
  const push = f.aerial ? 2.6 : 0.38
  const scale = useTransform(local, (l) => {
    if (reduce) return 1
    if (l < 0) return 1 + (-l / ENTER) * 0.22
    return 1 + Math.min(l, 1) * push
  })
  const visibility = useTransform(local, (l) => (l < -ENTER - 0.05 || l > 1.15 ? 'hidden' : 'visible'))
  return (
    <motion.div className="absolute inset-0" style={{ opacity, visibility, zIndex: k }}>
      <motion.img
        src={f.src}
        alt={f.label}
        loading={k < 2 ? 'eager' : 'lazy'}
        className="h-full w-full object-cover"
        style={{ scale, transformOrigin: f.origin ?? '50% 50%', willChange: 'transform' }}
      />
    </motion.div>
  )
}

function PropertyTour({ tour }: { tour: Tour }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = !!useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const n = tour.frames.length
  const [cur, setCur] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (p) => setCur(Math.min(n - 1, Math.max(0, Math.round(p * n - 0.35)))))
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div id={tour.id} ref={ref} style={{ height: `${n * 70 + 70}vh` }}>
      <div className="sticky top-0 flex h-screen items-center px-3 py-3 sm:px-6 sm:py-6 md:px-10">
        <div className="relative h-full w-full overflow-hidden rounded-[28px] border-2 border-[#D7E2EA]/20 bg-[#16181c] sm:rounded-[40px] md:rounded-[50px]">
          {tour.frames.map((f, k) => (
            <Layer key={f.src} f={f} k={k} n={n} progress={scrollYProgress} reduce={reduce} />
          ))}

          {/* Shading so the text reads on any photo */}
          <div className="pointer-events-none absolute inset-0 z-[100]" style={{ background: 'linear-gradient(180deg, rgba(12,12,12,.72) 0%, rgba(12,12,12,0) 32%, rgba(12,12,12,0) 58%, rgba(12,12,12,.85) 100%)' }} />

          <div className="absolute left-5 right-5 top-5 z-[101] flex flex-wrap items-start justify-between gap-3 sm:left-8 sm:right-8 sm:top-8">
            <div className="min-w-0">
              <div className="text-xs font-medium uppercase tracking-widest text-[#C0D849] sm:text-sm">{tour.type} · {tour.place}</div>
              <h3 className="font-black uppercase leading-none text-white" style={{ fontSize: 'clamp(1.6rem, 4.6vw, 4rem)' }}>{tour.headline}</h3>
            </div>
            <div className="rounded-full bg-[#0C0C0C]/70 px-4 py-2 text-sm font-medium tabular-nums text-[#D7E2EA] backdrop-blur">
              {String(cur + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
            </div>
          </div>

          <div className="absolute bottom-5 left-5 right-5 z-[101] flex flex-wrap items-end justify-between gap-4 sm:bottom-8 sm:left-8 sm:right-8">
            <motion.div key={cur} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="min-w-0">
              <div className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/70">Now viewing</div>
              <div className="font-medium uppercase text-white" style={{ fontSize: 'clamp(1.1rem, 2.4vw, 2rem)' }}>{tour.frames[cur].label}</div>
            </motion.div>
            <ul className="hidden max-w-[520px] flex-wrap justify-end gap-2 md:flex">
              {tour.facts.map((f) => (
                <li key={f} className="rounded-full border border-[#D7E2EA]/40 bg-[#0C0C0C]/55 px-3 py-1.5 text-sm font-light text-[#D7E2EA] backdrop-blur">{f}</li>
              ))}
            </ul>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-[101] h-1 bg-white/10">
            <motion.div className="h-full bg-[#C0D849]" style={{ width: bar }} />
          </div>
        </div>
      </div>
      {/* Facts for phones, where the chips are hidden over the photo */}
      <ul className="-mt-2 flex flex-wrap gap-2 px-4 pb-6 md:hidden">
        {tour.facts.map((f) => (
          <li key={f} className="rounded-full border border-[#D7E2EA]/30 px-3 py-1 text-xs font-light text-[#D7E2EA]">{f}</li>
        ))}
      </ul>
    </div>
  )
}

export default function PropertyToursSection() {
  return (
    <section id="tours" className="relative bg-[#0C0C0C] pt-24 md:pt-32">
      <div className="px-5 sm:px-8 md:px-10">
        <FadeIn as="h2" y={40} className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 11vw, 150px)' }}>
          Property Tours
        </FadeIn>
        <FadeIn delay={0.15} className="mx-auto mt-6 max-w-[620px] text-center font-light leading-relaxed text-[#D7E2EA]" style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)' }}>
          Real photos from three appraisals I coordinated. Scroll to fly in from the aerial view and walk through each property, room by room.
        </FadeIn>
        <FadeIn delay={0.25} className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
          {TOURS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => scrollToId(t.id)}
              className="rounded-full border-2 border-[#D7E2EA]/40 px-6 py-2.5 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-200 hover:border-[#D7E2EA] hover:bg-[#D7E2EA]/10 sm:text-base"
            >
              {t.type}
            </button>
          ))}
        </FadeIn>
      </div>
      <div className="mt-10">
        {TOURS.map((t) => (
          <PropertyTour key={t.id} tour={t} />
        ))}
      </div>
    </section>
  )
}
