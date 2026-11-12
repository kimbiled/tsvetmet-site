import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Drawer } from 'antd'
import { ArrowRight, Menu, MessageCircle, Phone, X } from 'lucide-react'
import Logo from './Logo'
import { company, whatsappLink } from '../data/company'

const nav = [
  { href: '#catalog', label: 'Продукция' },
  { href: '#contacts', label: 'Контакты' },
  { href: '#about', label: 'О компании' },
  { href: '#requisites', label: 'Реквизиты' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const mobile = company.phones[1]

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 bg-page/80 backdrop-blur-md transition-shadow duration-200',
        scrolled ? 'shadow-[0_1px_0_rgb(0_0_0/0.08)]' : 'shadow-[0_1px_0_transparent]',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" aria-label="ПО ЦВЕТМЕТ — на главную" className="rounded-md">
          <Logo />
        </a>

        <nav aria-label="Основное меню" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="link-hover rounded-md px-3 py-2 text-[14px] text-gray-600">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={mobile.href}
            className="link-hover hidden items-center gap-2 rounded-md px-2 py-2 text-[14px] font-medium text-gray-600 tabular-nums md:inline-flex"
          >
            <Phone className="size-4 text-accent" aria-hidden />
            {mobile.display}
          </a>
          <a href="#request" className="btn btn-dark hidden h-9 px-3.5 text-[14px] sm:inline-flex">
            Оставить заявку
          </a>
          <a
            href={mobile.href}
            aria-label={`Позвонить: ${mobile.display}`}
            className="grid size-11 place-items-center rounded-lg transition-transform duration-150 ease-out active:scale-[0.97] md:hidden"
          >
            <Phone className="size-5 text-accent" aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-label="Открыть меню"
            className="grid size-11 place-items-center rounded-lg text-ink transition-transform duration-150 ease-out active:scale-[0.97] lg:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="right"
        size={320}
        closable={false}
        styles={{ body: { padding: 0 } }}
        title={null}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-5 shadow-[0_1px_0_rgb(0_0_0/0.06)]">
            <Logo />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Закрыть меню"
              className="grid size-11 place-items-center rounded-lg text-gray-500 transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <nav aria-label="Мобильное меню" className="flex-1 px-3 py-3">
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center justify-between rounded-lg px-3 text-[16px] text-ink active:bg-gray-100"
                  >
                    {item.label}
                    <ArrowRight className="size-4 text-gray-400" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-2 p-5 shadow-[0_-1px_0_rgb(0_0_0/0.06)]">
            {company.phones.map((p) => (
              <a key={p.href} href={p.href} className="btn btn-light justify-start tabular-nums">
                <Phone className="size-4 text-accent" aria-hidden />
                {p.display}
              </a>
            ))}
            <a
              href={whatsappLink('Здравствуйте! Пишу с сайта.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-light justify-start"
            >
              <MessageCircle className="size-4 text-accent" aria-hidden />
              Написать в WhatsApp
            </a>
            <a href="#request" onClick={() => setOpen(false)} className="btn btn-dark">
              Оставить заявку
            </a>
          </div>
        </div>
      </Drawer>
    </header>
  )
}
