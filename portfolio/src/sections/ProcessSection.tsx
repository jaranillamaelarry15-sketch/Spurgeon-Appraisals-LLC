import { Inbox, Calculator, BadgeCheck } from 'lucide-react'
import FadeIn from '../components/FadeIn'
import { GhostButton, PrimaryButton, scrollToId } from '../components/Buttons'

const files = import.meta.glob('../assets/tours/*.webp', { eager: true, import: 'default' }) as Record<string, string>
const img = (n: string) => files[`../assets/tours/${n}.webp`]

const STEPS = [
  { n: 'Step 1', title: 'Order intake', text: 'Client, property, intended use and due date logged the day the request arrives.', icon: Inbox, src: img('land-aerial') },
  { n: 'Step 2', title: 'Fee quote & bid', text: 'Research, fee sheet, appraiser sign-off, then the bid goes to the client.', icon: Calculator, src: img('farm-aerial') },
  { n: 'Step 3', title: 'Confirmed & paid', text: 'Order confirmed, report delivered, paid by check or payment link.', icon: BadgeCheck, src: img('res-001-000') },
]

export default function ProcessSection() {
  return (
    <section id="process" className="relative overflow-hidden bg-[#01170C] px-5 py-28 sm:px-10 md:py-36">
      <div aria-hidden="true" className="absolute right-[-10%] top-[10%] h-[60vh] w-[60vh] rounded-full bg-[#046938]/20 blur-[120px]" />
      <div className="relative z-30 mx-auto max-w-[1400px]">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div id="process-head" className="max-w-[640px]">
          <FadeIn as="h2" y={40} className="font-light leading-[1] tracking-tight" style={{ fontSize: 'clamp(2.4rem, 5.6vw, 5.4rem)' }}>
            Get your order <span className="font-serif italic text-[#C0D849]">quoted</span>, confirmed &amp; paid.
          </FadeIn>
          <FadeIn delay={0.15} className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton onClick={() => scrollToId('cta')}>Book a call</PrimaryButton>
            <GhostButton onClick={() => scrollToId('journey')}>Watch an order</GhostButton>
          </FadeIn>
        </div>
        <FadeIn delay={0.2} x={60} y={0} className="min-w-0">
          <img src={img('res-018-015')} alt="Rear of the Canton ranch home" loading="lazy" className="aspect-[4/3] w-full rounded-2xl border border-white/10 object-cover" />
        </FadeIn>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.12} y={50} className="group min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur">
              <div className="relative h-40 overflow-hidden">
                <img src={s.src} alt="" loading="lazy" className="h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-110" />
                <span className="absolute inset-0 bg-gradient-to-t from-[#01170C] to-transparent" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#9FB6A9]">
                  <s.icon size={14} className="text-[#C0D849]" /> {s.n}
                </div>
                <h3 className="mt-2 text-2xl font-light">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#9FB6A9]">{s.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
