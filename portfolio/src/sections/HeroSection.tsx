import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { GhostButton, PrimaryButton, scrollToId } from '../components/Buttons'
import field from '../assets/field.webp'

const STATES = ['Missouri', 'Illinois', 'Iowa']

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // The camera pushes into the field, then the scene sinks into the dark green of the next section.
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.45])
  const wash = useTransform(scrollYProgress, [0.55, 0.95], [0, 1])
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, -80])
  const textO = useTransform(scrollYProgress, [0.3, 0.6], [1, 0])

  return (
    <section id="hero" ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.img
          src={field}
          alt="Missouri farmland at dusk"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ scale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(1,23,12,.9) 0%, rgba(2,65,35,.7) 45%, rgba(2,65,35,.25) 100%)' }} />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#01170C] to-transparent" />

        <motion.div style={{ y: textY, opacity: textO }} className="absolute inset-x-0 bottom-0 px-5 pb-10 sm:px-10 sm:pb-14">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#C0D849]">
            Operations Manager · U.S. Real Estate Appraisal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[14ch] font-light leading-[0.95] tracking-tight text-[#F4F1EC]"
            style={{ fontSize: 'clamp(2.8rem, 7.4vw, 7.5rem)' }}
          >
            Appraisal orders, <span className="font-serif italic text-[#C0D849]">handled</span> end to end.
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-6 flex flex-wrap items-center gap-3">
            <PrimaryButton onClick={() => scrollToId('cta')}>Book a call</PrimaryButton>
            <GhostButton onClick={() => scrollToId('tours')}>Tour the properties</GhostButton>
            <span className="ml-1 flex flex-wrap gap-2">
              {STATES.map((s) => (
                <span key={s} className="rounded-full bg-[#C0D849]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#C0D849]">{s}</span>
              ))}
            </span>
          </motion.div>
        </motion.div>
        <motion.div aria-hidden="true" style={{ opacity: wash }} className="pointer-events-none absolute inset-0 bg-[#01170C]" />
      </div>
    </section>
  )
}
