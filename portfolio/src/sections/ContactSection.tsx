import { useState } from 'react'
import { Copy, Check, Linkedin, MapPin } from 'lucide-react'
import FadeIn from '../components/FadeIn'
import check from '../assets/obj_check.webp'

function CopyRow({ label, value }: { label: string; value: string }) {
  const [done, setDone] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(value).then(
      () => { setDone(true); setTimeout(() => setDone(false), 1600) },
      () => {},
    )
  }
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#D7E2EA]/15 py-5">
      <div className="min-w-0">
        <div className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/50">{label}</div>
        <div className="select-all break-all font-medium text-[#D7E2EA]" style={{ fontSize: 'clamp(1rem, 2.2vw, 1.6rem)' }}>{value}</div>
      </div>
      <button type="button" onClick={copy} aria-label={`Copy ${label.toLowerCase()}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-[#D7E2EA]/40 text-[#D7E2EA] transition-colors hover:border-[#D7E2EA]">
        {done ? <Check size={18} /> : <Copy size={18} />}
      </button>
    </div>
  )
}

export default function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden px-5 pb-16 pt-32 sm:px-8 md:px-10 md:pt-40">
      <img src={check} alt="" className="pointer-events-none absolute -right-6 top-16 w-[140px] opacity-90 sm:w-[200px] md:right-[6%]" />
      <FadeIn as="h2" y={40} className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
        Let&apos;s talk
      </FadeIn>
      <FadeIn delay={0.15} className="mx-auto mt-6 max-w-[560px] text-center font-light leading-relaxed text-[#D7E2EA]" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)' }}>
        Need someone to run your appraisal orders, quote fees, or clean up your CRM? Tell me where things are getting stuck.
      </FadeIn>
      <FadeIn delay={0.25} className="mx-auto mt-12 max-w-3xl">
        <CopyRow label="Email" value="jaranillamaelarry15@gmail.com" />
        <CopyRow label="Phone" value="+63 991 909 1846" />
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 text-[#D7E2EA]">
          <span className="flex items-center gap-2 font-light"><MapPin size={18} /> Silay City, Negros Occidental, Philippines</span>
          <a href="https://www.linkedin.com/in/larry-mae-jaranilla-7281191a6/" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] px-6 py-2.5 text-sm font-medium uppercase tracking-widest transition-colors hover:bg-[#D7E2EA]/10">
            <Linkedin size={16} /> LinkedIn
          </a>
        </div>
      </FadeIn>
      <div className="mt-16 text-center text-xs font-light uppercase tracking-widest text-[#646973]">© 2026 Larry Mae Jaranilla · Operations Manager</div>
    </section>
  )
}
