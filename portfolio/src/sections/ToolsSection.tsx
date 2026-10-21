import { BarChart3, Grid3x3, Home, Landmark, Map, Workflow, type LucideIcon } from 'lucide-react'
import FadeIn from '../components/FadeIn'
import { TOOL_GROUPS, type Tool } from '../data/tools'

const ICONS: Record<string, LucideIcon> = { Home, BarChart3, Map, Grid3x3, Landmark, Workflow }

function Mark({ t }: { t: Tool }) {
  if (t.svg) return <span className="block h-9 w-9 [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: t.svg }} />
  if (t.icon) {
    const I = ICONS[t.icon]
    return (
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#024123] text-[#C0D849]">
        <I size={20} />
      </span>
    )
  }
  return null
}

export default function ToolsSection() {
  return (
    <section id="tools" className="bg-[#01170C] px-5 py-24 sm:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <FadeIn as="p" className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C0D849]">Technical skills & tools</FadeIn>
        <FadeIn as="h2" y={40} className="mt-3 max-w-[18ch] font-light leading-[1] tracking-tight" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.8rem)' }}>
          The tools I <span className="font-serif italic text-[#C0D849]">work</span> in every day.
        </FadeIn>
        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          {TOOL_GROUPS.map((g, gi) => (
            <FadeIn key={g.title} delay={(gi % 2) * 0.08} y={30} className="min-w-0">
              <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.16em] text-[#9FB6A9]">{g.title}</h3>
              <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {g.tools.map((t) => (
                  <li
                    key={t.name}
                    className={`flex min-h-[64px] items-center gap-3 rounded-xl px-3.5 py-3 transition-transform duration-200 hover:-translate-y-0.5 ${
                      t.svg ? 'bg-white text-[#01170C]' : 'border border-[#C0D849]/25 bg-[#022C18] text-[#F4F1EC]'
                    }`}
                  >
                    <Mark t={t} />
                    <span className="min-w-0 text-sm font-medium leading-tight">{t.name}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
