import { AnimatePresence, motion } from 'framer-motion'
import {
  Inbox, LayoutDashboard, Calculator, MessageSquare, FileText, Receipt, Check, Mail, MapPin,
  Building2, Send, CalendarDays, CreditCard, Landmark, Paperclip, CheckCircle2, UserRound, Link2,
} from 'lucide-react'
import type { ReactNode } from 'react'
import logo from '../assets/spurgeon-logo.png'
import { ORDERS, STEPS, money, total, type PayMethod, type PropertyKey } from './data'

// The mock is drawn on a fixed 1280 × 800 canvas; the parent scales it to fit.
export const W = 1280
export const H = 800
export const RECTS = {
  all: { x: 0, y: 0, w: W, h: H },
  pipeline: { x: 236, y: 84, w: 1028, h: 64 },
  main: { x: 236, y: 160, w: 640, h: 624 },
  side: { x: 892, y: 160, w: 372, h: 624 },
  mainTop: { x: 236, y: 156, w: 640, h: 460 },
  sideTop: { x: 892, y: 156, w: 372, h: 440 },
  pay: { x: 560, y: 150, w: 704, h: 460 },
}

const C = {
  paper: '#F4F1EC',
  ink: '#01170C',
  green: '#024123',
  green2: '#046938',
  lime: '#C0D849',
  muted: '#6F8578',
  line: '#D6DDD8',
  card: '#FFFFFF',
}

function Card({ title, icon, children, className = '', style }: { title: string; icon?: ReactNode; children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-2xl border bg-white p-6 ${className}`} style={{ borderColor: C.line, ...style }}>
      <div className="mb-4 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.12em]" style={{ color: C.green2 }}>
        {icon}
        {title}
      </div>
      {children}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="mb-1 text-[12px] font-semibold" style={{ color: C.muted }}>{label}</div>
      <div className="truncate rounded-lg border px-3 py-2 text-[14px] font-medium" style={{ borderColor: C.line, background: '#FAFAF8', color: C.ink }}>
        {value}
      </div>
    </div>
  )
}

function Row({ k, v, strong }: { k: ReactNode; v: ReactNode; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b py-2.5 text-[14px]" style={{ borderColor: C.line }}>
      <span style={{ color: C.muted }}>{k}</span>
      <span className={`text-right tabular-nums ${strong ? 'font-bold' : 'font-semibold'}`} style={{ color: C.ink }}>{v}</span>
    </div>
  )
}

function Bubble({ who, text, mine, time }: { who: string; text: ReactNode; mine?: boolean; time: string }) {
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[78%]">
        <div className={`mb-1 text-[11px] font-semibold ${mine ? 'text-right' : ''}`} style={{ color: C.muted }}>{who} · {time}</div>
        <div
          className="rounded-2xl px-4 py-3 text-[14px] leading-snug"
          style={mine ? { background: C.green, color: '#fff' } : { background: '#EEF2EF', color: C.ink }}
        >
          {text}
        </div>
      </div>
    </div>
  )
}

function ParcelMap({ kind }: { kind: PropertyKey }) {
  // Stylized aerial: fields, roads and the subject parcel outlined in lime.
  return (
    <svg viewBox="0 0 560 230" className="block h-[230px] w-full rounded-xl" role="img" aria-label="Parcel map">
      <rect width="560" height="230" fill="#6F8F5A" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={i * 82 - 10} y={i % 2 ? 0 : 118} width="78" height={i % 2 ? 112 : 112} fill={i % 3 ? '#7FA066' : '#A79A62'} opacity="0.9" />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={'b' + i} x={i * 82 - 10} y={i % 2 ? 118 : 0} width="78" height="112" fill={i % 2 ? '#8CAB70' : '#5E7F4C'} opacity="0.85" />
      ))}
      <rect x="0" y="112" width="560" height="7" fill="#D9D3C2" />
      <rect x="300" y="0" width="7" height="230" fill="#D9D3C2" />
      {kind === 'residential' && (
        <g>
          {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={318 + i * 38} y={128} width="22" height="18" fill="#E9E4DA" />)}
          {Array.from({ length: 6 }).map((_, i) => <rect key={'t' + i} x={318 + i * 38} y={88} width="22" height="18" fill="#E9E4DA" />)}
          <rect x="356" y="122" width="38" height="34" fill="none" stroke={C.lime} strokeWidth="3" strokeDasharray="6 4" />
        </g>
      )}
      {kind === 'farm' && (
        <g>
          <rect x="14" y="8" width="276" height="98" fill="none" stroke={C.lime} strokeWidth="3" strokeDasharray="8 5" />
          <rect x="230" y="70" width="22" height="16" fill="#B0442A" />
          <circle cx="262" cy="80" r="7" fill="#C9CFCC" />
          <circle cx="276" cy="80" r="7" fill="#C9CFCC" />
          <path d="M14 70 C 80 60, 120 100, 190 92" stroke="#3D6E8C" strokeWidth="4" fill="none" />
        </g>
      )}
      {kind === 'commercial' && (
        <g>
          <rect x="316" y="128" width="210" height="90" fill="#8E9590" />
          <rect x="330" y="134" width="120" height="44" fill="#D8D4CC" />
          {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={334 + i * 30} y={190} width="3" height="20" fill="#fff" />)}
          <rect x="316" y="128" width="210" height="90" fill="none" stroke={C.lime} strokeWidth="3" strokeDasharray="8 5" />
        </g>
      )}
      <g transform={kind === 'farm' ? 'translate(150 50)' : kind === 'residential' ? 'translate(375 130)' : 'translate(390 150)'}>
        <circle r="10" fill={C.lime} stroke={C.ink} strokeWidth="2" />
      </g>
    </svg>
  )
}

type Props = {
  kind: PropertyKey
  step: number
  pay: PayMethod
  onPay: (m: PayMethod) => void
  paid: boolean
  onPaid: () => void
}

export default function Workspace({ kind, step, pay, onPay, paid, onPaid }: Props) {
  const o = ORDERS[kind]
  const t = total(o)
  const s = STEPS[step]
  const nav = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { icon: <Inbox size={18} />, label: 'Orders', on: true },
    { icon: <Calculator size={18} />, label: 'Fee sheets' },
    { icon: <MessageSquare size={18} />, label: 'Messages' },
    { icon: <Receipt size={18} />, label: 'Invoices' },
  ]

  const status = step >= 7 ? (paid ? 'Paid · Closed' : 'Invoice sent') : step >= 5 ? o.ghlStage : step >= 4 ? 'Bid sent · awaiting client' : step >= 3 ? 'With appraiser' : 'Awaiting your fee'

  return (
    <div className="relative font-jakarta" style={{ width: W, height: H, background: C.paper, color: C.ink }}>
      {/* Sidebar */}
      <aside className="absolute left-0 top-0 flex h-full w-[220px] flex-col gap-6 px-5 py-6" style={{ background: C.ink, color: '#E9F0EB' }}>
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="h-10 w-10" />
          <div className="font-jost text-[15px] font-extrabold uppercase leading-tight tracking-wide">Spurgeon<br />Appraisals</div>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((n) => (
            <div key={n.label} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold" style={n.on ? { background: '#0E3A22', color: C.lime } : { color: '#A9BDB1' }}>
              {n.icon}
              {n.label}
            </div>
          ))}
        </nav>
        <div className="mt-auto rounded-xl p-3 text-[12px]" style={{ background: '#0B2B19' }}>
          <div className="mb-1 font-bold uppercase tracking-[0.12em]" style={{ color: C.lime }}>Coverage</div>
          Missouri · Illinois · Iowa
        </div>
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full font-bold" style={{ background: C.lime, color: C.ink }}>LM</div>
          <div className="text-[13px] leading-tight"><b>Larry Mae</b><br /><span style={{ color: '#A9BDB1' }}>Operations view</span></div>
        </div>
      </aside>

      {/* Header */}
      <header className="absolute left-[236px] right-4 top-4 flex h-[60px] items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: C.green2 }}>{o.label} order · Sample data</div>
          <div className="truncate font-jost text-[24px] font-extrabold leading-tight">{o.orderName} <span className="font-jakarta text-[16px] font-semibold" style={{ color: C.muted }}>· {o.address}</span></div>
        </div>
        <motion.div
          key={status}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="shrink-0 rounded-full px-4 py-2 text-[13px] font-bold"
          style={paid && step >= 7 ? { background: C.green2, color: '#fff' } : step >= 5 ? { background: C.lime, color: C.ink } : { background: '#E3E8E4', color: C.green }}
        >
          {status}
        </motion.div>
      </header>

      {/* Pipeline */}
      <div className="absolute flex items-center gap-1.5 rounded-2xl border bg-white px-3" style={{ left: RECTS.pipeline.x, top: RECTS.pipeline.y, width: RECTS.pipeline.w, height: RECTS.pipeline.h, borderColor: C.line }}>
        {STEPS.map((st, i) => {
          const done = i < step || (i === 7 && paid)
          const cur = i === step && !(i === 7 && paid)
          return (
            <div key={st.key} className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-2 text-[13px] font-semibold transition-colors duration-500" style={cur ? { background: C.lime, color: C.ink } : done ? { color: C.green2 } : { color: '#9AA8A0' }}>
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold transition-colors duration-500" style={done ? { background: C.green2, color: '#fff' } : cur ? { background: C.ink, color: C.lime } : { background: '#EEF1EF' }}>
                {done ? <Check size={14} /> : i + 1}
              </span>
              <span className="truncate">{st.stage}</span>
            </div>
          )
        })}
      </div>

      {/* Step panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={kind + s.key}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
        >
          <div className="absolute flex flex-col gap-4" style={{ left: RECTS.main.x, top: RECTS.main.y, width: RECTS.main.w, height: RECTS.main.h }}>
            {s.key === 'intake' && (
              <Card title="Add new order" icon={<Inbox size={16} />} className="h-full">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <Field label="Client (bank, lender, firm)" value={o.client} />
                  <Field label="Primary contact" value={o.contact} />
                  <Field label="Primary email" value={o.email} />
                  <Field label="Primary phone" value={o.phone} />
                  <div className="col-span-2"><Field label="Property address" value={o.address} /></div>
                  <Field label="County" value={o.county} />
                  <Field label="Property type" value={o.propertyType} />
                  <Field label="Intended use" value={o.intendedUse} />
                  <Field label="Client due date" value={o.due} />
                  <div className="col-span-2"><Field label="Documents (OneDrive link)" value="onedrive.example/orders/engagement-letter.pdf" /></div>
                </div>
                <div className="mt-5 flex justify-end gap-3">
                  <span className="rounded-xl border px-5 py-2.5 text-[14px] font-semibold" style={{ borderColor: C.line }}>Cancel</span>
                  <motion.span initial={{ scale: 1 }} animate={{ scale: [1, 1.08, 1] }} transition={{ delay: 1.2, duration: 0.6 }} className="rounded-xl px-5 py-2.5 text-[14px] font-bold" style={{ background: C.lime }}>Save order</motion.span>
                </div>
              </Card>
            )}

            {s.key === 'research' && (
              <Card title="Property research" icon={<MapPin size={16} />} className="h-full">
                <ParcelMap kind={kind} />
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {o.facts.map(([k, v]) => (
                    <div key={k} className="rounded-xl p-3" style={{ background: '#F3F6F4' }}>
                      <div className="text-[12px] font-semibold" style={{ color: C.muted }}>{k}</div>
                      <div className="text-[16px] font-bold tabular-nums">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-[12px]" style={{ color: C.muted }}>Sources: county assessor, GIS parcel viewer, MLS history, aerial imagery</div>
              </Card>
            )}

            {s.key === 'fee' && (
              <Card title={`${o.label} fee sheet`} icon={<Calculator size={16} />} className="h-full">
                {o.feeLines.map((l, i) => (
                  <motion.div key={l.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.18 }}>
                    <Row k={<span><b style={{ color: C.ink }}>{i + 1}. {l.label}</b> <span className="text-[12px]">· {l.note}</span></span>} v={money(l.amount)} />
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1 }} className="mt-6 flex items-end justify-between rounded-2xl p-5" style={{ background: C.ink, color: '#fff' }}>
                  <div>
                    <div className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: C.lime }}>Total fee</div>
                    <div className="font-jost text-[44px] font-black leading-none tabular-nums">{money(t)}</div>
                  </div>
                  <div className="text-right text-[13px]" style={{ color: '#C9D6CE' }}>Turnaround<br /><b className="text-[16px] text-white">{o.turnaround}</b></div>
                </motion.div>
                <div className="mt-4 rounded-xl border border-dashed p-3 text-[13px]" style={{ borderColor: C.green2, color: C.green }}>
                  Checked the appraisal log first: no prior report on this property.
                </div>
              </Card>
            )}

            {s.key === 'assign' && (
              <Card title="Order messages" icon={<MessageSquare size={16} />} className="h-full">
                <div className="flex flex-col gap-4">
                  <Bubble who="Larry Mae" mine time="9:12 AM" text={<>Proposing <b>{money(t)}</b> with a {o.turnaround} turnaround for {o.address.split(',')[0]}. Can you take it?</>} />
                  <Bubble who={o.appraiser.name} time="9:40 AM" text="Yes, I can. Completion date works. Inspection early next week." />
                  <Bubble who="Larry Mae" mine time="9:41 AM" text="Great, sending the bid to the client now." />
                </div>
              </Card>
            )}

            {s.key === 'bid' && (
              <Card title="Email to client" icon={<Mail size={16} />} className="h-full">
                <div className="space-y-1 text-[14px]">
                  <div><span style={{ color: C.muted }}>To:</span> <b>{o.contact.split(',')[0]}</b> &lt;{o.email}&gt;</div>
                  <div><span style={{ color: C.muted }}>Cc:</span> Front Desk</div>
                  <div><span style={{ color: C.muted }}>Subject:</span> <b>Fee & turnaround: {o.address.split(',')[0]}</b></div>
                </div>
                <div className="mt-4 rounded-xl p-5 text-[15px] leading-relaxed" style={{ background: '#F7F8F6' }}>
                  Hello {o.contact.split(',')[0].split(' ')[0]},<br /><br />
                  Thank you for the request. Our fee for the {o.reportType.toLowerCase()} is <b>{money(t)}</b>, with completion by <b>{o.completion}</b> ({o.turnaround}). Reply to confirm and we will schedule the inspection.<br /><br />
                  Larry Mae · Spurgeon Appraisals LLC
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[13px]" style={{ color: C.muted }}><FileText size={15} /> Saved to order history</span>
                  <motion.span initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[14px] font-bold" style={{ background: C.lime }}><Send size={15} /> Sent</motion.span>
                </div>
              </Card>
            )}

            {s.key === 'confirm' && (
              <Card title="Client thread" icon={<MessageSquare size={16} />} className="h-full">
                <div className="flex flex-col gap-4">
                  <Bubble who={o.contact.split(',')[0]} time="1:05 PM" text={<>Fee and date approved. Please proceed with the appraisal.</>} />
                  <Bubble who="Larry Mae" mine time="1:07 PM" text={<span className="flex items-center gap-2"><CheckCircle2 size={16} style={{ color: C.lime }} /> Order Confirmed</span>} />
                </div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-8 rounded-2xl border-2 p-5" style={{ borderColor: C.lime, background: '#FBFDF1' }}>
                  <div className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: C.green2 }}>GHL automation</div>
                  <div className="mt-2 flex items-center gap-3 text-[15px] font-semibold">
                    <span className="rounded-lg px-3 py-1.5" style={{ background: '#E3E8E4' }}>Bid sent</span>
                    <span>→</span>
                    <span className="rounded-lg px-3 py-1.5" style={{ background: C.lime }}>{o.ghlStage}</span>
                  </div>
                  <div className="mt-3 text-[13px]" style={{ color: C.muted }}>Counted as confirmed on the dashboard. Appraiser notified in Teams.</div>
                </motion.div>
              </Card>
            )}

            {s.key === 'report' && (
              <Card title="Inspection & delivery" icon={<CalendarDays size={16} />} className="h-full">
                <div className="flex items-center gap-4 rounded-2xl p-5" style={{ background: '#F3F6F4' }}>
                  <div className="grid h-16 w-16 place-items-center rounded-2xl font-jost text-[26px] font-black" style={{ background: C.ink, color: C.lime }}>{o.inspection.split(' ')[2].replace(',', '')}</div>
                  <div>
                    <div className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: C.green2 }}>Inspection scheduled</div>
                    <div className="text-[18px] font-bold">{o.inspection}</div>
                    <div className="text-[13px]" style={{ color: C.muted }}>{o.appraiser.name} · access arranged with {o.contact.split(',')[0]}</div>
                  </div>
                </div>
                <div className="mt-5 text-[13px] font-bold uppercase tracking-[0.12em]" style={{ color: C.muted }}>Delivery checklist</div>
                <div className="mt-2">
                  {[...o.deliverables].map((d, i) => (
                    <motion.div key={d} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.3 }} className="flex items-center gap-3 border-b py-3 text-[15px] font-semibold" style={{ borderColor: C.line }}>
                      <span className="grid h-6 w-6 place-items-center rounded-full" style={{ background: C.green2, color: '#fff' }}><Check size={14} /></span>
                      {d}
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 text-[13px]" style={{ color: C.muted }}>Delivered {o.completion}, on time for the {o.due} client due date.</div>
              </Card>
            )}

            {s.key === 'pay' && (
              <Card title={`Invoice ${o.invoiceNo}`} icon={<Receipt size={16} />} className="h-full">
                <div className="flex justify-between text-[14px]">
                  <div><div style={{ color: C.muted }}>Bill to</div><b>{o.client}</b><br />{o.contact}</div>
                  <div className="text-right"><div style={{ color: C.muted }}>Due</div><b>Net 30</b></div>
                </div>
                <div className="mt-4">
                  <Row k={`${o.reportType} · ${o.address.split(',')[0]}`} v={money(t)} />
                  <Row k="Amount due" v={money(t)} strong />
                </div>
                {paid && (
                  <motion.div initial={{ scale: 1.6, opacity: 0, rotate: -14 }} animate={{ scale: 1, opacity: 1, rotate: -8 }} className="mx-auto mt-10 w-fit rounded-xl border-4 px-6 py-2 font-jost text-[34px] font-black uppercase" style={{ borderColor: C.green2, color: C.green2 }}>
                    Paid {pay === 'check' ? 'by check' : 'online'}
                  </motion.div>
                )}
              </Card>
            )}
          </div>

          <div className="absolute flex flex-col gap-4" style={{ left: RECTS.side.x, top: RECTS.side.y, width: RECTS.side.w, height: RECTS.side.h }}>
            {s.key === 'intake' && (
              <Card title="Incoming email" icon={<Mail size={16} />} className="h-full">
                <div className="text-[13px]" style={{ color: C.muted }}>From {o.email}</div>
                <div className="mt-1 text-[16px] font-bold leading-snug">{o.emailSubject}</div>
                <p className="mt-3 text-[14px] leading-relaxed">{o.emailBody}</p>
                <div className="mt-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-semibold" style={{ borderColor: C.line }}><Paperclip size={14} /> engagement-letter.pdf</div>
              </Card>
            )}
            {s.key === 'research' && (
              <Card title={o.compsTitle} icon={<Building2 size={16} />} className="h-full">
                {o.comps.map((c) => (
                  <div key={c.what} className="border-b py-3" style={{ borderColor: C.line }}>
                    <div className="text-[14px] font-semibold">{c.what}</div>
                    <div className="flex justify-between text-[13px]" style={{ color: C.muted }}><span className="font-bold tabular-nums" style={{ color: C.green2 }}>{c.price}</span><span>{c.dist}</span></div>
                  </div>
                ))}
                <div className="mt-4 rounded-xl p-3 text-[13px]" style={{ background: '#F3F6F4' }}>Workfile saved to the order’s SharePoint folder.</div>
              </Card>
            )}
            {s.key === 'fee' && (
              <Card title="Order details" icon={<FileText size={16} />} className="h-full">
                <Row k="Client" v={o.client} />
                <Row k="County" v={o.county} />
                <Row k="Report" v={o.reportType} />
                <Row k="Intended use" v={o.intendedUse} />
                <Row k="Client due" v={o.due} />
              </Card>
            )}
            {(s.key === 'assign' || s.key === 'bid') && (
              <Card title="Appraiser" icon={<UserRound size={16} />} className="h-full">
                <div className="flex items-center gap-3">
                  <div className="grid h-14 w-14 place-items-center rounded-full font-jost text-[20px] font-black" style={{ background: C.ink, color: C.lime }}>{o.appraiser.initials}</div>
                  <div><div className="text-[17px] font-bold">{o.appraiser.name}</div><div className="text-[13px]" style={{ color: C.muted }}>{o.appraiser.role}</div></div>
                </div>
                <div className="mt-4">
                  <Row k="Fee" v={money(t)} />
                  <Row k="Completion date" v={o.completion} />
                  <Row k="Turnaround" v={o.turnaround} />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[12px] font-bold">
                  <motion.span animate={s.key === 'assign' ? { scale: [1, 1.1, 1] } : {}} transition={{ delay: 0.8, duration: 0.6 }} className="rounded-lg py-2.5" style={{ background: C.lime }}>I’ll bid this</motion.span>
                  <span className="rounded-lg border py-2.5" style={{ borderColor: C.line }}>Reroute</span>
                  <span className="rounded-lg border py-2.5" style={{ borderColor: C.line }}>Decline</span>
                </div>
              </Card>
            )}
            {(s.key === 'confirm' || s.key === 'report') && (
              <Card title="Order summary" icon={<FileText size={16} />} className="h-full">
                <Row k="Fee" v={money(t)} />
                <Row k="Appraiser" v={o.appraiser.name} />
                <Row k="Inspection" v={o.inspection.split(' · ')[0]} />
                <Row k="Completion" v={o.completion} />
                <Row k="Stage" v={step >= 6 ? 'Report delivered' : 'In progress'} />
              </Card>
            )}
            {s.key === 'pay' && (
              <Card title="How would you like to pay?" icon={<CreditCard size={16} />} className="h-full">
                <div className="grid grid-cols-2 gap-2">
                  {(['link', 'check'] as PayMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => onPay(m)}
                      className="flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-[14px] font-bold transition-colors"
                      style={pay === m ? { borderColor: C.green2, background: '#EAF3EC', color: C.green } : { borderColor: C.line, color: C.muted }}
                    >
                      {m === 'link' ? <Link2 size={16} /> : <Landmark size={16} />}
                      {m === 'link' ? 'Payment link' : 'Check'}
                    </button>
                  ))}
                </div>
                {pay === 'link' ? (
                  <div className="mt-5">
                    <p className="text-[14px] leading-relaxed">A secure card or ACH link is emailed with the invoice. The client pays in two clicks.</p>
                    <button type="button" onClick={onPaid} disabled={paid} className="mt-4 w-full rounded-xl py-3.5 text-[15px] font-bold" style={{ background: paid ? '#E3E8E4' : C.lime, color: C.ink }}>
                      {paid ? 'Payment received' : `Pay ${money(t)} online`}
                    </button>
                  </div>
                ) : (
                  <div className="mt-5">
                    <p className="text-[14px] leading-relaxed">Make the check payable to <b>Spurgeon Appraisals LLC</b> and write <b>{o.invoiceNo}</b> on the memo line. Mail it to the address on the invoice.</p>
                    <button type="button" onClick={onPaid} disabled={paid} className="mt-4 w-full rounded-xl py-3.5 text-[15px] font-bold" style={{ background: paid ? '#E3E8E4' : C.lime, color: C.ink }}>
                      {paid ? 'Check deposited' : 'Mark check received'}
                    </button>
                  </div>
                )}
                <div className="mt-auto pt-4 text-[12px]" style={{ color: C.muted }}>Deposit logged and the order closes in GHL.</div>
              </Card>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
