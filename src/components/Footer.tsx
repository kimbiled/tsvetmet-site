import Logo from './Logo'
import { company, whatsappLink } from '../data/company'

export default function Footer() {
  return (
    <footer className="bg-ink-deep text-gray-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo tone="light" />
          <p className="mt-4 text-[14px] leading-relaxed">
            Цветной и нержавеющий металлопрокат, полимерные материалы и промышленный инструмент. Опт и розница.
          </p>
        </div>
        <div className="grid gap-1.5 text-[14px]">
          <p className="font-medium text-white">{company.name}</p>
          <p>{company.address}</p>
          {company.phones.map((p) => (
            <a key={p.href} href={p.href} className="tabular-nums transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:text-white">
              {p.display}
            </a>
          ))}
          <a
            href={whatsappLink('Здравствуйте! Пишу с сайта.')}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:text-white"
          >
            WhatsApp: {company.whatsapp.display}
          </a>
          <a href={`mailto:${company.email}`} className="transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:text-white">
            {company.email}
          </a>
          <p>
            {company.hours}. {company.hoursNote}
          </p>
        </div>
      </div>
      <div className="shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]">
        <p className="mx-auto max-w-6xl px-4 py-5 text-[12px] text-gray-500 sm:px-6">
          © {new Date().getFullYear()} {company.name}. Информация на сайте не является публичной офертой.
        </p>
      </div>
    </footer>
  )
}
