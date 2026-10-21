import type { ReactNode } from 'react'

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 sm:text-[15px]'

export function PrimaryButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`${base} bg-gradient-to-r from-[#C0D849] to-[#C0D849] text-[#01170C] shadow-[0_8px_30px_-8px_rgba(192,216,73,0.55)] hover:brightness-105`}>
      {children}
    </button>
  )
}

export function GhostButton({ children, onClick, dark }: { children: ReactNode; onClick?: () => void; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} border ${dark ? 'border-[#01170C]/40 text-[#01170C] hover:bg-[#01170C]/5' : 'border-[#C0D849]/60 text-[#C0D849] hover:bg-[#C0D849]/10'}`}
    >
      {children}
    </button>
  )
}
