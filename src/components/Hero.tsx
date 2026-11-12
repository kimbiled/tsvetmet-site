import { useMemo, useState, type CSSProperties } from 'react'
import { Input } from 'antd'
import { ArrowRight, Calculator, MapPin, Phone, Plus, Search } from 'lucide-react'
import Swatch from './Swatch'
import { catalog } from '../data/catalog'
import { company } from '../data/company'
import { openCatalog, requestItem } from '../lib/bus'
import { catalogHasMatch, categoryCount, plural, searchGrades } from '../lib/catalogSearch'

/** Индекс для каскада появления (70ms между элементами) */
const i = (n: number) => ({ '--i': n }) as CSSProperties

const popular = ['М1', 'Д16Т', 'AISI 304', 'ПОС 40', 'УОНИ']

export default function Hero() {
  return (
    <section id="top" className="relative">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 pb-16 sm:px-6 md:pt-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:pt-20 lg:pb-24">
        <div>
          <h1
            style={i(0)}
            className="enter text-[2.25rem] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-[3.5rem] lg:text-[4rem]"
          >
            Цветной и нержавеющий металлопрокат <span className="text-gray-500">со склада в Астане</span>
          </h1>
          <p style={i(1)} className="enter mt-6 max-w-[52ch] text-[17px] leading-relaxed text-gray-600">
            Более 20 лет на рынке. Цветной и нержавеющий прокат, технические материалы, припои, инструмент и электроды.
            Прямые поставки из России, документы по ГОСТ. Опт и розница — от одной позиции.
          </p>
          <div style={i(2)} className="enter mt-8 flex flex-col gap-2.5 sm:flex-row">
            <a href="#request" className="btn btn-dark h-12 px-5">
              Запросить цену и наличие
              <ArrowRight className="size-4" aria-hidden />
            </a>
            <a href={company.phones[1].href} className="btn btn-light h-12 px-5 tabular-nums">
              <Phone className="size-4 text-accent" aria-hidden />
              {company.phones[1].display}
            </a>
          </div>
          <a
            style={i(3)}
            href={company.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="enter link-hover mt-6 inline-flex min-h-11 items-center gap-2 text-[14px] text-gray-600"
          >
            <MapPin className="size-4 shrink-0 text-accent" aria-hidden />
            <span>
              Склад: ул. Жетиген, 26, база «Агромост»
              {company.hours && <span className="text-gray-500 tabular-nums"> · {company.hours}</span>}
            </span>
            <span className="sr-only">(откроется 2ГИС в новой вкладке)</span>
          </a>
        </div>

        <div style={i(3)} className="enter relative z-20">
          <StockCheck />
        </div>
      </div>
    </section>
  )
}

/** Карточка «Проверить наличие марки»: поиск, подсказки, разделы каталога. */
function StockCheck() {
  const [query, setQuery] = useState('')
  const hits = useMemo(() => searchGrades(query), [query])
  const inCatalog = useMemo(() => catalogHasMatch(query), [query])

  const add = (text: string) => {
    requestItem(text)
    setQuery('')
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[var(--shadow-float)] sm:p-6">
      <p className="text-[15px] font-medium">Проверить наличие марки</p>

      <div className="relative mt-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          prefix={<Search className="mr-1.5 size-[18px] text-gray-400" aria-hidden />}
          placeholder="Марка, например Д16Т"
          allowClear
          size="large"
          aria-label="Поиск марки"
          className="h-12"
        />

        {/* Результаты появляются без анимации: их вызывает ввод с клавиатуры */}
        {query.trim() && (
          <div className="absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-xl bg-white shadow-[var(--shadow-float)]">
            {hits.length > 0 || inCatalog ? (
              <ul>
                {hits.map((r, n) => (
                  <li key={r.grade + r.material} className={n ? 'shadow-[inset_0_1px_0_rgb(0_0_0/0.06)]' : ''}>
                    <button
                      type="button"
                      onClick={() => add(r.grade === r.material ? r.material : `${r.grade} (${r.material})`)}
                      className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-gray-100"
                    >
                      <Swatch finish={r.finish} image={r.image} className="size-8 shrink-0 rounded-md" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-medium tabular-nums">{r.grade}</span>
                        <span className="block truncate text-[13px] text-gray-500">
                          {[r.grade !== r.material && r.material, r.forms.slice(0, 4).join(', ').toLowerCase()]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1 text-[13px] font-medium text-accent-ink">
                        <Plus className="size-3.5" aria-hidden />В заявку
                      </span>
                    </button>
                  </li>
                ))}
                {inCatalog && (
                  <li className={hits.length ? 'shadow-[inset_0_1px_0_rgb(0_0_0/0.06)]' : ''}>
                    <button
                      type="button"
                      onClick={() => openCatalog({ query })}
                      className="flex min-h-11 w-full items-center justify-between px-3.5 text-[14px] text-gray-600 transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-gray-100"
                    >
                      Все совпадения в каталоге
                      <ArrowRight className="size-4" aria-hidden />
                    </button>
                  </li>
                )}
              </ul>
            ) : (
              <div className="flex items-center justify-between gap-3 px-3.5 py-3">
                <span className="text-[14px] text-gray-600">На сайте нет «{query}» — уточним наличие по телефону</span>
                <a href={company.phones[1].href} className="btn btn-dark h-9 shrink-0 px-3 text-[13px]">
                  <Phone className="size-3.5" aria-hidden />
                  Позвонить
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="py-1 pr-1 text-[13px] text-gray-500">Часто ищут:</span>
        {popular.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setQuery(p)}
            className="relative rounded-full bg-white px-3 py-1 text-[13px] shadow-[var(--shadow-ring)] transition-[transform,box-shadow] duration-150 ease-out before:absolute before:inset-x-0 before:-inset-y-2 before:content-[''] active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_0_0_1px_rgb(0_0_0/0.18)]"
          >
            {p}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-1 pt-4 shadow-[inset_0_1px_0_rgb(0_0_0/0.06)]">
        {catalog.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => openCatalog({ category: c.id })}
            className="flex min-h-11 items-center gap-2.5 rounded-lg px-2 text-left transition-[transform,background-color] duration-150 ease-out active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-gray-100"
          >
            <Swatch finish={c.materials[0].finish} image={c.materials[0].image} className="size-6 shrink-0 rounded-md" />
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-medium">{c.short}</span>
              <span className="block text-[12px] text-gray-500 tabular-nums">
                {plural(categoryCount(c), ['позиция', 'позиции', 'позиций'])}
              </span>
            </span>
          </button>
        ))}
      </div>

      <a
        href="#calculator"
        className="mt-3 flex min-h-11 items-center justify-between rounded-lg px-2 text-[14px] text-gray-600 transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-gray-100 [@media(hover:hover)_and_(pointer:fine)]:hover:text-ink"
      >
        <span className="flex items-center gap-2.5">
          <Calculator className="size-[18px] text-accent" aria-hidden />
          Посчитать вес по размерам
        </span>
        <ArrowRight className="size-4" aria-hidden />
      </a>
    </div>
  )
}
