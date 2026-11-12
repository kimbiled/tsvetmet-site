import { Building2, Factory, User } from 'lucide-react'

const clients = [
  { icon: Factory, title: 'Производственные предприятия', text: 'Регулярные и крупные оптовые поставки' },
  { icon: Building2, title: 'Организации', text: 'Комплексные поставки под проект' },
  { icon: User, title: 'Частные клиенты', text: 'Розница — от одной позиции' },
]

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-white py-20 shadow-[0_-1px_0_rgb(0_0_0/0.06)] sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <div>
          <p className="text-[14px] font-medium text-accent-ink">О компании</p>
          <h2 id="about-title" className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[2.5rem]">
            Надёжный поставщик металлопроката и промышленных материалов
          </h2>
          <div className="mt-6 max-w-[65ch] space-y-4 text-[16px] leading-[1.7] text-gray-600">
            <p>
              <span className="font-medium text-ink">ИП «ПО ЦВЕТМЕТ»</span> — поставщик металлопроката и промышленных
              материалов в Астане с более чем 20-летним опытом работы на рынке. Мы специализируемся на поставках
              цветного и нержавеющего металлопроката, а также полимерных материалов и промышленного инструмента.
            </p>
            <p>
              Осуществляем прямые поставки продукции из России и располагаем собственным крупным складом в Астане. Это
              позволяет поддерживать широкий ассортимент и оперативно обеспечивать потребности клиентов.
            </p>
            <p>
              Продукция сопровождается сертификатами качества и документами, подтверждающими соответствие требованиям
              ГОСТ. Мы стремимся к долгосрочным отношениям с клиентами: качественная продукция, надёжные поставки и
              профессиональный подход к каждому заказу.
            </p>
          </div>
        </div>

        <div className="self-start rounded-2xl bg-page p-2 shadow-[var(--shadow-ring)]">
          <div className="px-4 pt-4 pb-3">
            <h3 className="text-[17px] font-semibold tracking-[-0.01em]">С кем работаем</h3>
            <p className="mt-1 text-[14px] text-gray-500">Заказы любого объёма, включая крупный опт.</p>
          </div>
          <ul className="flex flex-col gap-1">
            {clients.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-3.5 rounded-xl bg-white p-3.5 shadow-[var(--shadow-card)]">
                <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent-ink">
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <span>
                  <span className="block text-[15px] font-medium">{title}</span>
                  <span className="block text-[13px] text-gray-500">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
