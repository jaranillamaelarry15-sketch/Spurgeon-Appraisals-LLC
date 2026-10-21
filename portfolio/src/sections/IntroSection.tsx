import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import AnimatedText from '../components/AnimatedText'
import FadeIn from '../components/FadeIn'
import { Workflow, Zap, Target } from 'lucide-react'
import portrait from '../assets/portrait-cutout.webp'

const TEXT =
  "Hi, I'm Larry Mae. For the past two years I've run day-to-day operations for Spurgeon Appraisals LLC across Missouri, Illinois and Iowa: every residential, farm and commercial order from the first email to the final payment."

const OFFER = [
  { icon: Workflow, title: 'Systematized', text: 'SOPs, order checklists and a clean CRM pipeline, so every order follows the same steps from intake to payment.' },
  { icon: Zap, title: 'Efficient', text: 'Same-day intake and fee quotes, organized workfiles, and automatic follow-ups that cut manual work.' },
  { icon: Target, title: 'Effective', text: 'Clear client updates, reports delivered on time, and invoices paid by check or payment link.' },
]

const CLIENTS = ['Appraisal firms', 'Banks & lenders', 'AMCs', 'Attorneys & estates', 'Property owners']

export default function IntroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const portraitY = useTransform(scrollYProgress, [0, 1], [80, -80])

  return (
    <section id="intro" ref={ref} className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #01170C 0%, #022C18 40%, #01170C 100%)' }}>
      <div className="relative z-30 mx-auto max-w-[1400px] px-5 pb-28 pt-28 md:pt-36 sm:px-10">
        <FadeIn as="h2" y={40} className="max-w-[16ch] font-light leading-[1] tracking-tight" style={{ fontSize: 'clamp(2.4rem, 6vw, 6rem)' }}>
          <span className="hero-heading">Operations Manager</span> for U.S. appraisal firms.
        </FadeIn>

        <div className="mt-16 grid items-end gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-16">
          <motion.div style={{ y: portraitY }} className="relative mx-auto w-full max-w-[460px]">
            <div aria-hidden="true" className="absolute inset-x-[10%] bottom-[8%] top-[18%] rounded-full bg-gradient-to-br from-[#7FBF8E]/45 via-[#046938]/30 to-transparent blur-3xl" />
            <img src={portrait} alt="Larry Mae Jaranilla" className="relative w-full select-none opacity-95" draggable={false} />
          </motion.div>
          <div className="min-w-0 pb-6">
            <AnimatedText text={TEXT} className="font-light leading-snug text-[#F4F1EC]" style={{ fontSize: 'clamp(1.25rem, 2.3vw, 2rem)' }} />
            <FadeIn delay={0.1} className="mt-10">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9FB6A9]">Who I work with</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {CLIENTS.map((c) => (
                  <span key={c} className="rounded-full border border-[#C0D849]/35 px-3 py-1.5 text-sm text-[#E4EFA0]">{c}</span>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>

        <div className="mt-20 grid gap-4 md:grid-cols-3">
          {OFFER.map((o, i) => (
            <FadeIn key={o.title} delay={i * 0.1} y={40} className="min-w-0 rounded-2xl border border-white/10 bg-[#022C18]/70 p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#C0D849] text-[#01170C]"><o.icon size={20} /></span>
              <h3 className="mt-5 text-2xl font-light">{o.title}</h3>
              <p className="mt-2 leading-relaxed text-[#9FB6A9]">{o.text}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
