import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import CopyButton from './CopyButton'
import { company, whatsappLink } from '../data/company'

export default function Contacts() {
  const rows = [
    ...company.phones.map((p) => ({ icon: Phone, label: p.label, display: p.display, href: p.href, copy: 'Телефон' })),
    {
      icon: MessageCircle,
      label: 'WhatsApp — заявки и вопросы',
      display: company.whatsapp.display,
      href: whatsappLink('Здравствуйте! Пишу с сайта.'),
      copy: 'WhatsApp',
    },
    { icon: Mail, label: 'Электронная почта', display: company.email, href: `mailto:${company.email}`, copy: 'E-mail' },
  ]

  return (
    <section id="contacts" aria-labelledby="contacts-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-[14px] font-medium text-accent-ink">Контакты</p>
        <h2 id="contacts-title" className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[2.5rem]">
          Склад и офис
        </h2>

        <div className="mt-12 grid gap-3 lg:grid-cols-[1.3fr_1fr]">
          <div className="relative flex min-h-80 flex-col justify-end overflow-hidden rounded-2xl bg-ink p-6 text-white sm:p-8">
            <MapGrid />
            <div className="relative">
              <span className="mb-5 inline-grid size-10 place-items-center rounded-[10px] bg-accent text-ink">
                <MapPin className="size-5" aria-hidden />
              </span>
              <p className="text-[14px] text-gray-400">Адрес склада</p>
              <p className="mt-1 max-w-[28ch] text-[24px] leading-tight font-semibold tracking-[-0.02em]">{company.address}</p>
              <a href={company.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-accent mt-6">
                Открыть в 2ГИС
                <ArrowUpRight className="size-4" aria-hidden />
                <span className="sr-only">(откроется в новой вкладке)</span>
              </a>
            </div>
          </div>

          <ul className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]">
            {rows.map(({ icon: Icon, label, display, href, copy }, n) => (
              <li
                key={href}
                className={`flex flex-1 items-center gap-4 px-5 py-5 ${n > 0 ? 'shadow-[inset_0_1px_0_rgb(0_0_0/0.06)]' : ''}`}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent-ink">
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] text-gray-500">{label}</span>
                  <a
                    href={href}
                    {...(href.startsWith('https:') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="block truncate text-[18px] font-medium tracking-[-0.01em] tabular-nums"
                  >
                    {display}
                  </a>
                </span>
                <CopyButton value={display} label={copy} />
              </li>
            ))}
            {company.hours && (
              <li className="flex flex-1 items-center gap-4 px-5 py-5 shadow-[inset_0_1px_0_rgb(0_0_0/0.06)]">
                <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent-ink">
                  <Clock className="size-[18px]" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] text-gray-500">Режим работы</span>
                  <span className="block text-[18px] font-medium tracking-[-0.01em] tabular-nums">{company.hours}</span>
                  {company.hoursNote && <span className="block text-[13px] text-gray-500">{company.hoursNote}</span>}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}

/** Декоративная «карта» — сетка улиц. Реальная карта открывается в 2ГИС. */
function MapGrid() {
  return (
    <svg aria-hidden className="absolute inset-0 size-full opacity-50" preserveAspectRatio="xMidYMid slice" viewBox="0 0 600 360">
      <defs>
        <pattern id="blocks" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M48 0H0v48" fill="none" stroke="#2a2a2a" strokeWidth="1" />
        </pattern>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.35" stopColor="#171717" stopOpacity="0" />
          <stop offset="1" stopColor="#171717" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width="600" height="360" fill="url(#blocks)" />
      <path d="M-20 230 C 120 210, 220 140, 360 130 S 560 70, 640 40" stroke="#333" strokeWidth="12" fill="none" />
      <path d="M150 -20 L 210 400" stroke="#333" strokeWidth="7" fill="none" />
      <path d="M440 -20 L 400 400" stroke="#2c2c2c" strokeWidth="5" fill="none" />
      <circle cx="372" cy="126" r="22" fill="#e0773a" opacity="0.2" />
      <circle cx="372" cy="126" r="8" fill="#e0773a" />
      <rect width="600" height="360" fill="url(#fade)" />
    </svg>
  )
}
