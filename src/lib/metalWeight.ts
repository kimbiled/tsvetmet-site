/**
 * Калькулятор теоретической массы проката.
 * Масса, кг = площадь сечения (мм²) × длина (мм) × плотность (г/см³) / 1 000 000.
 * Плотности справочные; фактический вес зависит от допусков проката.
 */

export interface Alloy {
  grade: string
  /** г/см³ */
  density: number
}

export interface MaterialGroup {
  id: string
  name: string
  alloys: Alloy[]
}

/** Марки — по ассортименту компании (src/data/catalog.ts). */
export const materials: MaterialGroup[] = [
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
  {
    id: 'babbitt',
    name: 'Баббит',
    alloys: [
      { grade: 'Б83', density: 7.38 },
      { grade: 'Б16', density: 9.29 },
      { grade: 'БКА', density: 10.5 },
    ],
  },
  { id: 'nichrome', name: 'Нихром', alloys: [{ grade: 'Х20Н80', density: 8.4 }] },
  {
    id: 'solder',
    name: 'Припой оловянный',
    alloys: [
      { grade: 'ПОС 30', density: 9.7 },
      { grade: 'ПОС 40', density: 9.3 },
      { grade: 'ПОС 60', density: 8.5 },
    ],
  },
  {
    id: 'technical',
    name: 'Технические материалы',
    alloys: [
      { grade: 'Капролон', density: 1.15 },
      { grade: 'Фторопласт', density: 2.2 },
      { grade: 'Полиуретан', density: 1.2 },
      { grade: 'Текстолит', density: 1.35 },
      { grade: 'Стеклотекстолит', density: 1.8 },
      { grade: 'Паронит', density: 1.9 },
    ],
  },
]

export type ShapeId = 'sheet' | 'strip' | 'round' | 'wire' | 'hex' | 'square' | 'pipe' | 'bushing' | 'angle'

export interface ShapeField {
  key: string
  label: string
}

export interface Shape {
  id: ShapeId
  name: string
  fields: ShapeField[]
  /** Площадь сечения, мм² (для листа — толщина × ширина) */
  area: (d: Record<string, number>) => number
  /** Ошибка геометрии, если размеры невозможны */
  check?: (d: Record<string, number>) => string | null
  /** Короткое описание для заявки: «Труба ⌀40×2 мм» */
  label: (d: Record<string, number>, grade: string) => string
  /** Лист/плита: показываем вес 1 м², а не 1 м */
  perSquareMeter?: boolean
  /** Длина по умолчанию в метрах (длинномерный прокат) */
  lengthInMeters?: boolean
}

const n = (v: number) => num(v, 2)

export const shapes: Shape[] = [
  {
    id: 'sheet',
    name: 'Лист, плита',
    fields: [
      { key: 't', label: 'Толщина' },
      { key: 'w', label: 'Ширина' },
    ],
    area: (d) => d.t * d.w,
    label: (d, g) => `Лист ${g} ${n(d.t)}×${n(d.w)} мм`,
    perSquareMeter: true,
  },
  {
    id: 'strip',
    name: 'Полоса, шина',
    fields: [
      { key: 't', label: 'Толщина' },
      { key: 'w', label: 'Ширина' },
    ],
    area: (d) => d.t * d.w,
    label: (d, g) => `Полоса/шина ${g} ${n(d.t)}×${n(d.w)} мм`,
    lengthInMeters: true,
  },
  {
    id: 'round',
    name: 'Круг, пруток',
    fields: [{ key: 'd', label: 'Диаметр' }],
    area: (d) => (Math.PI * d.d ** 2) / 4,
    label: (d, g) => `Круг ${g} ⌀${n(d.d)} мм`,
    lengthInMeters: true,
  },
  {
    id: 'wire',
    name: 'Проволока',
    fields: [{ key: 'd', label: 'Диаметр' }],
    area: (d) => (Math.PI * d.d ** 2) / 4,
    label: (d, g) => `Проволока ${g} ⌀${n(d.d)} мм`,
    lengthInMeters: true,
  },
  {
    id: 'hex',
    name: 'Шестигранник',
    fields: [{ key: 's', label: 'Размер под ключ' }],
    area: (d) => (Math.sqrt(3) / 2) * d.s ** 2,
    label: (d, g) => `Шестигранник ${g} S${n(d.s)} мм`,
    lengthInMeters: true,
  },
  {
    id: 'square',
    name: 'Квадрат',
    fields: [{ key: 'a', label: 'Сторона' }],
    area: (d) => d.a ** 2,
    label: (d, g) => `Квадрат ${g} ${n(d.a)}×${n(d.a)} мм`,
    lengthInMeters: true,
  },
  {
    id: 'pipe',
    name: 'Труба',
    fields: [
      { key: 'D', label: 'Наружный диаметр' },
      { key: 's', label: 'Стенка' },
    ],
    area: (d) => Math.PI * d.s * (d.D - d.s),
    check: (d) => (d.s * 2 >= d.D ? 'Стенка должна быть меньше половины диаметра' : null),
    label: (d, g) => `Труба ${g} ⌀${n(d.D)}×${n(d.s)} мм`,
    lengthInMeters: true,
  },
  {
    id: 'bushing',
    name: 'Втулка',
    fields: [
      { key: 'D', label: 'Наружный диаметр' },
      { key: 'd', label: 'Внутренний диаметр' },
    ],
    area: (d) => (Math.PI * (d.D ** 2 - d.d ** 2)) / 4,
    check: (d) => (d.d >= d.D ? 'Внутренний диаметр должен быть меньше наружного' : null),
    label: (d, g) => `Втулка ${g} ⌀${n(d.D)}/⌀${n(d.d)} мм`,
  },
  {
    id: 'angle',
    name: 'Уголок',
    fields: [
      { key: 'a', label: 'Полка A' },
      { key: 'b', label: 'Полка B' },
      { key: 't', label: 'Толщина' },
    ],
    area: (d) => d.t * (d.a + d.b - d.t),
    check: (d) => (d.t >= Math.min(d.a, d.b) ? 'Толщина должна быть меньше полки' : null),
    label: (d, g) => `Уголок ${g} ${n(d.a)}×${n(d.b)}×${n(d.t)} мм`,
    lengthInMeters: true,
  },
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

/** Масса, кг: площадь мм² × длина мм × плотность г/см³ */
export function massKg(areaMm2: number, lengthMm: number, density: number) {
  return (areaMm2 * lengthMm * density) / 1_000_000
}
