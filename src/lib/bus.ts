/** Простые события между блоками страницы: «добавить в заявку» и «открыть каталог». */

export const PREFILL = 'cm:prefill'
export const CATALOG = 'cm:catalog'

export interface CatalogDetail {
  query?: string
  category?: string
}

function scrollToSection(id: string) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

/** Добавить позицию в поле «Что нужно» формы заявки и прокрутить к ней. */
export function requestItem(text: string) {
  window.dispatchEvent(new CustomEvent<string>(PREFILL, { detail: text }))
  scrollToSection('request')
}

/** Открыть каталог с поиском или категорией и прокрутить к нему. */
export function openCatalog(detail: CatalogDetail) {
  window.dispatchEvent(new CustomEvent<CatalogDetail>(CATALOG, { detail }))
  scrollToSection('catalog')
}
