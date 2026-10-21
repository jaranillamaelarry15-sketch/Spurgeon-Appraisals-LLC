import FadeIn from '../components/FadeIn'

const SERVICES = [
  { name: 'Appraisal Order Management', text: 'Residential, farm, commercial and vacant land orders handled from intake and assignment review through scheduling, status tracking and final report delivery.' },
  { name: 'Fee Quoting & Bids', text: 'Accurate fees from each appraiser’s fee sheet, with bids, turnaround times and completion dates sent to banks, AMCs and attorneys the same day.' },
  { name: 'Property & Market Research', text: 'County assessor records, parcel and GIS maps, aerials, MLS history and comparable sales, organized into a clean digital workfile.' },
  { name: 'CRM & Workflow Automation', text: 'GoHighLevel, Zapier, Make and Power Automate workflows that move orders, send follow-ups and keep the pipeline current without manual entry.' },
  { name: 'Social Media Marketing', text: 'Content and campaigns that put an appraisal firm in front of the banks, attorneys and property owners who order appraisals.' },
]

export default function ServicesSection() {
  return (
    <section id="services" className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn as="h2" y={40} className="mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
        Services
      </FadeIn>
      <div className="mx-auto max-w-5xl">
        {SERVICES.map((s, i) => (
          <FadeIn
            key={s.name}
            delay={i * 0.1}
            className="flex items-start gap-5 py-8 text-[#0C0C0C] sm:gap-8 sm:py-10 md:gap-12 md:py-12"
            style={{ borderTop: i === 0 ? undefined : '1px solid rgba(12, 12, 12, 0.15)' }}
          >
            <span className="shrink-0 font-black leading-none tabular-nums" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0 pt-1 sm:pt-3">
              <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{s.name}</h3>
              <p className="mt-2 max-w-2xl font-light leading-relaxed opacity-60" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>{s.text}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
