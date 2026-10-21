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

  const ink = 'text-[#F4F1EC]'
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-8 sm:pt-5">
      <div className={`mx-auto flex max-w-[1400px] items-center justify-between gap-3 rounded-2xl px-3 py-2 transition-colors duration-500 sm:px-4 ${light ? '' : 'bg-[#01170C]/60 backdrop-blur-md'}`}>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`flex items-center gap-2 text-xl font-medium tracking-tight sm:text-2xl ${ink}`}>
          <span className="h-5 w-5 rounded-full bg-gradient-to-br from-[#C0D849] via-[#7FBF8E] to-[#046938]" />
          Larry Mae
        </button>
        <nav className={`hidden items-center gap-1 rounded-xl border px-1.5 py-1 md:flex ${light ? 'border-[#F4F1EC]/20 bg-[#01170C]/30 backdrop-blur' : 'border-[#C0D849]/30 bg-[#01170C]/50'}`}>
          {LINKS.map((l) => (
            <button key={l.id} type="button" onClick={() => scrollToId(l.id)} className={`rounded-lg px-3 py-1.5 text-sm transition-opacity hover:opacity-70 ${ink}`}>
              {l.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => scrollToId('cta')}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors border-[#C0D849]/60 text-[#C0D849] hover:bg-[#C0D849]/10`}
        >
          Book a call
        </button>
      </div>
    </header>
  )
}
