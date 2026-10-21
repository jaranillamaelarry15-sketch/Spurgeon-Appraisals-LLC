import FadeIn from '../components/FadeIn'
import Magnet from '../components/Magnet'
import { ContactButton, scrollToId } from '../components/Buttons'
import portrait from '../assets/portrait.webp'

const LINKS = [
  { label: 'About', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact', id: 'contact' },
]

export default function HeroSection() {
  return (
    <section className="relative flex h-screen min-h-[560px] flex-col" style={{ overflowX: 'clip' }}>
      <FadeIn as="nav" delay={0} y={-20} className="flex justify-between px-6 pt-6 md:px-10 md:pt-8">
        {LINKS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => scrollToId(l.id)}
            className="text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
          >
            {l.label}
          </button>
        ))}
      </FadeIn>

      <div className="overflow-hidden">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading mt-6 w-full whitespace-nowrap text-center font-black uppercase leading-none tracking-tight sm:mt-4 md:-mt-5 text-[13vw] sm:text-[14vw] md:text-[14.5vw] lg:text-[15.5vw]"
        >
          Hi, i&apos;m larry
        </FadeIn>
      </div>

      <Magnet
        padding={150}
        strength={3}
        activeTransition="transform 0.3s ease-out"
        inactiveTransition="transform 0.6s ease-in-out"
        className="absolute left-1/2 top-1/2 z-10 w-[230px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[300px] sm:translate-y-0 md:w-[360px] lg:w-[420px]"
      >
        <FadeIn delay={0.6} y={30}>
          <img
            src={portrait}
            alt="Larry Mae Jaranilla"
            className="block w-full select-none"
            draggable={false}
          />
        </FadeIn>
      </Magnet>

      <div className="relative z-20 mt-auto flex items-end justify-between gap-4 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px]"
          style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
        >
          an operations manager taking appraisal orders from intake to payment
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  )
}
