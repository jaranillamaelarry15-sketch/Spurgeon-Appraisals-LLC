import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import FadeIn from '../components/FadeIn'
import { LiveProjectButton, scrollToId } from '../components/Buttons'
import login from '../assets/workspace-login.webp'
import wsDashboard from '../assets/ws-fee.webp'
import wsPay from '../assets/ws-pay.webp'
import crm from '../assets/crm.webp'
import social from '../assets/social.webp'
import field from '../assets/field.webp'
import health from '../assets/health.webp'
import profileSite from '../assets/profile-site.webp'
import fujitsu from '../assets/fujitsu.webp'

const LINKEDIN = 'https://www.linkedin.com/in/larry-mae-jaranilla-7281191a6/'

type Project = { name: string; category: string; images: [string, string, string]; action: { label: string; onClick?: () => void; href?: string } }

const PROJECTS: Project[] = [
  { name: 'Spurgeon Team Workspace', category: 'Client · Spurgeon Appraisals LLC', images: [login, wsPay, wsDashboard], action: { label: 'See it work', onClick: () => scrollToId('journey') } },
  { name: 'CRM & Social Media Growth', category: 'Client · Spurgeon Appraisals LLC', images: [crm, social, field], action: { label: 'LinkedIn', href: LINKEDIN } },
  { name: 'Healthcare & SAP Operations', category: 'Client · Olivia Professional, Fujitsu', images: [health, profileSite, fujitsu], action: { label: 'LinkedIn', href: LINKEDIN } },
]

function Card({ p, i, total, progress }: { p: Project; i: number; total: number; progress: MotionValue<number> }) {
  const targetScale = 1 - (total - 1 - i) * 0.03
  const scale = useTransform(progress, [i / total, 1], [1, targetScale])
  const radius = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]'
  return (
    <div className="sticky top-24 flex h-[85vh] items-start justify-center md:top-32">
      <motion.article
        style={{ scale, top: `${i * 28}px` }}
        className={`relative w-full max-w-6xl origin-top border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 ${radius}`}
      >
        <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3 px-2 sm:mb-6 md:px-4">
          <span className="hero-heading font-black leading-none tabular-nums" style={{ fontSize: 'clamp(3rem, 8vw, 110px)' }}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="min-w-[200px] flex-1">
            <div className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/60 sm:text-sm">{p.category}</div>
            <h3 className="font-medium uppercase text-[#D7E2EA]" style={{ fontSize: 'clamp(1.1rem, 2.4vw, 2.2rem)' }}>{p.name}</h3>
          </div>
          {p.action.href ? (
            <a href={p.action.href} target="_blank" rel="noreferrer" className="shrink-0 rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-200 hover:bg-[#D7E2EA]/10 sm:px-10 sm:py-3.5 sm:text-base">
              {p.action.label}
            </a>
          ) : (
            <LiveProjectButton label={p.action.label} onClick={p.action.onClick} />
          )}
        </div>
        <div className="flex gap-3 sm:gap-4">
          <div className="flex w-[40%] flex-col gap-3 sm:gap-4">
            <img src={p.images[0]} alt="" loading="lazy" className={`w-full object-cover ${radius}`} style={{ height: 'clamp(130px, 16vw, 230px)' }} />
            <img src={p.images[1]} alt="" loading="lazy" className={`w-full object-cover ${radius}`} style={{ height: 'clamp(160px, 22vw, 340px)' }} />
          </div>
          <div className="w-[60%]">
            <img src={p.images[2]} alt="" loading="lazy" className={`h-full w-full object-cover object-top ${radius}`} />
          </div>
        </div>
      </motion.article>
    </div>
  )
}

export default function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  return (
    <section id="projects" className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-4 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32">
      <FadeIn as="h2" y={40} className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
        Project
      </FadeIn>
      <div ref={ref} className="mt-10 md:mt-16">
        {PROJECTS.map((p, i) => (
          <Card key={p.name} p={p} i={i} total={PROJECTS.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  )
}
