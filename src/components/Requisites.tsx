import CopyButton, { CopyIcon, copyText, useCopied } from './CopyButton'
import { requisites } from '../data/company'

export default function Requisites() {
  const all = requisites.map((r) => `${r.label}: ${r.value}`).join('\n')
  const [copied, flash] = useCopied()

  return (
    <section id="requisites" aria-labelledby="req-title" className="bg-white py-20 shadow-[0_-1px_0_rgb(0_0_0/0.06)] sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[14px] font-medium text-accent-ink">Для бухгалтерии</p>
            <h2 id="req-title" className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[2.5rem]">
              Реквизиты
            </h2>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (await copyText(all, 'Реквизиты скопированы')) flash()
            }}
            className="btn btn-light self-start"
          >
            <CopyIcon copied={copied} />
            Скопировать все
          </button>
        </div>

        <dl className="mt-10 overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]">
          {requisites.map((r, n) => (
            <div
              key={r.label}
              className={`grid gap-1 py-3.5 pr-3 pl-5 sm:grid-cols-[220px_1fr_auto] sm:items-center sm:gap-6 ${
                n > 0 ? 'shadow-[inset_0_1px_0_rgb(0_0_0/0.06)]' : ''
              }`}
            >
              <dt className="text-[14px] text-gray-500">{r.label}</dt>
              <dd className="flex items-center justify-between gap-3 sm:contents">
                <span className="text-[15px] font-medium break-words tabular-nums">{r.value}</span>
                <CopyButton value={r.value} label={r.label} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
