import { catalog, type Category, type Material } from '../data/catalog'

/** Нормализация для поиска: регистр, ё/е, пробелы, дефисы, точки, скобки. */
export const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е').replace(/[\s\-.,()]/g, '')

/** Плоский индекс «марка → материал → виды». Позиции без марок ищутся по названию. */
export const searchIndex = catalog.flatMap((c) =>
  c.materials.flatMap((m) =>
    (m.grades.length ? m.grades : [m.name]).map((grade) => ({
      grade,
      material: m.name,
      forms: m.forms,
      finish: m.finish,
      image: m.image,
      category: c.id,
    })),
  ),
)

export type SearchHit = (typeof searchIndex)[number]

/** Совпадения по марке или названию материала. */
export function searchGrades(query: string, limit = 6): SearchHit[] {
  const q = norm(query)
  if (!q) return []
  return searchIndex.filter((r) => norm(r.grade).includes(q) || norm(r.material).includes(q)).slice(0, limit)
}

/** Совпадает ли материал с запросом (название, символ, виды, марки) — как в каталоге. */
export function materialMatches(m: Material, q: string) {
  if (!q) return true
  return [m.name, m.symbol ?? '', ...m.forms, ...m.grades].some((v) => norm(v).includes(q))
}

/** Есть ли в каталоге хоть что-то по запросу (включая виды проката: «шина», «втулки»). */
export function catalogHasMatch(query: string) {
  const q = norm(query)
  return !!q && catalog.some((c) => c.materials.some((m) => materialMatches(m, q)))
}

/** Сколько позиций в категории: марки, а если их нет — виды, иначе сам материал. */
export function categoryCount(c: Category) {
  return c.materials.reduce((s, m) => s + (m.grades.length || m.forms.length || 1), 0)
}

const rules = new Intl.PluralRules('ru-RU')

/** plural(4, ['позиция', 'позиции', 'позиций']) → «4 позиции» */
export function plural(n: number, [one, few, many]: [string, string, string]) {
  const r = rules.select(n)
  return `${n} ${r === 'one' ? one : r === 'few' ? few : many}`
}
