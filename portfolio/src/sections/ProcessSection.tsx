import { Inbox, Calculator, BadgeCheck } from 'lucide-react'
import FadeIn from '../components/FadeIn'
import { GhostButton, PeachButton, scrollToId } from '../components/Buttons'

const files = import.meta.glob('../assets/tours/*.webp', { eager: true, import: 'default' }) as Record<string, string>
const img = (n: string) => files[`../assets/tours/${n}.webp`]

const STEPS = [
  { n: 'Step 1', title: 'Order intake', text: 'Client, property, intended use and due date logged the day the request arrives.', icon: Inbox, src: img('land-aerial') },
  { n: 'Step 2', title: 'Fee quote & bid', text: 'Research, fee sheet, appraiser sign-off, then the bid goes to the client.', icon: Calculator, src: img('farm-aerial') },
  { n: 'Step 3', title: 'Confirmed & paid', text: 'Order confirmed, report delivered, paid by check or payment link.', icon: BadgeCheck, src: img('res-001-000') },
]

export default function ProcessSection() {
  return (
    <section id="process" className="relative overflow-hidden bg-[#0A0810] px-5 py-28 sm:px-10 md:py-36">
      <div aria-hidden="true" className="absolute right-[-10%] top-[10%] h-[60vh] w-[60vh] rounded-full bg-[#B9A3F7]/20 blur-[120px]" />
      <div className="relative z-30 mx-auto max-w-[1400px]">
        <div id="process-head" className="max-w-[640px] pb-[12vh]">
          <FadeIn as="h2" y={40} className="font-light leading-[1] tracking-tight" style={{ fontSize: 'clamp(2.4rem, 5.6vw, 5.4rem)' }}>
            Get your order <span className="font-serif italic text-[#FFD3B0]">quoted</span>, confirmed &amp; paid.
          </FadeIn>
          <FadeIn delay={0.15} className="mt-8 flex flex-wrap gap-3">
            <PeachButton onClick={() => scrollToId('cta')}>Book a call</PeachButton>
            <GhostButton onClick={() => scrollToId('journey')}>Watch an order</GhostButton>
          </FadeIn>
        </div>
        <div className="mt-[14vh] grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.12} y={50} className="group min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur">
              <div className="relative h-40 overflow-hidden">
                <img src={s.src} alt="" loading="lazy" className="h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-110" />
                <span className="absolute inset-0 bg-gradient-to-t from-[#0A0810] to-transparent" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#A79FB0]">
                  <s.icon size={14} className="text-[#FFD3B0]" /> {s.n}
                </div>
                <h3 className="mt-2 text-2xl font-light">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#A79FB0]">{s.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
