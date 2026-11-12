import { useEffect } from 'react'
import { Button, ConfigProvider, Form, Input } from 'antd'
import { Mail, MessageCircle, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { company, whatsappLink } from '../data/company'
import { PREFILL } from '../lib/bus'
import { antdDarkTheme } from '../theme'

interface Values {
  name: string
  phone?: string
  company?: string
  message: string
}

export default function RequestForm() {
  const [form] = Form.useForm<Values>()

  // «В заявку» / «Запросить цену» из поиска и каталога: дописываем строку в поле «Что нужно»
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const text = (e as CustomEvent<string>).detail
      const current = ((form.getFieldValue('message') as string | undefined) ?? '').trimEnd()
      const next = `${current ? current + '\n' : ''}${text} — `
      form.setFieldsValue({ message: next })
      const el = document.getElementById('message') as HTMLTextAreaElement | null
      if (el) {
        el.focus({ preventScroll: true })
        el.setSelectionRange(next.length, next.length)
      }
      toast('Добавлено в заявку', { description: `${text} — укажите размер и количество` })
    }
    window.addEventListener(PREFILL, onPrefill)
    return () => window.removeEventListener(PREFILL, onPrefill)
  }, [form])

  function onFinish(v: Values) {
    const lines = ['Здравствуйте! Заявка с сайта:', '', v.message.trim(), '', `Имя: ${v.name.trim()}`]
    if (v.phone?.trim()) lines.push(`Телефон: ${v.phone.trim()}`)
    if (v.company?.trim()) lines.push(`Компания: ${v.company.trim()}`)
    const url = whatsappLink(lines.join('\n'))

    // Телефон: открываем приложение в этой же вкладке. Компьютер: WhatsApp Web в новой вкладке,
    // а если браузер заблокировал её — переходим в этой.
    const touch = window.matchMedia('(pointer: coarse)').matches
    if (touch) {
      window.location.href = url
    } else {
      const w = window.open(url, '_blank')
      if (w) w.opener = null
      else window.location.href = url
    }
    toast.success('Открываем WhatsApp', {
      description: `Нажмите «Отправить» в чате. Если WhatsApp не открылся — позвоните ${company.phones[1].display}`,
      duration: 10000,
    })
  }

  return (
    <section id="request" aria-labelledby="request-title" className="bg-ink py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div>
          <p className="text-[14px] font-medium text-accent">Заявка</p>
          <h2 id="request-title" className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[2.5rem]">
            Пришлите список — подберём металл и рассчитаем стоимость
          </h2>
          <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-gray-400">
            Укажите марку, вид проката, размер и количество. Не уверены в марке — опишите задачу, подскажем.
          </p>

          <ul className="mt-10 flex flex-col gap-1">
            <li>
              <a
                href={whatsappLink('Здравствуйте! Пишу с сайта.')}
                target="_blank"
                rel="noopener noreferrer"
                className="-mx-3 flex items-center gap-3.5 rounded-xl px-3 py-2.5 transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/5"
              >
                <span className="grid size-10 place-items-center rounded-[10px] bg-white/6 text-accent">
                  <MessageCircle className="size-[18px]" aria-hidden />
                </span>
                <span>
                  <span className="block text-[17px] font-medium tabular-nums">{company.whatsapp.display}</span>
                  <span className="block text-[13px] text-gray-500">WhatsApp</span>
                </span>
              </a>
            </li>
            {company.phones.map((p) => (
              <li key={p.href}>
                <a
                  href={p.href}
                  className="-mx-3 flex items-center gap-3.5 rounded-xl px-3 py-2.5 transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/5"
                >
                  <span className="grid size-10 place-items-center rounded-[10px] bg-white/6 text-accent">
                    <Phone className="size-[18px]" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[17px] font-medium tabular-nums">{p.display}</span>
                    <span className="block text-[13px] text-gray-500">{p.label}</span>
                  </span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${company.email}`}
                className="-mx-3 flex items-center gap-3.5 rounded-xl px-3 py-2.5 transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/5"
              >
                <span className="grid size-10 place-items-center rounded-[10px] bg-white/6 text-accent">
                  <Mail className="size-[18px]" aria-hidden />
                </span>
                <span className="text-[17px] font-medium">{company.email}</span>
              </a>
            </li>
          </ul>
        </div>

        <ConfigProvider theme={antdDarkTheme}>
          <div className="rounded-2xl bg-ink-soft p-5 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06)] sm:p-7">
            <Form<Values>
              form={form}
              layout="vertical"
              requiredMark={false}
              onFinish={onFinish}
              onFinishFailed={() => toast.error('Проверьте поля формы')}
              scrollToFirstError={{ behavior: 'smooth', block: 'center', focus: true }}
              size="large"
            >
              <Form.Item
                name="message"
                label="Что нужно"
                rules={[{ required: true, whitespace: true, message: 'Опишите, что нужно' }]}
              >
                <Input.TextArea
                  autoSize={{ minRows: 4, maxRows: 10 }}
                  placeholder={'Например:\nЛист медный М1, 2 мм — 50 кг\nКруг Д16Т ⌀40 — 3 м'}
                />
              </Form.Item>
              <div className="grid gap-x-4 sm:grid-cols-2">
                <Form.Item name="name" label="Имя" rules={[{ required: true, whitespace: true, message: 'Укажите имя' }]}>
                  <Input autoComplete="name" />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label={<span>Телефон <span className="text-gray-500">— необязательно</span></span>}
                  rules={[
                    {
                      validator: (_, v: string | undefined) =>
                        !v || v.replace(/\D/g, '').length >= 10
                          ? Promise.resolve()
                          : Promise.reject(new Error('Например: 8 701 123 45 67')),
                    },
                  ]}
                >
                  <Input type="tel" inputMode="tel" autoComplete="tel" placeholder="8 (7__) ___-__-__" />
                </Form.Item>
              </div>
              <Form.Item name="company" label={<span>Компания <span className="text-gray-500">— необязательно</span></span>}>
                <Input autoComplete="organization" />
              </Form.Item>
              <Button type="primary" htmlType="submit" icon={<MessageCircle className="size-4" aria-hidden />} className="w-full sm:w-auto sm:px-7">
                Отправить в WhatsApp
              </Button>
              <p className="mt-3 text-[13px] text-gray-500">
                Откроется WhatsApp с готовым сообщением на номер {company.whatsapp.display} — останется нажать «Отправить».
              </p>
            </Form>
          </div>
        </ConfigProvider>
      </div>
    </section>
  )
}
