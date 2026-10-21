import { useEffect, useState } from 'react'
import { scrollToId } from './Buttons'

const LINKS = [
  { label: 'About', id: 'intro' },
  { label: 'Properties', id: 'work' },
  { label: 'Tours', id: 'tours' },
  { label: 'Process', id: 'process' },
]

export default function Nav() {
  const [light, setLight] = useState(true)
  useEffect(() => {
    const on = () => {
      const hero = document.getElementById('hero')
      setLight(!!hero && hero.getBoundingClientRect().bottom > 80)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const ink = light ? 'text-[#2A1A24]' : 'text-[#F4EEF2]'
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-8 sm:pt-5">
      <div className={`mx-auto flex max-w-[1400px] items-center justify-between gap-3 rounded-2xl px-3 py-2 transition-colors duration-500 sm:px-4 ${light ? '' : 'bg-[#0A0810]/60 backdrop-blur-md'}`}>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`flex items-center gap-2 text-xl font-medium tracking-tight sm:text-2xl ${ink}`}>
          <span className="h-5 w-5 rounded-full bg-gradient-to-br from-[#FFD3B0] via-[#F59AB8] to-[#B9A3F7]" />
          larry mae
        </button>
        <nav className={`hidden items-center gap-1 rounded-xl border px-1.5 py-1 md:flex ${light ? 'border-[#2A1A24]/15 bg-white/30' : 'border-[#F6A98C]/30 bg-[#2A1A24]/50'}`}>
          {LINKS.map((l) => (
            <button key={l.id} type="button" onClick={() => scrollToId(l.id)} className={`rounded-lg px-3 py-1.5 text-sm transition-opacity hover:opacity-70 ${ink}`}>
              {l.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => scrollToId('cta')}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${light ? 'border-[#2A1A24]/40 text-[#2A1A24] hover:bg-white/40' : 'border-[#F6A98C]/60 text-[#FFD3B0] hover:bg-[#F6A98C]/10'}`}
        >
          Book a call
        </button>
      </div>
    </header>
  )
}
