import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { GhostButton, PeachButton, scrollToId } from '../components/Buttons'

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // The scene pushes in, then washes out to light before the dark sections.
  const flash = useTransform(scrollYProgress, [0.62, 0.96], [0, 1])
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, -80])
  const textO = useTransform(scrollYProgress, [0.3, 0.62], [1, 0])

  return (
    <section id="hero" ref={ref} className="relative h-[230vh]">
      {/* z-30 keeps the text and the light wash above the WebGL scene */}
      <div className="sticky top-0 z-30 h-screen overflow-hidden">
        <motion.div style={{ y: textY, opacity: textO }} className="absolute inset-x-0 bottom-0 z-30 px-5 pb-10 sm:px-10 sm:pb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#2A1A24]/70"
          >
            Operations Manager · U.S. Real Estate Appraisal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[14ch] font-light leading-[0.95] tracking-tight text-[#2A1A24]"
            style={{ fontSize: 'clamp(2.8rem, 7.4vw, 7.5rem)' }}
          >
            Appraisal orders, <span className="font-serif italic">handled</span> end to end.
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-6 flex flex-wrap gap-3">
            <PeachButton onClick={() => scrollToId('cta')}>Book a call</PeachButton>
            <GhostButton dark onClick={() => scrollToId('tours')}>Tour the properties</GhostButton>
          </motion.div>
        </motion.div>
        <motion.div aria-hidden="true" style={{ opacity: flash }} className="pointer-events-none absolute inset-0 z-40 bg-[#FFF6F0]" />
      </div>
    </section>
  )
}
