import { useId, useMemo, useState, type ReactNode } from 'react'
import clsx from 'clsx'
import { Input } from 'antd'
import { ArrowRight, Copy } from 'lucide-react'
import { copyText } from './CopyButton'
import { requestItem } from '../lib/bus'
import { kg, massKg, metals, num, parseNum, shapes, type ShapeId } from '../lib/metalWeight'

/** Подсказки в пустых полях — типовые размеры */
const examples: Record<ShapeId, Record<string, string>> = {
  sheet: { a: '2', b: '1000' },
  busbar: { a: '10', b: '100' },
  round: { d: '40' },
  hex: { s: '24' },
  square: { a: '20' },
  pipe: { d: '40', t: '2' },
  profile: { a: '40', h: '20', t: '2' },
  wire: { d: '2' },
  angle: { a: '40', b: '40', t: '4' },
  plate: { a: '20', b: '1000' },
}

export default function WeightCalculator() {
  const [shapeId, setShapeId] = useState<ShapeId>('sheet')
  const [metalId, setMetalId] = useState('aluminium')
  const [grade, setGrade] = useState('Д16Т')
  const [dims, setDims] = useState<Record<ShapeId, Record<string, string>>>(
    () => Object.fromEntries(shapes.map((s) => [s.id, {}])) as Record<ShapeId, Record<string, string>>,
  )
  const [length, setLength] = useState('')
  const [qty, setQty] = useState('1')

  const shape = shapes.find((s) => s.id === shapeId)!
  const metal = metals.find((m) => m.id === metalId)!
  const alloy = metal.alloys.find((a) => a.grade === grade) ?? metal.alloys[0]

  const calc = useMemo(() => {
    const d = Object.fromEntries(shape.fields.map((f) => [f.key, parseNum(dims[shapeId][f.key] ?? '')]))
    const L = parseNum(length)
    const count = parseNum(qty)
    if (![...Object.values(d), L, count].every((v) => Number.isFinite(v) && v > 0)) return { ok: false as const, error: null }
    const error = shape.check?.(d) ?? null
    if (error) return { ok: false as const, error }
    const area = shape.area(d)
    const pieces = Math.round(count)
    const piece = massKg(area, L, alloy.density)
    return {
      ok: true as const,
      label: `${shape.label(d, alloy.grade)}, длина ${num(L, 3)} м`,
      pieces,
      total: piece * pieces,
      perMeter: massKg(area, 1, alloy.density),
    }
  }, [shape, shapeId, dims, length, qty, alloy])

  const line = calc.ok ? `${calc.label} — ${calc.pieces} шт (≈ ${kg(calc.total)} кг)` : ''
  const invalid = (v: string) => v.trim() !== '' && !(parseNum(v) > 0)

  const pickMetal = (id: string) => {
    setMetalId(id)
    setGrade(metals.find((m) => m.id === id)!.alloys[0].grade)
  }

  return (
    <section id="calculator" aria-labelledby="calc-title" className="bg-white py-20 shadow-[0_-1px_0_rgb(0_0_0/0.06)] sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-[14px] font-medium text-accent-ink">Калькулятор</p>
        <h2 id="calc-title" className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[2.5rem]">
          Калькулятор металлопроката
        </h2>
        <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-gray-600">
          Теоретический вес цветного металла и нержавейки: выберите тип проката, металл и введите размеры.
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]">
          <div className="grid lg:grid-cols-[1.4fr_1fr_1fr]">
            {/* 1. Тип проката + чертёж */}
            <div className="p-4 sm:p-6">
              <Step n={1}>Тип проката</Step>
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_200px] lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_190px]">
                <div role="radiogroup" aria-label="Тип проката" className="grid grid-cols-2 gap-0.5 sm:grid-cols-1">
                  {shapes.map((s) => (
                    <Radio key={s.id} name="calc-shape" checked={s.id === shapeId} onChange={() => setShapeId(s.id)}>
                      {s.name}
                    </Radio>
                  ))}
                </div>
                <div className="grid h-36 place-items-center self-start rounded-xl bg-page p-2 shadow-[var(--shadow-ring)] sm:sticky sm:top-24 sm:aspect-[4/3] sm:h-auto">
                  <Drawing id={shapeId} />
                </div>
              </div>
            </div>

            {/* 2. Металл и марка */}
            <div className="p-4 shadow-[inset_0_1px_0_rgb(0_0_0/0.06)] sm:p-6 lg:shadow-[inset_1px_0_0_rgb(0_0_0/0.06)]">
              <Step n={2}>Металл</Step>
              <div role="radiogroup" aria-label="Металл" className="grid grid-cols-2 gap-0.5 sm:grid-cols-1">
                {metals.map((m) => (
                  <Radio key={m.id} name="calc-metal" checked={m.id === metalId} onChange={() => pickMetal(m.id)}>
                    {m.name}
                  </Radio>
                ))}
              </div>
              <p className="mt-5 mb-2 text-[13px] font-medium text-gray-500">Марка</p>
              <div role="radiogroup" aria-label="Марка" className="flex flex-wrap gap-1.5">
                {metal.alloys.map((a) => (
                  <label
                    key={a.grade}
                    className="relative inline-flex min-h-9 cursor-pointer items-center rounded-lg bg-white px-3 text-[14px] font-medium shadow-[var(--shadow-ring)] transition-[transform,background-color,color] duration-150 ease-out before:absolute before:inset-x-0 before:-inset-y-1 before:content-[''] active:scale-[0.97] has-checked:bg-ink has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
                  >
                    <input
                      type="radio"
                      name="calc-grade"
                      checked={a.grade === alloy.grade}
                      onChange={() => setGrade(a.grade)}
                      className="sr-only"
                    />
                    {a.grade}
                  </label>
                ))}
              </div>
              <p className="mt-3 text-[13px] text-gray-500 tabular-nums">Плотность {num(alloy.density)} г/см³</p>
            </div>

            {/* 3. Размеры */}
            <div className="p-4 shadow-[inset_0_1px_0_rgb(0_0_0/0.06)] sm:p-6 lg:shadow-[inset_1px_0_0_rgb(0_0_0/0.06)]">
              <Step n={3}>Размеры</Step>
              <div className="grid grid-cols-2 gap-x-3 gap-y-4 lg:grid-cols-1">
                {shape.fields.map((f) => (
                  <Field key={f.key} id={`calc-${f.key}`} label={<><Letter>{f.letter}</Letter> {f.label}, мм</>}>
                    <Input
                      id={`calc-${f.key}`}
                      value={dims[shapeId][f.key] ?? ''}
                      onChange={(e) => setDims((all) => ({ ...all, [shapeId]: { ...all[shapeId], [f.key]: e.target.value } }))}
                      placeholder={examples[shapeId][f.key]}
                      inputMode="decimal"
                      autoComplete="off"
                      status={invalid(dims[shapeId][f.key] ?? '') ? 'error' : undefined}
                      size="large"
                      className="tabular-nums"
                    />
                  </Field>
                ))}
                <Field id="calc-length" label="Длина, м">
                  <Input
                    id="calc-length"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="3"
                    inputMode="decimal"
                    autoComplete="off"
                    status={invalid(length) ? 'error' : undefined}
                    size="large"
                    className="tabular-nums"
                  />
                </Field>
                <Field id="calc-qty" label="Количество, шт">
                  <Input
                    id="calc-qty"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    inputMode="numeric"
                    autoComplete="off"
                    status={invalid(qty) ? 'error' : undefined}
                    size="large"
                    className="tabular-nums"
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Итог — без анимации: меняется при каждом нажатии клавиши */}
          <div className="flex flex-col gap-4 bg-ink px-4 py-5 text-white sm:px-6 md:flex-row md:items-center md:justify-between" aria-live="polite">
            <div className="min-w-0">
              <p className="text-[14px] text-gray-400">Вес (теоретический)</p>
              <p className="mt-0.5 flex items-baseline gap-2 tabular-nums">
                <span className="text-[40px] leading-none font-semibold tracking-[-0.03em]">{calc.ok ? kg(calc.total) : '0'}</span>
                <span className="text-[18px] text-gray-400">кг</span>
              </p>
              <p className={clsx('mt-2 text-[14px]', calc.error ? 'text-[#f0a274]' : 'text-gray-400')}>
                {calc.ok
                  ? `${calc.label} · 1 м — ${kg(calc.perMeter)} кг`
                  : (calc.error ?? 'Введите размеры и длину — вес посчитается сразу')}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={!calc.ok}
                onClick={() => requestItem(line, { complete: true })}
                className="btn btn-accent h-11 disabled:pointer-events-none disabled:opacity-40"
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
          </div>
        </div>
        <p className="mt-3 text-[13px] text-gray-500">Теоретический вес является справочной величиной и зависит от допусков проката.</p>
      </div>
    </section>
  )
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold">
      <span className="grid size-6 place-items-center rounded-full bg-ink text-[12px] text-white tabular-nums">{n}</span>
      {children}
    </h3>
  )
}

function Radio({ name, checked, onChange, children }: { name: string; checked: boolean; onChange: () => void; children: ReactNode }) {
  return (
    <label className="group flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-[15px] transition-colors duration-150 has-checked:bg-accent-soft has-checked:text-accent-ink has-focus-visible:outline-2 has-focus-visible:outline-accent [@media(hover:hover)_and_(pointer:fine)]:hover:bg-gray-100">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span className="grid size-4 shrink-0 place-items-center rounded-full bg-white shadow-[inset_0_0_0_1.5px_rgb(0_0_0/0.25)] group-has-checked:shadow-[inset_0_0_0_1.5px_var(--color-accent)]">
        <span className="size-2 rounded-full bg-accent opacity-0 transition-opacity duration-150 group-has-checked:opacity-100" />
      </span>
      <span className="min-w-0 leading-tight">{children}</span>
    </label>
  )
}

function Field({ id, label, children }: { id: string; label: ReactNode; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[14px] font-medium">
        {label}
      </label>
      {children}
    </div>
  )
}

function Letter({ children }: { children: ReactNode }) {
  return <span className="font-semibold text-accent-ink italic">{children}</span>
}

/* ---------- Чертежи сечений с буквами размеров ---------- */

const C = { fill: '#e7e5e4', stroke: '#8a8a8a', dim: '#e0773a', text: '#b0521a' }

function Drawing({ id }: { id: ShapeId }) {
  const uid = useId().replace(/:/g, '')
  const arrow = `url(#a${uid})`
  const body = { fill: `url(#h${uid})`, stroke: C.stroke, strokeWidth: 1.5 }

  // Размерная линия со стрелками и буквой
  const Dim = ({ x1, y1, x2, y2, l, lx, ly }: { x1: number; y1: number; x2: number; y2: number; l: string; lx: number; ly: number }) => (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.dim} strokeWidth={1.5} markerStart={arrow} markerEnd={arrow} />
      <text x={lx} y={ly} fill={C.text} fontSize={15} fontWeight={600} fontStyle="italic" textAnchor="middle" dominantBaseline="middle">
        {l}
      </text>
    </>
  )
  // Выносная линия
  const Ext = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.dim} strokeWidth={0.75} opacity={0.6} />
  )
  // Выноска к тонкой стенке
  const Leader = ({ x1, y1, x2, y2, l }: { x1: number; y1: number; x2: number; y2: number; l: string }) => (
    <>
      <line x1={x2} y1={y2} x2={x1} y2={y1} stroke={C.dim} strokeWidth={1.25} markerEnd={arrow} />
      <text x={x2 + (x2 > x1 ? 8 : -8)} y={y2} fill={C.text} fontSize={15} fontWeight={600} fontStyle="italic" textAnchor="middle" dominantBaseline="middle">
        {l}
      </text>
    </>
  )

  const flatRect = (h: number) => {
    const y = 66 - h / 2
    return (
      <>
        <rect x={40} y={y} width={115} height={h} {...body} />
        <Ext x1={155} y1={y} x2={176} y2={y} />
        <Ext x1={155} y1={y + h} x2={176} y2={y + h} />
        <Dim x1={170} y1={y} x2={170} y2={y + h} l="a" lx={184} ly={66} />
        <Ext x1={40} y1={y + h} x2={40} y2={124} />
        <Ext x1={155} y1={y + h} x2={155} y2={124} />
        <Dim x1={40} y1={118} x2={155} y2={118} l="b" lx={97} ly={134} />
      </>
    )
  }

  return (
    <svg viewBox="0 0 200 150" className="h-full max-h-44 w-full" role="img" aria-label="Чертёж сечения с обозначениями размеров">
      <defs>
        <marker id={`a${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 1 L9 5 L0 9 Z" fill={C.dim} />
        </marker>
        <pattern id={`h${uid}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" fill={C.fill} />
          <line x1="0" y1="0" x2="0" y2="6" stroke="#cfccc8" strokeWidth="1.5" />
        </pattern>
      </defs>

      {id === 'sheet' && flatRect(14)}
      {id === 'busbar' && flatRect(26)}
      {id === 'plate' && flatRect(40)}

      {(id === 'round' || id === 'pipe') && (
        <>
          {id === 'round' ? (
            <circle cx={112} cy={70} r={44} {...body} />
          ) : (
            <path d="M112 26a44 44 0 1 1 0 88a44 44 0 1 1 0-88Zm0 9a35 35 0 1 0 0 70a35 35 0 1 0 0-70Z" fillRule="evenodd" {...body} />
          )}
          <Ext x1={112} y1={26} x2={44} y2={26} />
          <Ext x1={112} y1={114} x2={44} y2={114} />
          <Dim x1={50} y1={26} x2={50} y2={114} l={id === 'round' ? 'd' : 'D'} lx={36} ly={70} />
          {id === 'pipe' && <Leader x1={143} y1={39} x2={170} y2={20} l="t" />}
        </>
      )}

      {id === 'wire' && (
        <>
          <circle cx={112} cy={70} r={16} {...body} />
          <Ext x1={112} y1={54} x2={70} y2={54} />
          <Ext x1={112} y1={86} x2={70} y2={86} />
          <Dim x1={76} y1={54} x2={76} y2={86} l="d" lx={62} ly={70} />
        </>
      )}

      {id === 'hex' && (
        <>
          <polygon points="88,26 136,26 160,70 136,114 88,114 64,70" {...body} />
          <Ext x1={88} y1={26} x2={36} y2={26} />
          <Ext x1={88} y1={114} x2={36} y2={114} />
          <Dim x1={42} y1={26} x2={42} y2={114} l="s" lx={28} ly={70} />
        </>
      )}

      {id === 'square' && (
        <>
          <rect x={60} y={20} width={84} height={84} {...body} />
          <Ext x1={60} y1={104} x2={60} y2={128} />
          <Ext x1={144} y1={104} x2={144} y2={128} />
          <Dim x1={60} y1={122} x2={144} y2={122} l="a" lx={102} ly={138} />
        </>
      )}

      {id === 'profile' && (
        <>
          <path d="M58 30h100v64H58Zm9 9v46h82V39Z" fillRule="evenodd" {...body} />
          <Ext x1={58} y1={94} x2={58} y2={124} />
          <Ext x1={158} y1={94} x2={158} y2={124} />
          <Dim x1={58} y1={118} x2={158} y2={118} l="a" lx={108} ly={134} />
          <Ext x1={58} y1={30} x2={30} y2={30} />
          <Ext x1={58} y1={94} x2={30} y2={94} />
          <Dim x1={36} y1={30} x2={36} y2={94} l="h" lx={22} ly={62} />
          <Leader x1={153} y1={34} x2={178} y2={16} l="t" />
        </>
      )}

      {id === 'angle' && (
        <>
          <path d="M66 18v90h92v-11H77V18Z" {...body} />
          <Ext x1={66} y1={18} x2={38} y2={18} />
          <Ext x1={66} y1={108} x2={38} y2={108} />
          <Dim x1={44} y1={18} x2={44} y2={108} l="a" lx={30} ly={63} />
          <Ext x1={66} y1={108} x2={66} y2={132} />
          <Ext x1={158} y1={108} x2={158} y2={132} />
          <Dim x1={66} y1={126} x2={158} y2={126} l="b" lx={112} ly={142} />
          <Leader x1={78} y1={26} x2={104} y2={14} l="t" />
        </>
      )}
    </svg>
  )
}
