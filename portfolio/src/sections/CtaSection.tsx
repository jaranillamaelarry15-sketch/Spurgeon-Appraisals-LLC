import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { Check, Copy, Linkedin } from 'lucide-react'
import { PrimaryButton } from '../components/Buttons'

const files = import.meta.glob('../assets/tours/*.webp', { eager: true, import: 'default' }) as Record<string, string>
const bg = files['../assets/tours/res-001-000.webp']

const EMAIL = 'jaranillamaelarry15@gmail.com'
const PHONE = '+63 991 909 1846'
const LINKEDIN = 'https://www.linkedin.com/in/larry-mae-jaranilla-7281191a6/'

function CopyChip({ value }: { value: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(value).then(() => { setDone(true); setTimeout(() => setDone(false), 1500) }, () => {})}
      className="flex items-center gap-2 rounded-xl border border-white/30 bg-[#01170C]/40 px-4 py-2.5 text-sm text-white backdrop-blur transition-colors hover:bg-[#01170C]/60"
    >
      <span className="select-all">{value}</span>
      {done ? <Check size={15} /> : <Copy size={15} />}
    </button>
  )
}

export default function CtaSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // A small window into the scene grows until it fills the screen.
  const inset = useTransform(scrollYProgress, [0, 0.55], [22, 0])
  const radius = useTransform(scrollYProgress, [0, 0.55], [36, 0])
  const clip = useTransform([inset, radius], ([i, r]) => `inset(${i}% ${Number(i) * 1.1}% ${i}% ${Number(i) * 1.1}% round ${r}px)`)
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.25, 1])
  const textO = useTransform(scrollYProgress, [0.45, 0.7], [0, 1])
  const textY = useTransform(scrollYProgress, [0.45, 0.7], [40, 0])

  return (
    <section id="cta" ref={ref} className="relative h-[240vh] bg-[#01170C]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
          <motion.img src={bg} alt="Ranch home in Canton, Missouri" className="h-full w-full object-cover" style={{ scale: imgScale }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#046938]/35 via-[#7FBF8E]/20 to-[#01170C]/80" />
        </motion.div>
        <motion.div style={{ opacity: textO, y: textY }} className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center px-5 pb-12 text-center sm:pb-16">
          <div className="flex items-center gap-2 text-2xl font-medium tracking-tight text-white">
            <span className="h-5 w-5 rounded-full bg-gradient-to-br from-[#C0D849] via-[#7FBF8E] to-[#046938]" /> larry mae
          </div>
          <h2 className="mt-3 max-w-[16ch] font-light leading-[1] tracking-tight text-white" style={{ fontSize: 'clamp(2.2rem, 5.4vw, 5rem)' }}>
            Let&apos;s make your next order <span className="font-serif italic">effortless</span>.
          </h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <PrimaryButton onClick={() => navigator.clipboard?.writeText(EMAIL).catch(() => {})}>Book a call</PrimaryButton>
            <a href={LINKEDIN} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/50 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:text-[15px]">
              <Linkedin size={16} /> LinkedIn
            </a>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <CopyChip value={EMAIL} />
            <CopyChip value={PHONE} />
          </div>
          <p className="mt-6 text-xs text-white/60">Silay City, Negros Occidental, Philippines · Serving U.S. appraisal firms · © 2026 Larry Mae Jaranilla</p>
        </motion.div>
      </div>
    </section>
  )
}
