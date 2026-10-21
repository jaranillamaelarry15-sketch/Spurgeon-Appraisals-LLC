import type { ReactNode } from 'react'

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 sm:text-[15px]'

export function PeachButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`${base} bg-gradient-to-r from-[#FFD3B0] to-[#F6A98C] text-[#2A1A24] shadow-[0_8px_30px_-8px_rgba(246,169,140,0.7)] hover:brightness-105`}>
      {children}
    </button>
  )
}

export function GhostButton({ children, onClick, dark }: { children: ReactNode; onClick?: () => void; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} border ${dark ? 'border-[#2A1A24]/40 text-[#2A1A24] hover:bg-[#2A1A24]/5' : 'border-[#F6A98C]/60 text-[#FFD3B0] hover:bg-[#F6A98C]/10'}`}
    >
      {children}
    </button>
  )
}
