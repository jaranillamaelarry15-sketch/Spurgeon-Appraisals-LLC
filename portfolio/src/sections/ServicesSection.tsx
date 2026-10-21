import FadeIn from '../components/FadeIn'

const SERVICES = [
  { name: 'Executive & Admin Support', text: 'Calendar and inbox management, scheduling, correspondence, and day-to-day executive support so nothing slips.' },
  { name: 'Client & CRM Management', text: "Client communications, relationship management, and a CRM that's kept clean, current, and easy to report from." },
  { name: 'Social Media & Marketing Support', text: 'Content coordination and social media marketing to grow visibility and bring in new clients — banks, attorneys, and property owners alike.' },
  { name: 'Process & SOP Development', text: 'Documented, repeatable procedures that let a growing team scale without losing quality or consistency.' },
  { name: 'Workflow Automation', text: 'Zapier, Power Automate, and GoHighLevel automations that cut manual work and reduce errors.' },
  { name: 'Scheduling & Coordination', text: 'Appointment and calendar coordination, including healthcare-grade scheduling accuracy and insurance verification.' },
]

export default function ServicesSection() {
  return (
    <section id="services" className="bg-[#01170C] px-5 py-24 sm:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <FadeIn as="p" className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C0D849]">What I can take off your plate</FadeIn>
        <FadeIn as="h2" y={40} className="mt-3 font-light leading-[1] tracking-tight" style={{ fontSize: 'clamp(2.4rem, 6vw, 6rem)' }}>
          <span className="font-serif italic text-[#C0D849]">Services</span>
        </FadeIn>
        <div className="mt-14 grid gap-x-10 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <FadeIn key={s.name} delay={(i % 2) * 0.1} y={40} className="group flex min-w-0 gap-6 border-t border-[#C0D849]/20 py-8 sm:py-10">
              <span className="shrink-0 font-light leading-none tabular-nums text-[#C0D849]/40 transition-colors duration-300 group-hover:text-[#C0D849]" style={{ fontSize: 'clamp(2.6rem, 5vw, 4.4rem)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 pt-1">
                <h3 className="font-normal text-[#F4F1EC]" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.7rem)' }}>{s.name}</h3>
                <p className="mt-2 max-w-[46ch] leading-relaxed text-[#9FB6A9]">{s.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
