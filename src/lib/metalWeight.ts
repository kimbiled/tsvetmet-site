/**
 * Калькулятор теоретической массы цветного проката.
 * Масса, кг = площадь сечения (мм²) × длина (м) × плотность (г/см³) / 1000.
 * Плотности справочные; фактический вес зависит от допусков проката.
 */

export interface Alloy {
  grade: string
  /** г/см³ */
  density: number
}

export interface MetalGroup {
  id: string
  name: string
  alloys: Alloy[]
}

/** Только цветной металл и нержавейка — марки по ассортименту компании */
export const metals: MetalGroup[] = [
  {
    id: 'aluminium',
    name: 'Алюминий',
    alloys: [
      { grade: 'Д16Т', density: 2.78 },
      { grade: 'АД31Т', density: 2.71 },
      { grade: 'АД1', density: 2.71 },
      { grade: 'А5', density: 2.7 },
    ],
  },
  { id: 'copper', name: 'Медь', alloys: [{ grade: 'М1', density: 8.94 }] },
  {
    id: 'brass',
    name: 'Латунь',
    alloys: [
      { grade: 'ЛС-59', density: 8.45 },
      { grade: 'Л-63', density: 8.44 },
    ],
  },
  {
    id: 'bronze',
    name: 'Бронза',
    alloys: [
      { grade: 'БрО5Ц5С5', density: 8.8 },
      { grade: 'БрАЖ 9-4', density: 7.6 },
    ],
  },
  {
    id: 'stainless',
    name: 'Нержавеющая сталь',
    alloys: [
      { grade: '12Х18Н10Т', density: 7.9 },
      { grade: 'AISI 304', density: 7.93 },
      { grade: 'AISI 321', density: 7.9 },
      { grade: 'AISI 430', density: 7.7 },
    ],
  },
]

export type ShapeId = 'sheet' | 'busbar' | 'round' | 'hex' | 'square' | 'pipe' | 'profile' | 'wire' | 'angle' | 'plate'

export interface ShapeField {
  key: string
  /** Буква на чертеже */
  letter: string
  label: string
}

type Dims = Record<string, number>

export interface Shape {
  id: ShapeId
  name: string
  fields: ShapeField[]
  /** Площадь сечения, мм² */
  area: (d: Dims) => number
  /** Ошибка геометрии, если размеры невозможны */
  check?: (d: Dims) => string | null
  /** Короткое описание для заявки: «Труба Д16Т ⌀40×2 мм» */
  label: (d: Dims, grade: string) => string
}

const n = (v: number) => num(v, 2)
const flat = (name: string): Shape => ({
  id: name === 'Лист' ? 'sheet' : name === 'Шина' ? 'busbar' : 'plate',
  name,
  fields: [
    { key: 'a', letter: 'a', label: 'Толщина' },
    { key: 'b', letter: 'b', label: 'Ширина' },
  ],
  area: (d) => d.a * d.b,
  label: (d, g) => `${name} ${g} ${n(d.a)}×${n(d.b)} мм`,
})

/** Порядок — как в списке компании */
export const shapes: Shape[] = [
  flat('Лист'),
  flat('Шина'),
  {
    id: 'round',
    name: 'Круг',
    fields: [{ key: 'd', letter: 'd', label: 'Диаметр' }],
    area: (d) => (Math.PI * d.d ** 2) / 4,
    label: (d, g) => `Круг ${g} ⌀${n(d.d)} мм`,
  },
  {
    id: 'hex',
    name: 'Шестигранник',
    fields: [{ key: 's', letter: 's', label: 'Размер под ключ' }],
    area: (d) => (Math.sqrt(3) / 2) * d.s ** 2,
    label: (d, g) => `Шестигранник ${g} S${n(d.s)} мм`,
  },
  {
    id: 'square',
    name: 'Квадрат',
    fields: [{ key: 'a', letter: 'a', label: 'Сторона' }],
    area: (d) => d.a ** 2,
    label: (d, g) => `Квадрат ${g} ${n(d.a)}×${n(d.a)} мм`,
  },
  {
    id: 'pipe',
    name: 'Труба круглая',
    fields: [
      { key: 'd', letter: 'D', label: 'Наружный диаметр' },
      { key: 't', letter: 't', label: 'Толщина стенки' },
    ],
    area: (d) => Math.PI * d.t * (d.d - d.t),
    check: (d) => (d.t * 2 >= d.d ? 'Стенка должна быть меньше половины диаметра' : null),
    label: (d, g) => `Труба ${g} ⌀${n(d.d)}×${n(d.t)} мм`,
  },
  {
    id: 'profile',
    name: 'Труба профильная',
    fields: [
      { key: 'a', letter: 'a', label: 'Ширина' },
      { key: 'h', letter: 'h', label: 'Высота' },
      { key: 't', letter: 't', label: 'Толщина стенки' },
    ],
    area: (d) => 2 * d.t * (d.a + d.h - 2 * d.t),
    check: (d) => (d.t * 2 >= Math.min(d.a, d.h) ? 'Стенка должна быть меньше половины стороны' : null),
    label: (d, g) => `Труба профильная ${g} ${n(d.a)}×${n(d.h)}×${n(d.t)} мм`,
  },
  {
    id: 'wire',
    name: 'Проволока',
    fields: [{ key: 'd', letter: 'd', label: 'Диаметр' }],
    area: (d) => (Math.PI * d.d ** 2) / 4,
    label: (d, g) => `Проволока ${g} ⌀${n(d.d)} мм`,
  },
  {
    id: 'angle',
    name: 'Уголок',
    fields: [
      { key: 'a', letter: 'a', label: 'Полка 1' },
      { key: 'b', letter: 'b', label: 'Полка 2' },
      { key: 't', letter: 't', label: 'Толщина' },
    ],
    area: (d) => d.t * (d.a + d.b - d.t),
    check: (d) => (d.t >= Math.min(d.a, d.b) ? 'Толщина должна быть меньше полки' : null),
    label: (d, g) => `Уголок ${g} ${n(d.a)}×${n(d.b)}×${n(d.t)} мм`,
  },
  flat('Плита'),
]

/** «2,5» / «2.5» / « 40 » → число; пусто или мусор → NaN */
export function parseNum(v: string) {
  const s = v.replace(/\s/g, '').replace(',', '.')
  return s === '' ? NaN : Number(s)
}

/** Число по-русски: запятая, неразрывные пробелы в тысячах */
export function num(v: number, maxFraction = 2) {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: maxFraction }).format(v)
}

/** Масса: точнее для малых значений */
export function kg(v: number) {
  if (v >= 100) return num(v, 1)
  if (v >= 1) return num(v, 2)
  return num(v, 3)
}

/** Масса, кг: площадь мм² × длина м × плотность г/см³ */
export function massKg(areaMm2: number, lengthM: number, density: number) {
  return (areaMm2 * lengthM * density) / 1000
}
