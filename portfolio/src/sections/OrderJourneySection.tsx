import { motion, useAnimationControls, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import FadeIn from '../components/FadeIn'
import Workspace, { H, RECTS, W } from '../workspace/Workspace'
import { ORDERS, STEPS, type PayMethod, type PropertyKey } from '../workspace/data'
import houseImg from '../assets/obj_house.webp'
import barnImg from '../assets/obj_barn.webp'
import officeImg from '../assets/obj_office.webp'

const KINDS: { key: PropertyKey; img: string }[] = [
  { key: 'residential', img: houseImg },
  { key: 'farm', img: barnImg },
  { key: 'commercial', img: officeImg },
]

// Camera that frames a region of the 1280×800 workspace.
function camera(focus: keyof typeof RECTS) {
  const r = RECTS[focus]
  if (focus === 'all') return { scale: 1, x: 0, y: 0 }
  const s = Math.min(1.85, Math.min(W / r.w, H / r.h) * 0.94)
  const clamp = (v: number, min: number) => Math.min(0, Math.max(min, v))
  return {
    scale: s,
    x: clamp(W / 2 - (r.x + r.w / 2) * s, W - W * s),
    y: clamp(H / 2 - (r.y + r.h / 2) * s, H - H * s),
  }
}

export default function OrderJourneySection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState(0.5)
  const [step, setStep] = useState(0)
  const [kind, setKind] = useState<PropertyKey>('residential')
  const [pay, setPay] = useState<PayMethod>(ORDERS.residential.defaultPay)
  const [paid, setPaid] = useState(false)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setStep(Math.min(STEPS.length - 1, Math.max(0, Math.floor(p * STEPS.length))))
  })

  useLayoutEffect(() => {
    const el = frameRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setFit(el.clientWidth / W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    setPay(ORDERS[kind].defaultPay)
    setPaid(false)
  }, [kind])

  // On the last step the client pays a moment after the invoice appears.
  useEffect(() => {
    if (step !== STEPS.length - 1) return
    const t = setTimeout(() => setPaid(true), 2600)
    return () => clearTimeout(t)
  }, [step, kind, pay])
  useEffect(() => {
    if (step < STEPS.length - 1) setPaid(false)
  }, [step])

  const goTo = (i: number) => {
    const el = trackRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const span = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + ((i + 0.5) / STEPS.length) * span, behavior: reduce ? 'auto' : 'smooth' })
  }

  const s = STEPS[step]
  const paidView = paid && step === STEPS.length - 1
  const controls = useAnimationControls()
  // Each step pulls back to show the whole screen, then zooms into the part that matters.
  useEffect(() => {
    // Once the client has paid, pull all the way back to show the closed order.
    const cam = camera(paidView ? 'all' : s.focus)
    if (reduce) {
      controls.set(cam)
      return
    }
    const out = 0.86
    controls.start({
      scale: [null, out, cam.scale],
      x: [null, (W - W * out) / 2, cam.x],
      y: [null, (H - H * out) / 2, cam.y],
      transition: { duration: 1.5, times: [0, 0.38, 1], ease: [0.65, 0, 0.35, 1] },
    })
  }, [step, kind, reduce, controls, s.focus, paidView])

  return (
    <section id="journey" className="relative bg-[#0A0810]">
      <div className="px-5 pt-24 sm:px-8 md:px-10 md:pt-32">
        <FadeIn as="h2" className="text-center font-light leading-none tracking-tight" style={{ fontSize: 'clamp(2.4rem, 6vw, 6rem)' }}>
          Watch one order, <span className="font-serif italic text-[#FFD3B0]">start to paid</span>.
        </FadeIn>
        <FadeIn delay={0.15} className="mx-auto mt-6 max-w-[620px] text-center font-light leading-relaxed text-[#D7E2EA]" style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)' }}>
          The Spurgeon Appraisals workspace I built and run, replayed with sample orders. Pick a property type, then scroll to follow one order from intake until the client pays.
        </FadeIn>
        <FadeIn delay={0.25} className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3 sm:gap-4">
          {KINDS.map((k) => (
            <button
              key={k.key}
              type="button"
              onClick={() => setKind(k.key)}
              aria-pressed={kind === k.key}
              className={`group flex items-center gap-3 rounded-xl border py-1.5 pl-1.5 pr-5 text-sm transition-colors duration-200 sm:text-base ${
                kind === k.key ? 'border-[#FFD3B0] bg-[#FFD3B0] text-[#2A1A24]' : 'border-[#D7E2EA]/40 text-[#D7E2EA] hover:border-[#D7E2EA]'
              }`}
            >
              <img src={k.img} alt="" className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12" />
              {ORDERS[k.key].label}
            </button>
          ))}
        </FadeIn>
      </div>

      <div ref={trackRef} style={{ height: `${STEPS.length * 75 + 100}vh` }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center gap-5 px-4 py-6 sm:px-8 md:px-10 lg:flex-row lg:items-center lg:gap-10">
          {/* Step list */}
          <ol className="order-2 hidden w-[300px] shrink-0 flex-col gap-1 lg:order-1 lg:flex">
            {STEPS.map((st, i) => (
              <li key={st.key}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className={`flex w-full items-baseline gap-3 rounded-2xl px-4 py-2.5 text-left transition-colors duration-300 ${i === step ? 'bg-[#D7E2EA]/10' : 'hover:bg-[#D7E2EA]/5'}`}
                >
                  <span className={`font-light tabular-nums transition-colors ${i === step ? 'text-[#C0D849]' : 'text-[#646973]'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={`uppercase tracking-wider transition-colors ${i === step ? 'text-[#D7E2EA]' : 'text-[#646973]'}`}>{st.title}</span>
                </button>
                {i === step && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden px-4 pb-2 pl-[3.1rem] text-sm font-light leading-relaxed text-[#D7E2EA]/70">
                    {st.text}
                  </motion.p>
                )}
              </li>
            ))}
          </ol>

          {/* Laptop frame */}
          <div className="order-1 mx-auto w-full max-w-[1100px] min-w-0 flex-1 lg:order-2">
            <div className="rounded-[18px] border border-[#2a2d33] bg-[#16181c] p-2 shadow-[0_40px_120px_-30px_rgba(182,0,168,0.35)] sm:rounded-[26px] sm:p-3">
              <div className="mb-2 flex items-center gap-1.5 px-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 hidden truncate rounded-md bg-[#0A0810] px-3 py-0.5 font-jakarta text-[11px] text-[#9aa3ad] sm:block">workspace.spurgeonappraisals · Operations view · sample data</span>
              </div>
              <div ref={frameRef} className="relative w-full overflow-hidden rounded-[10px] sm:rounded-[14px]" style={{ aspectRatio: `${W} / ${H}` }}>
                <div className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${fit})` }}>
                  <motion.div className="origin-top-left" style={{ width: W, height: H }} animate={controls}>
                    <Workspace kind={kind} step={step} pay={pay} onPay={(m) => { setPay(m); setPaid(false) }} paid={paid} onPaid={() => setPaid(true)} />
                  </motion.div>
                </div>
              </div>
            </div>
            <div className="mx-auto h-3 w-[70%] rounded-b-2xl bg-[#202328]" />

            {/* Caption for smaller screens */}
            <div className="mt-5 flex items-start gap-4 lg:hidden">
              <span className="font-light tabular-nums text-[#C0D849]" style={{ fontSize: 'clamp(1.6rem, 6vw, 2.4rem)', lineHeight: 1 }}>{String(step + 1).padStart(2, '0')}</span>
              <div className="min-w-0">
                <div className="font-medium uppercase tracking-wider text-[#D7E2EA]">{s.title}</div>
                <p className="text-sm font-light leading-relaxed text-[#D7E2EA]/70">{s.text}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-center gap-1.5 lg:hidden">
              {STEPS.map((st, i) => (
                <button key={st.key} type="button" aria-label={st.title} onClick={() => goTo(i)} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-[#C0D849]' : 'w-1.5 bg-[#646973]'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
