export const company = {
  name: 'ИП «ПО ЦВЕТМЕТ»',
  shortName: 'ПО ЦВЕТМЕТ',
  address: 'г. Астана, ул. Жетиген, 26, база «Агромост»',
  mapUrl: 'https://2gis.kz/astana/geo/70000001018125576',
  email: 'cwet-met@mail.ru',
  /** Режим работы — по карточке 2ГИС (обновлено 28.09.2026). Пусто — нигде не показывается. */
  hours: 'Пн–Пт 10:00–17:00',
  hoursNote: 'Обед 13:00–14:00 · Сб–Вс — выходной',
  /** WhatsApp — заявки с сайта уходят сюда */
  whatsapp: {
    display: '8 (701) 544-28-74',
    number: '77015442874',
  },
  phones: [
    { label: 'Офис (тел./факс)', display: '8 (7172) 53-26-87', href: 'tel:+77172532687' },
    { label: 'Мобильный', display: '8 (701) 544-28-74', href: 'tel:+77015442874' },
  ],
}

/** Ссылка на чат WhatsApp компании, при необходимости — с готовым текстом сообщения. */
export function whatsappLink(text?: string) {
  return `https://wa.me/${company.whatsapp.number}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

export const requisites: { label: string; value: string }[] = [
  { label: 'Наименование', value: 'ИП «ПО ЦВЕТМЕТ»' },
  { label: 'Юридический адрес', value: '010000, г. Астана, пр. Республики, 48/1, кв. 36' },
  { label: 'Фактический адрес', value: '010000, г. Астана, ул. Жетиген, 26 (Агромост)' },
  { label: 'ИИН', value: '700202350090' },
  { label: 'ИИК', value: 'KZ12998BTB0000049534' },
  { label: 'Банк', value: 'Столичный филиал АО «Alatau City Bank»' },
  { label: 'БИК', value: 'TSESKZKA' },
  { label: 'ОКПО', value: '00000003' },
  { label: 'Тел./факс', value: '8 (7172) 53-26-87, 8 (701) 544-28-74' },
  { label: 'E-mail', value: 'cwet-met@mail.ru' },
  { label: 'Свидетельство НДС', value: 'серия 62001 № 0017562 от 06.12.2012 г.' },
  {
    label: 'Директор',
    value:
      'Щербак Валерий Николаевич, действующий на основании свидетельства о государственной регистрации ИП 10915 № 0089141 от 03.03.2010 г.',
  },
]
