/**
 * Ассортимент — по списку компании («для сайта.pdf»). Весь каталог на сайте строится из этого файла.
 * Чтобы добавить/убрать марку или вид — правьте массивы ниже.
 * Фото: положите файл в /public/products/ и укажите путь в поле `image`
 * (например image: '/products/copper.jpg'). Без фото показывается фактура металла.
 */

export type Finish = 'copper' | 'brass' | 'bronze' | 'aluminium' | 'steel' | 'polymer' | 'tool'

export interface Material {
  id: string
  name: string
  /** Короткая подпись на фактуре (хим. символ и т. п.). Необязательно. */
  symbol?: string
  finish: Finish
  /** Фото: путь в /public, например '/products/copper.jpg' */
  image?: string
  /** Фокус кадра при обрезке (CSS object-position) */
  imagePosition?: string
  /** Подпись к фото, если лицензия требует указать автора (Wikimedia CC BY / BY-SA) */
  credit?: { author: string; license: string; url: string }
  /** Виды / формы поставки */
  forms: string[]
  /** Марки */
  grades: string[]
}

export interface Category {
  id: string
  title: string
  /** Короткое название для переключателя категорий */
  short: string
  lead: string
  materials: Material[]
}

export const catalog: Category[] = [
  {
    id: 'nonferrous',
    title: 'Цветной металлопрокат',
    short: 'Цветной',
    lead: 'Бронза, медь, алюминий, латунь, баббит и нихром.',
    materials: [
      {
        id: 'bronze',
        image: '/products/bronze.jpg',
        name: 'Бронза',
        symbol: 'CuSn',
        finish: 'bronze',
        forms: ['Прутки', 'Втулки'],
        grades: ['БрО5Ц5С5', 'БрАЖ 9-4'],
      },
      {
        id: 'copper',
        image: '/products/copper.jpg',
        name: 'Медь',
        symbol: 'Cu',
        finish: 'copper',
        forms: ['Листы', 'Шины', 'Прутки', 'Плиты', 'Трубы', 'Лента'],
        grades: ['М1'],
      },
      {
        id: 'aluminium',
        image: '/products/aluminium.jpg',
        name: 'Алюминий',
        symbol: 'Al',
        finish: 'aluminium',
        forms: ['Прутки', 'Листы', 'Шины', 'Трубы', 'Уголки'],
        grades: ['Д16Т', 'АД31Т', 'АД1', 'А5'],
      },
      {
        id: 'brass',
        image: '/products/brass.jpg',
        name: 'Латунь',
        symbol: 'CuZn',
        finish: 'brass',
        forms: ['Прутки', 'Листы', 'Шестигранники', 'Проволока'],
        grades: ['ЛС-59', 'Л-63'],
      },
      {
        id: 'babbitt',
        name: 'Баббит',
        symbol: 'Sn-Sb',
        finish: 'aluminium',
        forms: [],
        grades: ['Б16', 'Б83', 'БКА'],
      },
      {
        id: 'nichrome',
        image: '/products/nichrome.jpg',
        name: 'Нихром',
        symbol: 'NiCr',
        finish: 'steel',
        forms: ['Проволока'],
        grades: ['Х20Н80'],
      },
    ],
  },
  {
    id: 'stainless',
    title: 'Нержавеющая сталь',
    short: 'Нержавейка',
    lead: 'Прутки, листы и трубы из нержавеющей стали.',
    materials: [
      {
        id: 'stainless',
        image: '/products/stainless.jpg',
        name: 'Нержавеющая сталь',
        symbol: 'Fe-Cr-Ni',
        finish: 'steel',
        forms: ['Прутки', 'Листы', 'Трубы'],
        grades: ['12Х18Н10Т', 'AISI 304', 'AISI 430', 'AISI 321'],
      },
    ],
  },
  {
    id: 'technical',
    title: 'Технические и прокладочные материалы',
    short: 'Технические',
    lead: 'Паронит и конструкционные пластики для прокладок, втулок и деталей.',
    materials: [
      {
        id: 'paronite',
        image: '/products/paronite.jpg',
        name: 'Паронит',
        finish: 'polymer',
        forms: [],
        grades: ['ПОН-Б', 'ПМБ'],
      },
      {
        id: 'caprolactam',
        image: '/products/caprolactam.jpg',
        name: 'Капролактан',
        finish: 'polymer',
        forms: ['Стержни', 'Пластины'],
        grades: [],
      },
      {
        id: 'ptfe',
        image: '/products/ptfe.jpg',
        name: 'Фторопласт',
        finish: 'polymer',
        forms: ['Стержни', 'Пластины'],
        grades: [],
      },
      {
        id: 'polyurethane',
        image: '/products/polyurethane.jpg',
        name: 'Полиуретан',
        finish: 'polymer',
        forms: ['Стержни', 'Листы'],
        grades: [],
      },
      {
        id: 'fiberglass',
        image: '/products/fiberglass.jpg',
        name: 'Стеклотекстолит',
        finish: 'polymer',
        forms: [],
        grades: [],
      },
      {
        id: 'textolite',
        image: '/products/textolite.jpg',
        name: 'Текстолит',
        finish: 'polymer',
        forms: ['Стержни', 'Листы'],
        grades: [],
      },
    ],
  },
  {
    id: 'solder',
    title: 'Припои и паяльные материалы',
    short: 'Припои',
    lead: 'Оловянно-свинцовые припои.',
    materials: [
      {
        id: 'solder-tin',
        image: '/products/solder-tin.jpg',
        name: 'Припой оловянный',
        symbol: 'Sn',
        finish: 'aluminium',
        forms: [],
        grades: ['ПОС 30', 'ПОС 40', 'ПОС 60'],
      },
    ],
  },
  {
    id: 'cutting',
    title: 'Металлорежущий инструмент',
    short: 'Инструмент',
    lead: 'Токарные резцы и абразивные круги.',
    materials: [
      {
        id: 'cutters',
        image: '/products/cutters.jpg',
        name: 'Резцы токарные',
        finish: 'tool',
        forms: ['Проходные', 'Подрезные', 'Чистовые', 'Расточные', 'Резьбовые', 'Канавочные'],
        grades: [],
      },
      {
        id: 'wheels',
        image: '/products/wheels.jpg',
        name: 'Круги',
        finish: 'tool',
        forms: ['Шлифовальные', 'Отрезные', 'Обдирочные', 'Лепестковые'],
        grades: [],
      },
    ],
  },
  {
    id: 'welding',
    title: 'Сварочные материалы',
    short: 'Сварка',
    lead: 'Электроды для сварки и наплавки.',
    materials: [
      {
        id: 'electrodes',
        image: '/products/electrodes.jpg',
        name: 'Электроды',
        finish: 'steel',
        forms: [],
        grades: ['Сормайт', 'МР-3', 'УОНИ', 'ЦЛ-11', 'НЖ-13', 'ЦЧ', 'ОЗЛ-6'],
      },
    ],
  },
]
