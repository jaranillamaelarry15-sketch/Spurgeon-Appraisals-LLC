import { Inbox, Calculator, Map, Workflow, Megaphone, CalendarCheck, Receipt, Users } from 'lucide-react'
import FadeIn from '../components/FadeIn'

const ROW1 = [
  { icon: Inbox, label: 'Appraisal order management' },
  { icon: Calculator, label: 'Fee quoting & bids' },
  { icon: Map, label: 'GIS & parcel research' },
  { icon: CalendarCheck, label: 'Inspection scheduling' },
]
const ROW2 = [
  { icon: Workflow, label: 'GHL, Zapier & Make automation' },
  { icon: Users, label: 'Client & AMC communication' },
  { icon: Receipt, label: 'Invoicing & payment follow-up' },
  { icon: Megaphone, label: 'Social media marketing' },
]

function Row({ items, rev }: { items: typeof ROW1; rev?: boolean }) {
  const all = [...items, ...items, ...items, ...items]
  return (
    <div className="overflow-hidden">
      <div className={`flex w-max gap-3 ${rev ? 'marquee-rev' : 'marquee'}`}>
        {all.map((it, i) => (
          <span key={i} className="flex shrink-0 items-center gap-2 rounded-xl border border-[#9BF5CF]/40 bg-[#9BF5CF]/10 px-5 py-3 text-[15px] text-[#CFFBE8] shadow-[0_0_24px_-6px_rgba(155,245,207,0.55)] sm:text-base">
            <it.icon size={17} /> {it.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ServicesSection() {
  return (
    <section id="services" className="bg-[#0A0810] py-24 md:py-32">
      <FadeIn as="h2" y={40} className="mx-auto max-w-[1400px] px-5 font-light leading-[1] tracking-tight sm:px-10" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.8rem)' }}>
        What I take off <span className="font-serif italic text-[#FFD3B0]">your</span> plate.
      </FadeIn>
      <div className="mt-12 flex flex-col gap-3">
        <Row items={ROW1} />
        <Row items={ROW2} rev />
      </div>
    </section>
  )
}
