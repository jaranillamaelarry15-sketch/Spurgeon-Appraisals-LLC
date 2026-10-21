import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { Check, Copy, Linkedin, Mail, MapPin, Phone } from 'lucide-react'

const files = import.meta.glob('../assets/tours/*.webp', { eager: true, import: 'default' }) as Record<string, string>
const bg = files['../assets/tours/res-001-000.webp']

const EMAIL = 'jaranillamaelarry15@gmail.com'
const PHONE = '+63 991-909-1846'
const LINKEDIN = 'https://www.linkedin.com/in/larry-mae-jaranilla-7281191a6/'

function Item({ icon, label, value, copy }: { icon: React.ReactNode; label: string; value: string; copy?: boolean }) {
  const [done, setDone] = useState(false)
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/15 bg-[#01170C]/70 p-4 backdrop-blur">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#C0D849] text-[#01170C]">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs uppercase tracking-[0.16em] text-[#9FB6A9]">{label}</span>
        <span className="block select-all break-words text-sm text-white">{value}</span>
      </span>
      {copy && (
        <button
          type="button"
          aria-label={`Copy ${label.toLowerCase()}`}
          onClick={() => navigator.clipboard?.writeText(value).then(() => { setDone(true); setTimeout(() => setDone(false), 1500) }, () => {})}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          {done ? <Check size={15} /> : <Copy size={15} />}
        </button>
      )}
    </div>
  )
}

export default function CtaSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // A small window into the scene grows until it fills the screen.
  const inset = useTransform(scrollYProgress, [0, 0.55], [22, 0])
  const radius = useTransform(scrollYProgress, [0, 0.55], [36, 0])
  const clip = useTransform([inset, radius], ([i, r]) => `inset(${i}% ${Number(i) * 1.1}% ${i}% ${Number(i) * 1.1}% round ${r}px)`)
  // Function transforms on purpose: Framer's accelerated (array) form resets to the start value
  // when scrolling reaches the very bottom of the page, which hid this closing text.
  const ramp = (p: number) => Math.min(1, Math.max(0, (p - 0.45) / 0.25))
  const imgScale = useTransform(scrollYProgress, (p) => 1.25 - 0.25 * Math.min(1, Math.max(0, p)))
  const textO = useTransform(scrollYProgress, ramp)
  const textY = useTransform(scrollYProgress, (p) => 40 * (1 - ramp(p)))

  return (
    <section id="cta" ref={ref} className="relative h-[240vh] bg-[#01170C]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
          <motion.img src={bg} alt="Ranch home in Canton, Missouri" className="h-full w-full object-cover" style={{ scale: imgScale }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#01170C]/10 via-[#01170C]/45 to-[#01170C]/95" />
        </motion.div>
        <motion.div style={{ opacity: textO, y: textY }} className="absolute inset-x-0 bottom-0 z-30 px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="mx-auto max-w-[1100px]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C0D849]">Let&apos;s Work Together</p>
            <h2 className="mt-3 max-w-[20ch] font-light leading-[1.02] tracking-tight text-white" style={{ fontSize: 'clamp(2rem, 4.6vw, 4.2rem)' }}>
              Have a business that needs an <span className="font-serif italic text-[#C0D849]">extra pair of hands</span> on operations?
            </h2>
            <p className="mt-4 max-w-[56ch] leading-relaxed text-white/80">
              I&apos;d love to hear what you&apos;re working on and where things are getting stuck. Reach out and let&apos;s talk about how I can help.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Item icon={<Mail size={18} />} label="Email" value={EMAIL} copy />
              <Item icon={<Phone size={18} />} label="Phone" value={PHONE} copy />
              <Item icon={<MapPin size={18} />} label="Location" value="Silay City, Negros Occidental, Philippines" />
              <a href={LINKEDIN} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/15 bg-[#01170C]/70 p-4 backdrop-blur transition-colors hover:border-[#C0D849]/60">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#C0D849] text-[#01170C]"><Linkedin size={18} /></span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-[0.16em] text-[#9FB6A9]">LinkedIn</span>
                  <span className="block text-sm text-white">Connect on LinkedIn →</span>
                </span>
              </a>
            </div>
            <p className="mt-8 text-xs text-white/50">© 2026 Larry Mae Jaranilla · Virtual Assistant &amp; Operations Professional</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
