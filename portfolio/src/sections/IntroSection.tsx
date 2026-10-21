import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import AnimatedText from '../components/AnimatedText'
import FadeIn from '../components/FadeIn'
import portrait from '../assets/portrait-cutout.webp'

const TEXT =
  "Hi, I'm Larry Mae. For the past two years I've run day-to-day operations for Spurgeon Appraisals LLC across Missouri, Illinois and Iowa: every residential, farm and commercial order from the first email to the final payment."

const STATS = [
  ['7+', 'years in operations'],
  ['3', 'states covered'],
  ['3', 'property types'],
  ['GHL', 'CRM & automation'],
]

export default function IntroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const portraitY = useTransform(scrollYProgress, [0, 1], [80, -80])

  return (
    <section id="intro" ref={ref} className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFF6F0 0%, #F3D3DA 8%, #6B4C78 22%, #0A0810 38%)' }}>
      <div className="relative z-30 mx-auto max-w-[1400px] px-5 pb-28 pt-[38vh] sm:px-10">
        <FadeIn as="h2" y={40} className="max-w-[16ch] font-light leading-[1] tracking-tight" style={{ fontSize: 'clamp(2.4rem, 6vw, 6rem)' }}>
          <span className="hero-heading">Operations Manager</span> for U.S. appraisal firms.
        </FadeIn>

        <div className="mt-16 grid items-end gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-16">
          <motion.div style={{ y: portraitY }} className="relative mx-auto w-full max-w-[460px]">
            <div aria-hidden="true" className="absolute inset-x-[10%] bottom-[8%] top-[18%] rounded-full bg-gradient-to-br from-[#F59AB8]/45 via-[#B9A3F7]/30 to-transparent blur-3xl" />
            <img src={portrait} alt="Larry Mae Jaranilla" className="relative w-full select-none opacity-95" draggable={false} />
          </motion.div>
          <div className="min-w-0 pb-6">
            <AnimatedText text={TEXT} className="font-light leading-snug text-[#F4EEF2]" style={{ fontSize: 'clamp(1.25rem, 2.3vw, 2rem)' }} />
            <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
              {STATS.map(([n, l], i) => (
                <FadeIn key={l} delay={i * 0.08}>
                  <div className="hero-heading text-4xl font-light tabular-nums sm:text-5xl">{n}</div>
                  <div className="mt-1 text-sm text-[#A79FB0]">{l}</div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
