import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef, useState } from 'react'
import FadeIn from '../components/FadeIn'
import { scrollToId } from '../components/Buttons'

// Photos come from completed Spurgeon Appraisals reports. Owner, client, street address and value are left out.
const files = import.meta.glob('../assets/tours/*.webp', { eager: true, import: 'default' }) as Record<string, string>
const img = (n: string) => files[`../assets/tours/${n}.webp`]

type Frame = { src: string; label: string }
type Tour = { id: string; type: string; place: string; headline: string; facts: string[]; frames: Frame[] }

const TOURS: Tour[] = [
  {
    id: 'tour-residential',
    type: 'Residential',
    place: 'Canton, Missouri',
    headline: 'Ranch home on 2.64 acres',
    facts: ['Built 2010', '1,848 sq ft GLA', '3 bed · 2 bath + basement', '3-car garage + shop'],
    frames: [
      { src: img('res-aerial'), label: 'From above · the 2.64-acre site' },
      { src: img('res-001-000'), label: 'Front exterior' },
      { src: img('res-016-009'), label: 'Three-car garage' },
      { src: img('res-019-017'), label: 'Living room' },
      { src: img('res-019-018'), label: 'Kitchen & island' },
      { src: img('res-019-019'), label: 'Sunroom' },
      { src: img('res-023-029'), label: 'Primary bath' },
      { src: img('res-025-036'), label: 'Finished basement' },
      { src: img('res-026-039'), label: 'Basement wet bar' },
      { src: img('res-027-043'), label: 'Steam shower' },
      { src: img('res-018-015'), label: 'Rear & walkout' },
      { src: img('res-017-012'), label: 'Back deck' },
      { src: img('res-028-046'), label: 'Covered patio' },
      { src: img('res-029-047'), label: '36×30 insulated shop' },
      { src: img('res-030-052'), label: 'Shop interior' },
      { src: img('res-031-055'), label: 'Back acreage' },
    ],
  },
  {
    id: 'tour-farm',
    type: 'Farm',
    place: 'Howard County, Missouri',
    headline: 'Row-crop farm, 138.76 acres',
    facts: ['138.76 deeded acres', 'Primary use: cropland', 'Soil NCCPI 79.2', 'Highway frontage'],
    frames: [
      { src: img('farm-aerial'), label: 'From above · boundary & fields' },
      { src: img('farm-14-2'), label: 'Highway frontage' },
      { src: img('farm-14-1'), label: 'Field entrance' },
      { src: img('farm-13-1'), label: 'Cropland · corn' },
      { src: img('farm-13-2'), label: 'Field edge & tree line' },
      { src: img('farm-13-0'), label: 'Farmstead yard' },
      { src: img('farm-14-0'), label: 'Old farmstead' },
      { src: img('farm-15-0'), label: 'Older house' },
      { src: img('farm-15-1'), label: 'Old barn' },
      { src: img('farm-15-2'), label: 'Steel machine shed' },
    ],
  },
  {
    id: 'tour-commercial',
    type: 'Commercial land',
    place: 'Kirksville, Missouri',
    headline: 'Multifamily development site',
    facts: ['1.056 acres · 46,000 sq ft', 'Vacant', 'Zoned R-3 multifamily', 'Best use: multifamily'],
    frames: [
      { src: img('land-aerial'), label: 'From above · parcel in red' },
      { src: img('land-001-001'), label: 'The site from the street' },
      { src: img('land-026-029'), label: 'Frontage & sidewalk' },
      { src: img('land-026-030'), label: 'Corner view' },
      { src: img('land-026-031'), label: 'Street frontage' },
    ],
  },
]

const GAP = 1100 // px between photos along the flight path
// Lateral slots so photos pass on alternating sides, like flying through a gallery.
const SLOTS = [
  { x: 0, y: 0, r: 0 },
  { x: -34, y: -4, r: 16 },
  { x: 32, y: 6, r: -16 },
  { x: -28, y: 8, r: 12 },
  { x: 34, y: -6, r: -14 },
  { x: -36, y: 2, r: 18 },
  { x: 30, y: -2, r: -12 },
]

function Card({ f, k, travel, reduce }: { f: Frame; k: number; travel: MotionValue<number>; reduce: boolean }) {
  const slot = k === 0 ? SLOTS[0] : SLOTS[1 + ((k - 1) % (SLOTS.length - 1))]
  const z = useTransform(travel, (t) => -k * GAP + t)
  const transform = useTransform(z, (zz) => {
    // Near the start of its approach the photo slides toward its side lane.
    const lane = Math.min(1, Math.max(0, (zz + 3 * GAP) / (2.5 * GAP)))
    const x = slot.x * (0.35 + 0.65 * lane)
    return `translate(-50%, -50%) translate3d(${x}vw, ${slot.y}vh, ${zz}px) rotateY(${slot.r * lane}deg)`
  })
  const opacity = useTransform(z, (zz) => {
    const fadeIn = Math.min(1, Math.max(0, (zz + 4.2 * GAP) / (1.4 * GAP)))
    const fadeOut = zz > 380 ? Math.max(0, 1 - (zz - 380) / 320) : 1
    return fadeIn * fadeOut
  })
  const visibility = useTransform(z, (zz) => (zz < -4.4 * GAP || zz > 720 ? 'hidden' : 'visible'))
  const flat = useTransform(z, (zz) => `translate(-50%, -50%) translate3d(0,0,${Math.min(zz, 0)}px)`)
  const isAerial = k === 0
  return (
    <motion.figure
      className={`absolute left-1/2 top-1/2 overflow-hidden rounded-2xl border border-white/15 bg-[#022C18] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ${
        isAerial ? 'w-[min(78vw,980px)]' : 'w-[min(56vw,620px)]'
      } aspect-[4/3]`}
      style={{ transform: reduce ? flat : transform, opacity, visibility }}
    >
      <img src={f.src} alt={f.label} loading="lazy" className="h-full w-full object-cover" />
      <figcaption className="absolute bottom-2 left-3 text-xs font-light text-white/85 drop-shadow">{f.label}</figcaption>
    </motion.figure>
  )
}

function FlyThrough({ tour }: { tour: Tour }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = !!useReducedMotion()
  const n = tour.frames.length
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const total = (n - 1) * GAP + 650
  const travel = useTransform(scrollYProgress, [0, 1], [0, total])
  const [cur, setCur] = useState(0)
  useMotionValueEvent(travel, 'change', (t) => setCur(Math.min(n - 1, Math.max(0, Math.round((t - 200) / GAP)))))
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div id={tour.id} ref={ref} style={{ height: `${n * 60 + 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ perspective: '900px', perspectiveOrigin: '50% 50%' }}>
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(4,105,56,0.35),transparent_60%)]" />
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {tour.frames.map((f, k) => (
            <Card key={f.src} f={f} k={k} travel={travel} reduce={reduce} />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-[#01170C] via-[#01170C]/70 to-transparent px-5 pb-16 pt-24 sm:px-10">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-[#C0D849]">{tour.type} · {tour.place}</div>
          <h3 className="mt-1 font-light leading-none tracking-tight" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.6rem)' }}>{tour.headline}</h3>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-end justify-between gap-4 bg-gradient-to-t from-[#01170C] via-[#01170C]/70 to-transparent px-5 pb-8 pt-16 sm:px-10">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.2em] text-[#9FB6A9]">{String(cur + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</div>
            <motion.div key={cur} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-light" style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.8rem)' }}>
              {tour.frames[cur].label}
            </motion.div>
          </div>
          <ul className="flex max-w-[560px] flex-wrap gap-2 sm:justify-end">
            {tour.facts.map((f) => (
              <li key={f} className="rounded-lg border border-[#C0D849]/35 bg-[#01170C]/50 px-3 py-1.5 text-xs text-[#C0D849] backdrop-blur sm:text-sm">{f}</li>
            ))}
          </ul>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 h-[3px] bg-white/10">
          <motion.div className="h-full bg-gradient-to-r from-[#C0D849] via-[#7FBF8E] to-[#046938]" style={{ width: bar }} />
        </div>
      </div>
    </div>
  )
}

export default function ToursSection() {
  return (
    <section id="tours" className="relative bg-[#01170C]">
      <div className="mx-auto max-w-[1400px] px-5 pt-24 sm:px-10 md:pt-32">
        <FadeIn as="h2" y={40} className="max-w-[16ch] font-light leading-[1] tracking-tight" style={{ fontSize: 'clamp(2.4rem, 6vw, 6rem)' }}>
          Step <span className="font-serif italic text-[#C0D849]">inside</span> the properties.
        </FadeIn>
        <FadeIn delay={0.1} as="p" className="mt-6 max-w-[48ch] text-[#9FB6A9]">
          Scroll to fly in from the aerial view and move through each property, room by room and field by field.
        </FadeIn>
        <FadeIn delay={0.2} className="mt-8 flex flex-wrap gap-2">
          {TOURS.map((t) => (
            <button key={t.id} type="button" onClick={() => scrollToId(t.id)} className="rounded-xl border border-[#C0D849]/40 px-4 py-2 text-sm text-[#C0D849] transition-colors hover:bg-[#C0D849]/10">
              {t.type}
            </button>
          ))}
        </FadeIn>
      </div>
      {TOURS.map((t) => (
        <FlyThrough key={t.id} tour={t} />
      ))}
    </section>
  )
}
