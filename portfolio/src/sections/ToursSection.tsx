import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { DoorOpen, Home, Trees, MapPin } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import FadeIn from '../components/FadeIn'

// Photos come from completed Spurgeon Appraisals reports. Owner, client, street address and value are left out.
const files = import.meta.glob('../assets/tours/*.webp', { eager: true, import: 'default' }) as Record<string, string>
const img = (n: string) => files[`../assets/tours/${n}.webp`]

type Area = 'Aerial' | 'Outside' | 'Inside'
// hot: where the doorway / path to the next scene is, as % of the photo. ar: photo width / height.
type Scene = { src: string; label: string; area: Area; hot: [number, number]; ar: number }
export type TourKey = 'residential' | 'farm' | 'commercial'
type Tour = { key: TourKey; type: string; place: string; headline: string; facts: string[]; note?: string; scenes: Scene[] }

const L = 4 / 3
const P = 3 / 4

const TOURS: Tour[] = [
  {
    key: 'residential',
    type: 'Residential',
    place: 'Canton, Missouri',
    headline: 'Ranch home on 2.64 acres',
    facts: ['Built 2010', '1,848 sq ft GLA', '3 bed · 2 bath + basement', '3-car garage + shop'],
    scenes: [
      { src: img('res-aerial'), label: 'The 2.64-acre site from above', area: 'Aerial', hot: [48, 48], ar: 800 / 1110 },
      { src: img('res-001-000'), label: 'Front of the house', area: 'Outside', hot: [56.5, 54], ar: L },
      { src: img('res-021-025'), label: 'Entry', area: 'Inside', hot: [72, 42], ar: P },
      { src: img('res-019-017'), label: 'Living room', area: 'Inside', hot: [24, 42], ar: L },
      { src: img('res-019-018'), label: 'Kitchen', area: 'Inside', hot: [90, 38], ar: L },
      { src: img('res-019-019'), label: 'Sunroom', area: 'Inside', hot: [88, 50], ar: L },
      { src: img('res-023-029'), label: 'Primary bath', area: 'Inside', hot: [37, 50], ar: L },
      { src: img('res-025-035'), label: 'Stairs to the basement', area: 'Inside', hot: [47, 22], ar: P },
      { src: img('res-025-036'), label: 'Basement family room', area: 'Inside', hot: [92, 30], ar: L },
      { src: img('res-026-039'), label: 'Basement wet bar', area: 'Inside', hot: [86, 30], ar: L },
      { src: img('res-027-043'), label: 'Steam shower', area: 'Inside', hot: [55, 45], ar: P },
      { src: img('res-028-046'), label: 'Walkout to the covered patio', area: 'Outside', hot: [46, 40], ar: L },
      { src: img('res-018-015'), label: 'Back of the house', area: 'Outside', hot: [92, 55], ar: L },
      { src: img('res-029-047'), label: '36×30 insulated shop', area: 'Outside', hot: [70, 52], ar: L },
      { src: img('res-030-052'), label: 'Inside the shop', area: 'Inside', hot: [72, 42], ar: L },
      { src: img('res-031-055'), label: 'Back acreage', area: 'Outside', hot: [50, 55], ar: L },
    ],
  },
  {
    key: 'farm',
    type: 'Farm',
    place: 'Howard County, Missouri',
    headline: 'Row-crop farm, 138.76 acres',
    facts: ['138.76 deeded acres', 'Primary use: cropland', 'Soil NCCPI 79.2', 'Highway frontage'],
    note: 'The farm report covers the land and outbuildings, so this tour walks the grounds.',
    scenes: [
      { src: img('farm-aerial'), label: 'Boundary & fields from above', area: 'Aerial', hot: [44, 11], ar: 1095 / 940 },
      { src: img('farm-14-2'), label: 'Highway frontage', area: 'Outside', hot: [62, 48], ar: 768 / 565 },
      { src: img('farm-14-1'), label: 'Field entrance', area: 'Outside', hot: [42, 46], ar: 768 / 565 },
      { src: img('farm-13-1'), label: 'Cropland', area: 'Outside', hot: [55, 52], ar: 768 / 565 },
      { src: img('farm-13-2'), label: 'Field edge & tree line', area: 'Outside', hot: [86, 40], ar: 768 / 565 },
      { src: img('farm-14-0'), label: 'Old farmstead', area: 'Outside', hot: [36, 48], ar: 768 / 565 },
      { src: img('farm-15-0'), label: 'Older house', area: 'Outside', hot: [58, 60], ar: 768 / 565 },
      { src: img('farm-15-1'), label: 'Old barn', area: 'Outside', hot: [52, 58], ar: 768 / 565 },
      { src: img('farm-15-2'), label: 'Steel machine shed', area: 'Outside', hot: [50, 55], ar: 768 / 565 },
    ],
  },
  {
    key: 'commercial',
    type: 'Commercial land',
    place: 'Kirksville, Missouri',
    headline: 'Multifamily development site',
    facts: ['1.056 acres · 46,000 sq ft', 'Vacant land', 'Zoned R-3 multifamily', 'Best use: multifamily'],
    note: 'This is a vacant development site, so the tour walks the lot and its street frontage.',
    scenes: [
      { src: img('land-aerial'), label: 'The parcel from above', area: 'Aerial', hot: [51, 56], ar: 1102 / 820 },
      { src: img('land-001-001'), label: 'The site from the street', area: 'Outside', hot: [52, 55], ar: 621 / 466 },
      { src: img('land-026-029'), label: 'Frontage & sidewalk', area: 'Outside', hot: [76, 55], ar: 621 / 466 },
      { src: img('land-026-030'), label: 'Corner view', area: 'Outside', hot: [62, 50], ar: 621 / 466 },
      { src: img('land-026-031'), label: 'Street frontage', area: 'Outside', hot: [50, 50], ar: 621 / 466 },
    ],
  },
]

const ENTER = 0.22 // share of a step spent arriving in the next scene
const DWELL = 0.58 // after this, the camera walks toward the doorway

// Where a point of the photo lands on screen when the photo covers the frame.
function toScreen(hot: [number, number], ar: number, W: number, H: number) {
  const s = Math.max(W / (ar * 1000), H / 1000)
  const w = ar * 1000 * s
  const h = 1000 * s
  return { x: (W - w) / 2 + (hot[0] / 100) * w, y: (H - h) / 2 + (hot[1] / 100) * h }
}

function Layer({ sc, k, n, progress, size, reduce }: { sc: Scene; k: number; n: number; progress: MotionValue<number>; size: { W: number; H: number }; reduce: boolean }) {
  const last = k === n - 1
  const l = useTransform(progress, (p) => p * n - k)
  const opacity = useTransform(l, (v) => (k === 0 ? 1 : Math.min(1, Math.max(0, (v + ENTER) / ENTER))))
  const scale = useTransform(l, (v) => {
    if (reduce) return 1
    if (v < 0) return 1 + (-v / ENTER) * 0.35 // arriving: starts close, settles back
    if (v < DWELL || last) return 1 + Math.min(v, 1) * 0.08
    const t = (v - DWELL) / (1 - DWELL)
    return 1 + DWELL * 0.08 + t * t * 2.6 // walking through the doorway
  })
  const visibility = useTransform(l, (v) => (v < -ENTER - 0.05 || (!last && v > 1.02) ? 'hidden' : 'visible'))
  const o = toScreen(sc.hot, sc.ar, size.W, size.H)
  return (
    <motion.div className="absolute inset-0 overflow-hidden" style={{ opacity, visibility, zIndex: k }}>
      <motion.img
        src={sc.src}
        alt={sc.label}
        loading={k < 3 ? 'eager' : 'lazy'}
        className="h-full w-full object-cover"
        style={{ scale, transformOrigin: `${o.x}px ${o.y}px`, willChange: 'transform' }}
      />
    </motion.div>
  )
}

const AREA_ICON = { Aerial: MapPin, Outside: Trees, Inside: Home }

export default function ToursSection() {
  const [key, setKey] = useState<TourKey>('residential')
  const tour = TOURS.find((t) => t.key === key)!
  const n = tour.scenes.length
  const trackRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ W: 1200, H: 800 })
  const [cur, setCur] = useState(0)
  const [showDoor, setShowDoor] = useState(true)
  const reduce = !!useReducedMotion()
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const v = p * n
    const k = Math.min(n - 1, Math.max(0, Math.floor(v)))
    setCur(k)
    setShowDoor(k < n - 1 && v - k < DWELL)
  })

  useLayoutEffect(() => {
    const el = frameRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setSize({ W: el.clientWidth, H: el.clientHeight }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [key])

  const open = (k: TourKey) => {
    setKey(k)
    setCur(0)
    requestAnimationFrame(() => trackRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }))
  }

  // The property grid above can open a specific tour.
  useEffect(() => {
    const on = (e: Event) => open((e as CustomEvent<TourKey>).detail)
    window.addEventListener('open-tour', on)
    return () => window.removeEventListener('open-tour', on)
  })

  const goTo = (i: number) => {
    const el = trackRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const span = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + ((i + 0.03) / n) * span, behavior: reduce ? 'auto' : 'smooth' })
  }

  const sc = tour.scenes[cur]
  const next = tour.scenes[cur + 1]
  const rawDoor = toScreen(sc.hot, sc.ar, size.W, size.H)
  // Keep the doorway clear of the titles, the facts and the mini map.
  const door = {
    x: Math.min(size.W - (size.W >= 1024 ? 320 : 110), Math.max(110, rawDoor.x)),
    y: Math.min(size.H - 230, Math.max(190, rawDoor.y)),
  }
  const AreaIcon = AREA_ICON[sc.area]

  return (
    <section id="tours" className="relative bg-[#01170C]">
      <div className="mx-auto max-w-[1400px] px-5 pt-24 sm:px-10 md:pt-32">
        <FadeIn as="h2" y={40} className="max-w-[16ch] font-light leading-[1] tracking-tight" style={{ fontSize: 'clamp(2.4rem, 6vw, 6rem)' }}>
          Walk <span className="font-serif italic text-[#C0D849]">through</span> the property.
        </FadeIn>
        <FadeIn delay={0.1} as="p" className="mt-6 max-w-[52ch] text-[#9FB6A9]">
          Start outside, then scroll, or tap the glowing doorway, to step inside and move from room to room.
        </FadeIn>
        <FadeIn delay={0.2} className="mt-8 flex flex-wrap gap-2">
          {TOURS.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={t.key === key}
              onClick={() => open(t.key)}
              className={`rounded-xl border px-4 py-2 text-sm transition-colors ${t.key === key ? 'border-[#C0D849] bg-[#C0D849] text-[#01170C]' : 'border-[#C0D849]/40 text-[#C0D849] hover:bg-[#C0D849]/10'}`}
            >
              {t.type}
            </button>
          ))}
        </FadeIn>
      </div>

      <div ref={trackRef} id="tour-track" className="mt-10" style={{ height: `${n * 85 + 100}vh` }}>
        <div ref={frameRef} key={key} className="sticky top-0 h-screen overflow-hidden">
          {tour.scenes.map((s, k) => (
            <Layer key={s.src} sc={s} k={k} n={n} progress={scrollYProgress} size={size} reduce={reduce} />
          ))}

          <div className="pointer-events-none absolute inset-0 z-[100]" style={{ background: 'linear-gradient(180deg, rgba(1,23,12,.85) 0%, rgba(1,23,12,0) 28%, rgba(1,23,12,0) 62%, rgba(1,23,12,.9) 100%)' }} />

          {/* Doorway to the next scene: scroll walks through it, a tap jumps there. */}
          <AnimatePresence>
            {showDoor && next && (
              <motion.button
                key={cur}
                type="button"
                onClick={() => goTo(cur + 1)}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 0.35 }}
                className="absolute z-[102] flex flex-col items-center gap-2"
                style={{ left: door.x, top: door.y, x: '-50%', y: '-28px' }}
                aria-label={`Go to ${next.label}`}
              >
                <span className="relative grid h-14 w-14 place-items-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#C0D849]/50" />
                  <span className="relative grid h-11 w-11 place-items-center rounded-full border-2 border-white bg-[#C0D849] text-[#01170C] shadow-[0_0_30px_rgba(192,216,73,0.8)]">
                    <DoorOpen size={20} />
                  </span>
                </span>
                <span className="whitespace-nowrap rounded-lg bg-[#01170C]/80 px-3 py-1.5 text-sm text-white backdrop-blur">
                  {next.area === 'Inside' && sc.area !== 'Inside' ? 'Step inside: ' : 'Go to '}
                  {next.label}
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          <div className="absolute inset-x-0 top-0 z-[101] px-5 pt-24 sm:px-10">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C0D849]">{tour.type} · {tour.place}</div>
            <h3 className="mt-1 font-light leading-none tracking-tight" style={{ fontSize: 'clamp(1.6rem, 3.6vw, 3.2rem)' }}>{tour.headline}</h3>
          </div>

          {/* Mini map of the walk */}
          <ol className="absolute right-5 top-1/2 z-[101] hidden max-h-[60vh] -translate-y-1/2 flex-col gap-0.5 overflow-y-auto rounded-2xl border border-white/10 bg-[#01170C]/70 p-2 backdrop-blur lg:flex">
            {tour.scenes.map((s, i) => {
              const Icon = AREA_ICON[s.area]
              return (
                <li key={s.src}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors ${i === cur ? 'bg-[#C0D849] text-[#01170C]' : i < cur ? 'text-[#C9D6CE]' : 'text-[#6F8578] hover:text-[#C9D6CE]'}`}
                  >
                    <Icon size={13} className="shrink-0" />
                    {s.label}
                  </button>
                </li>
              )
            })}
          </ol>

          <div className="absolute inset-x-0 bottom-0 z-[101] flex flex-wrap items-end justify-between gap-4 px-5 pb-8 sm:px-10">
            <div className="min-w-0">
              <motion.div key={sc.area} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#C0D849]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#C0D849]">
                <AreaIcon size={13} /> {sc.area}
              </motion.div>
              <motion.div key={cur} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-light" style={{ fontSize: 'clamp(1.3rem, 2.6vw, 2.2rem)' }}>
                {sc.label}
              </motion.div>
              <div className="mt-1 max-w-[60ch] text-xs tabular-nums text-[#9FB6A9]">
                {String(cur + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
                {tour.note && cur === 0 ? ` · ${tour.note}` : ''}
              </div>
            </div>
            <ul className="flex max-w-[520px] flex-wrap gap-2 sm:justify-end">
              {tour.facts.map((f) => (
                <li key={f} className="rounded-lg border border-[#C0D849]/30 bg-[#01170C]/60 px-3 py-1.5 text-xs text-[#E4EFA0] backdrop-blur sm:text-sm">{f}</li>
              ))}
            </ul>
          </div>
          <div className="absolute inset-x-0 bottom-0 z-[101] h-[3px] bg-white/10">
            <motion.div className="h-full bg-[#C0D849]" style={{ width: bar }} />
          </div>
        </div>
      </div>
    </section>
  )
}
