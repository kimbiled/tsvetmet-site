import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import clsx from 'clsx'
import { Input, Segmented } from 'antd'
import { ArrowRight, Phone, Search } from 'lucide-react'
import Swatch, { SwatchLabel } from './Swatch'
import { catalog, type Material } from '../data/catalog'
import { company } from '../data/company'
import { CATALOG, requestItem, type CatalogDetail } from '../lib/bus'
import { materialMatches as matches, norm } from '../lib/catalogSearch'

function gridCols(n: number) {
  if (n === 1) return ''
  if (n === 2) return 'sm:grid-cols-2'
  return 'sm:grid-cols-2 lg:grid-cols-3'
}

export default function Catalog() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const q = norm(query)

  // «Открыть каталог» из первого экрана: поиск по запросу или выбранная категория
  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<CatalogDetail>).detail
      if (d.query !== undefined) {
        setQuery(d.query)
        setCategory('all')
      } else if (d.category) {
        setQuery('')
        setCategory(d.category)
      }
    }
    window.addEventListener(CATALOG, onOpen)
    return () => window.removeEventListener(CATALOG, onOpen)
  }, [])

  const filtered = useMemo(
    () =>
      catalog
        .filter((c) => category === 'all' || c.id === category)
        .map((c) => ({ ...c, materials: c.materials.filter((m) => matches(m, q)) }))
        .filter((c) => c.materials.length),
    [q, category],
  )

  let index = 0

  return (
    <section id="catalog" aria-labelledby="catalog-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-[14px] font-medium text-accent-ink">Продукция</p>
          <h2 id="catalog-title" className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[2.5rem]">
            Виды проката и марки в наличии
          </h2>
          <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-gray-600">
            Ассортимент на складе постоянно пополняется. Размеры, количество и цену уточняйте у менеджера.
            {hasPhotos && ' Фотографии иллюстративные.'}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
            <Segmented
              value={category}
              onChange={(v) => setCategory(String(v))}
              options={[{ label: 'Все', value: 'all' }, ...catalog.map((c) => ({ label: c.short, value: c.id }))]}
              size="large"
              aria-label="Категория продукции"
            />
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            prefix={<Search className="mr-1 size-4 text-gray-400" aria-hidden />}
            placeholder="Марка или вид: Д16Т, AISI 304, шина"
            allowClear
            size="large"
            aria-label="Поиск по марке или виду проката"
            className="h-[46px] md:max-w-xs"
          />
        </div>

        <p className="sr-only" aria-live="polite">
          {q ? `Найдено групп: ${filtered.reduce((n, c) => n + c.materials.length, 0)}` : ''}
        </p>

        {/* key только по категории: смена вкладки анимируется, ввод в поиск — нет (действие с клавиатуры) */}
        <div key={category} className="mt-10">
          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-[var(--shadow-card)]">
              <p className="text-[17px] font-semibold tracking-[-0.01em]">По запросу «{query}» на сайте ничего нет</p>
              <p className="mx-auto mt-2 max-w-[48ch] text-gray-600">
                На сайте указана только часть ассортимента. Позвоните — проверим наличие на складе.
              </p>
              <a href={company.phones[1].href} className="btn btn-dark mt-6 tabular-nums">
                <Phone className="size-4" aria-hidden />
                {company.phones[1].display}
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-10 sm:gap-14">
              {filtered.map((cat) => (
                <div key={cat.id}>
                  <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <h3 className="text-[20px] font-semibold tracking-[-0.02em]">{cat.title}</h3>
                    <p className="text-[14px] text-gray-500 sm:max-w-md sm:text-right">{cat.lead}</p>
                  </div>
                  <ul className={clsx('grid gap-3', gridCols(cat.materials.length))}>
                    {cat.materials.map((m) => (
                      <MaterialCard key={m.id} m={m} q={q} wide={cat.materials.length === 1} index={index++} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {credits.length > 0 && (
          <p className="mt-10 text-[12px] leading-relaxed text-gray-500">
            Фото:{' '}
            {credits.map((m, n) => (
              <span key={m.id}>
                {n > 0 && '; '}
                {m.name.toLowerCase()} —{' '}
                <a href={m.credit!.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                  {m.credit!.author}
                </a>
                , {m.credit!.license}
              </span>
            ))}
.
          </p>
        )}
      </div>
    </section>
  )
}

const allMaterials = catalog.flatMap((c) => c.materials)
const hasPhotos = allMaterials.some((m) => m.image)
const credits = allMaterials.filter((m) => m.image && m.credit)

function MaterialCard({ m, q, wide, index }: { m: Material; q: string; wide: boolean; index: number }) {
  const hit = (v: string) => !!q && norm(v).includes(q)
  return (
    <li
      style={{ '--i': index } as CSSProperties}
      className={clsx(
        'swap-in flex gap-1 rounded-2xl bg-white p-1.5 shadow-[var(--shadow-card)]',
        wide ? 'flex-col md:flex-row' : 'flex-col',
      )}
    >
      <Swatch
        finish={m.finish}
        image={m.image}
        imagePosition={m.imagePosition}
        alt={m.name}
        className={clsx(
          'rounded-[12px]',
          m.image
            ? wide
              ? 'h-28 md:h-auto md:min-h-44 md:w-64 md:shrink-0'
              : 'h-24 sm:h-40'
            : wide
              ? 'h-14 md:h-auto md:w-56 md:shrink-0'
              : 'h-14 sm:h-40',
        )}
      >
        {m.symbol && <SwatchLabel>{m.symbol}</SwatchLabel>}
      </Swatch>

      <div className={clsx('flex flex-1 flex-col gap-5 p-3.5', wide && 'md:grid md:grid-cols-2 md:gap-8 md:p-5')}>
        <div>
          <h4 className="text-[17px] font-semibold tracking-[-0.01em]">{m.name}</h4>
          {m.forms.length === 0 && m.grades.length === 0 && (
            <p className="mt-2 text-[14px] text-gray-500">Наличие и размеры — по запросу</p>
          )}
          {m.forms.length > 0 && <p className="mt-3 mb-2 text-[12px] font-medium text-gray-500">Виды</p>}
          <ul className="flex flex-wrap gap-1.5">
            {m.forms.map((f) => (
              <li
                key={f}
                className={clsx(
                  'rounded-md px-2 py-1 text-[13px]',
                  hit(f) ? 'bg-accent-soft text-accent-ink shadow-[inset_0_0_0_1px_rgb(224_119_58/0.35)]' : 'bg-gray-100 text-gray-600',
                )}
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
        {m.grades.length > 0 && (
          <div className={clsx(wide && 'md:pt-9')}>
            <p className="mb-2 text-[12px] font-medium text-gray-500">Марки</p>
            <ul className="flex flex-wrap gap-1.5">
              {m.grades.map((g) => (
                <li
                  key={g}
                  className={clsx(
                    'rounded-md px-2 py-1 text-[13px] font-medium tabular-nums',
                    hit(g)
                      ? 'bg-accent-soft text-accent-ink shadow-[inset_0_0_0_1px_rgb(224_119_58/0.35)]'
                      : 'bg-white text-ink shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)]',
                  )}
                >
                  {g}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          type="button"
          onClick={() => requestItem(m.name)}
          className={clsx(
            'mt-auto inline-flex min-h-11 items-center gap-1.5 self-start text-[14px] font-medium text-accent-ink transition-transform duration-150 ease-out active:scale-[0.97]',
            wide && 'md:col-span-2',
          )}
        >
          Запросить цену
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </li>
  )
}
