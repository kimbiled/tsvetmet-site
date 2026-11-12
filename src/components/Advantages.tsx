import { ArrowRight, Award, Boxes, FileCheck2, Handshake, Layers, Truck, Warehouse } from 'lucide-react'

const items = [
  { icon: Award, title: 'Более 20 лет на рынке', text: 'Опыт, проверенные поставщики и стабильная репутация.' },
  { icon: Warehouse, title: 'Крупный склад в Астане', text: 'Собственные складские площади — отгрузка без ожидания.' },
  { icon: Boxes, title: 'Широкий ассортимент', text: 'Цветной и нержавеющий прокат, полимеры, инструмент — в наличии.' },
  { icon: Truck, title: 'Прямые поставки из России', text: 'Работаем напрямую, без лишних посредников.' },
  { icon: Handshake, title: 'Опт и розница', text: 'Одинаково внимательно к заводу и к частному мастеру.' },
  { icon: Layers, title: 'Крупные объёмы и заказы под задачу', text: 'Комплексные поставки и индивидуальные позиции.' },
  { icon: FileCheck2, title: 'Документы по ГОСТ', text: 'Сертификаты качества на реализуемую продукцию.' },
]

export default function Advantages() {
  return (
    <section id="advantages" aria-labelledby="adv-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-[14px] font-medium text-accent-ink">Преимущества</p>
        <h2 id="adv-title" className="mt-2 max-w-2xl text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[2.5rem]">
          Почему с нами удобно работать
        </h2>

        <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }, n) => (
            <li key={title} className="flex flex-col rounded-2xl bg-white p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-[10px] bg-accent-soft text-accent-ink">
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <span className="text-[12px] text-gray-400 tabular-nums">{String(n + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-5 text-[16px] font-semibold tracking-[-0.01em]">{title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-gray-500">{text}</p>
            </li>
          ))}
          <li className="flex flex-col justify-between rounded-2xl bg-ink p-5 text-white">
            <p className="text-[16px] font-semibold tracking-[-0.01em]">Нужна консультация по марке или размеру?</p>
            <a href="#request" className="btn btn-accent mt-6 h-10 self-start px-4 text-[14px]">
              Задать вопрос
              <ArrowRight className="size-4" aria-hidden />
            </a>
          </li>
        </ol>
      </div>
    </section>
  )
}
