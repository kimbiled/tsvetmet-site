import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { Input, Segmented, Select } from 'antd'
import { ArrowRight, Copy } from 'lucide-react'
import { copyText } from './CopyButton'
import { requestItem } from '../lib/bus'
import { kg, massKg, materials, num, parseNum, shapes, type ShapeId } from '../lib/metalWeight'

type Unit = 'мм' | 'м'

/** Размеры по умолчанию для каждого вида — сразу показывают пример расчёта */
const defaultDims: Record<ShapeId, Record<string, string>> = {
  sheet: { t: '2', w: '1000' },
  strip: { t: '10', w: '100' },
  round: { d: '40' },
  wire: { d: '2' },
  hex: { s: '24' },
  square: { a: '20' },
  pipe: { D: '40', s: '2' },
  bushing: { D: '60', d: '40' },
  angle: { a: '40', b: '40', t: '4' },
}

const defaultLength = (id: ShapeId): { value: string; unit: Unit } =>
  id === 'sheet' ? { value: '2000', unit: 'мм' } : id === 'bushing' ? { value: '100', unit: 'мм' } : { value: '3', unit: 'м' }

const options = materials.map((g) => ({
  label: g.name,
  title: g.name,
  options: g.alloys.map((a) => ({
    value: `${g.id}:${a.grade}`,
    search: `${a.grade} ${g.name}`.toLowerCase(),
    label: (
      <span>
        {a.grade} <span className="text-gray-500">· {g.name.toLowerCase()}</span>
      </span>
    ),
  })),
}))

export default function WeightCalculator() {
  const [alloyKey, setAlloyKey] = useState('aluminium:Д16Т')
  const [shapeId, setShapeId] = useState<ShapeId>('round')
  const [dims, setDims] = useState(defaultDims)
  const [lengths, setLengths] = useState(() =>
    Object.fromEntries(shapes.map((s) => [s.id, defaultLength(s.id)])) as Record<ShapeId, { value: string; unit: Unit }>,
  )
  const [qty, setQty] = useState('1')
  const [reverseKg, setReverseKg] = useState('')

  const shape = shapes.find((s) => s.id === shapeId)!
  const [groupId, grade] = alloyKey.split(':')
  const alloy = materials.find((g) => g.id === groupId)!.alloys.find((a) => a.grade === grade)!
  const len = lengths[shapeId]

  const calc = useMemo(() => {
    const d = Object.fromEntries(shape.fields.map((f) => [f.key, parseNum(dims[shapeId][f.key] ?? '')]))
    const lengthRaw = parseNum(len.value)
    const count = parseNum(qty)
    const filled = [...Object.values(d), lengthRaw, count].every((v) => Number.isFinite(v) && v > 0)
    if (!filled) return { ok: false as const, error: null }
    const error = shape.check?.(d) ?? null
    if (error) return { ok: false as const, error }
    const lengthMm = len.unit === 'м' ? lengthRaw * 1000 : lengthRaw
    const area = shape.area(d)
    const piece = massKg(area, lengthMm, alloy.density)
    const pieces = Math.round(count)
    return {
      ok: true as const,
      d,
      lengthLabel: `${num(lengthRaw, 3)} ${len.unit}`,
      pieces,
      piece,
      total: piece * pieces,
      // лист: вес 1 м² = толщина (мм) × плотность; остальное: вес 1 погонного метра
      unitMass: shape.perSquareMeter ? d.t * alloy.density : massKg(area, 1000, alloy.density),
    }
  }, [shape, dims, shapeId, len, qty, alloy])

  const reverse = parseNum(reverseKg)
  const reverseMeters = calc.ok && !shape.perSquareMeter && reverse > 0 ? reverse / calc.unitMass : null

  const line = calc.ok
    ? `${shape.label(calc.d, alloy.grade)}, длина ${calc.lengthLabel} — ${calc.pieces} шт (≈ ${kg(calc.total)} кг)`
    : ''

  const setDim = (key: string, value: string) => setDims((all) => ({ ...all, [shapeId]: { ...all[shapeId], [key]: value } }))

  const setUnit = (unit: Unit) =>
    setLengths((all) => {
      const cur = all[shapeId]
      if (cur.unit === unit) return all
      const v = parseNum(cur.value)
      const value = Number.isFinite(v) ? String(+(unit === 'м' ? v / 1000 : v * 1000).toFixed(4)).replace('.', ',') : cur.value
      return { ...all, [shapeId]: { value, unit } }
    })

  const invalid = (v: string) => v.trim() !== '' && !(parseNum(v) > 0)

  return (
    <section id="calculator" aria-labelledby="calc-title" className="bg-white py-20 shadow-[0_-1px_0_rgb(0_0_0/0.06)] sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-[14px] font-medium text-accent-ink">Калькулятор</p>
        <h2 id="calc-title" className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[2.5rem]">
          Калькулятор веса металлопроката
        </h2>
        <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-gray-600">
          Теоретическая масса по марке и размерам — для заявки, сметы и расчёта доставки.
        </p>

        <div className="mt-10 grid items-start gap-3 lg:grid-cols-[1.45fr_1fr]">
          {/* Ввод */}
          <div className="rounded-2xl bg-page p-4 shadow-[var(--shadow-ring)] sm:p-6">
            <label htmlFor="calc-material" className="mb-1.5 block text-[14px] font-medium">
              Материал и марка
            </label>
            <Select
              id="calc-material"
              value={alloyKey}
              onChange={setAlloyKey}
              options={options}
              showSearch
              filterOption={(input, option) => String((option as { search?: string })?.search ?? '').includes(input.toLowerCase())}
              size="large"
              className="w-full"
              listHeight={320}
            />

            <fieldset className="mt-6">
              <legend className="mb-2 text-[14px] font-medium">Вид проката</legend>
              <div className="grid grid-cols-3 gap-2">
                {shapes.map((s) => (
                  <label key={s.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="calc-shape"
                      value={s.id}
                      checked={s.id === shapeId}
                      onChange={() => {
                        setShapeId(s.id)
                        setReverseKg('')
                      }}
                      className="peer sr-only"
                    />
                    <span
                      className={clsx(
                        'flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-xl bg-white px-1.5 py-2 text-center text-[13px] leading-tight shadow-[var(--shadow-ring)] transition-[transform,box-shadow,color] duration-150 ease-out active:scale-[0.97]',
                        'peer-checked:bg-accent-soft peer-checked:text-accent-ink peer-checked:shadow-[inset_0_0_0_1.5px_rgb(224_119_58/0.7)]',
                        'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent',
                        '[@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_0_0_1px_rgb(0_0_0/0.18)]',
                      )}
                    >
                      <ShapeIcon id={s.id} />
                      {s.name}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-4">
              {shape.fields.map((f) => (
                <div key={f.key} className={clsx(shape.fields.length === 3 && f.key === 't' && 'col-span-2 sm:col-span-1')}>
                  <label htmlFor={`calc-${f.key}`} className="mb-1.5 block text-[14px] font-medium">
                    {f.label}
                  </label>
                  <Input
                    id={`calc-${f.key}`}
                    value={dims[shapeId][f.key] ?? ''}
                    onChange={(e) => setDim(f.key, e.target.value)}
                    inputMode="decimal"
                    autoComplete="off"
                    suffix={<span className="text-gray-400">мм</span>}
                    status={invalid(dims[shapeId][f.key] ?? '') ? 'error' : undefined}
                    size="large"
                    className="tabular-nums"
                  />
                </div>
              ))}

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <label htmlFor="calc-length" className="text-[14px] font-medium">
                    Длина
                  </label>
                  <Segmented
                    size="small"
                    value={len.unit}
                    onChange={(v) => setUnit(v as Unit)}
                    options={['мм', 'м']}
                    aria-label="Единица длины"
                  />
                </div>
                <Input
                  id="calc-length"
                  value={len.value}
                  onChange={(e) => setLengths((all) => ({ ...all, [shapeId]: { ...all[shapeId], value: e.target.value } }))}
                  inputMode="decimal"
                  autoComplete="off"
                  suffix={<span className="text-gray-400">{len.unit}</span>}
                  status={invalid(len.value) ? 'error' : undefined}
                  size="large"
                  className="tabular-nums"
                />
              </div>
              <div>
                <label htmlFor="calc-qty" className="mb-1.5 block text-[14px] font-medium">
                  Количество
                </label>
                <Input
                  id="calc-qty"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  inputMode="numeric"
                  autoComplete="off"
                  suffix={<span className="text-gray-400">шт</span>}
                  status={invalid(qty) ? 'error' : undefined}
                  size="large"
                  className="tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Результат — без анимации: меняется при каждом нажатии клавиши */}
          <div className="rounded-2xl bg-ink p-5 text-white sm:p-6 lg:sticky lg:top-24" aria-live="polite">
            <p className="text-[14px] text-gray-400">Теоретическая масса</p>
            <p className="mt-1 flex items-baseline gap-2 tabular-nums">
              <span className="text-[44px] leading-none font-semibold tracking-[-0.03em]">{calc.ok ? kg(calc.total) : '—'}</span>
              <span className="text-[20px] text-gray-400">кг</span>
            </p>
            {calc.ok ? (
              <p className="mt-2 text-[14px] text-gray-400">{line.split(' — ')[0]}</p>
            ) : (
              <p className={clsx('mt-2 text-[14px]', calc.error ? 'text-[#f0a274]' : 'text-gray-400')}>
                {calc.error ?? 'Введите размеры, длину и количество'}
              </p>
            )}

            <dl className="mt-5 text-[14px]">
              {[
                ['1 шт', calc.ok ? `${kg(calc.piece)} кг` : '—'],
                [shape.perSquareMeter ? '1 м²' : '1 м', calc.ok ? `${kg(calc.unitMass)} кг` : '—'],
                [`Плотность ${alloy.grade}`, `${num(alloy.density)} г/см³`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]">
                  <dt className="text-gray-400">{k}</dt>
                  <dd className="font-medium tabular-nums">{v}</dd>
                </div>
              ))}
              {!shape.perSquareMeter && (
                <div className="flex items-center justify-between gap-3 py-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]">
                  <dt>
                    <label htmlFor="calc-reverse" className="text-gray-400">
                      Длина в
                    </label>
                  </dt>
                  <dd className="flex items-center gap-2 tabular-nums">
                    <span className="relative">
                      <input
                        id="calc-reverse"
                        value={reverseKg}
                        onChange={(e) => setReverseKg(e.target.value)}
                        inputMode="decimal"
                        autoComplete="off"
                        placeholder="100"
                        className="h-10 w-24 rounded-lg bg-white/6 pr-8 pl-3 text-[16px] text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)] outline-none transition-shadow duration-150 placeholder:text-gray-600 focus:shadow-[inset_0_0_0_1.5px_var(--color-accent)]"
                      />
                      <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[13px] text-gray-500">кг</span>
                    </span>
                    <span className="min-w-[4.5rem] text-right font-medium">
                      {reverseMeters ? `≈ ${num(reverseMeters, reverseMeters < 10 ? 2 : 1)} м` : '— м'}
                    </span>
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
              <button
                type="button"
                disabled={!calc.ok}
                onClick={() => requestItem(line, { complete: true })}
                className="btn btn-accent h-11 disabled:pointer-events-none disabled:opacity-40 sm:flex-1 lg:flex-none xl:flex-1"
              >
                Добавить в заявку
                <ArrowRight className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                disabled={!calc.ok}
                onClick={() => copyText(`${line}\nПлотность ${alloy.grade}: ${num(alloy.density)} г/см³`, 'Расчёт скопирован')}
                className="btn btn-ghost-dark h-11 disabled:pointer-events-none disabled:opacity-40"
              >
                <Copy className="size-4" aria-hidden />
                Скопировать
              </button>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-gray-500">
              Масса теоретическая, по справочной плотности. Фактический вес зависит от допусков проката.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Сечения проката — простые иконки 28×28 */
function ShapeIcon({ id }: { id: ShapeId }) {
  const common = { fill: 'currentColor', fillOpacity: 0.14, stroke: 'currentColor', strokeWidth: 1.5 }
  return (
    <svg viewBox="0 0 28 28" className="size-7" aria-hidden>
      {id === 'sheet' && <rect x="3" y="10" width="22" height="8" rx="1" {...common} />}
      {id === 'strip' && <rect x="3" y="12" width="22" height="4" rx="0.5" {...common} />}
      {id === 'round' && <circle cx="14" cy="14" r="10" {...common} />}
      {id === 'wire' && (
        <>
          <circle cx="14" cy="14" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.5" />
          <circle cx="14" cy="14" r="3.5" {...common} />
        </>
      )}
      {id === 'hex' && <polygon points="14,3 23.5,8.5 23.5,19.5 14,25 4.5,19.5 4.5,8.5" {...common} />}
      {id === 'square' && <rect x="5" y="5" width="18" height="18" rx="1" {...common} />}
      {id === 'pipe' && <path d="M14 4a10 10 0 1 1 0 20a10 10 0 1 1 0-20Zm0 2.5a7.5 7.5 0 1 0 0 15a7.5 7.5 0 1 0 0-15Z" fillRule="evenodd" {...common} />}
      {id === 'bushing' && <path d="M14 4a10 10 0 1 1 0 20a10 10 0 1 1 0-20Zm0 5a5 5 0 1 0 0 10a5 5 0 1 0 0-10Z" fillRule="evenodd" {...common} />}
      {id === 'angle' && <path d="M5 4h5v14h13v5H5Z" {...common} />}
    </svg>
  )
}
