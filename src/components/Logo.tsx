import clsx from 'clsx'

interface Props {
  /** light — для тёмного фона (логотип инвертируется в белый) */
  tone?: 'light' | 'dark'
  /** Показывать подпись «металлопрокат · Астана» */
  caption?: boolean
  className?: string
}

/** Логотип компании (прозрачный PNG из /public/brand/logo.png). */
export default function Logo({ tone = 'dark', caption = true, className }: Props) {
  const onDark = tone === 'light'
  return (
    <span className={clsx('inline-flex items-center gap-3', className)}>
      <img
        src="/brand/logo.png"
        alt="ЦветМет"
        width={1228}
        height={547}
        decoding="async"
        className={clsx('h-10 w-auto select-none', onDark && 'invert')}
        draggable={false}
      />
      {caption && (
        <span
          className={clsx(
            'hidden pl-3 text-[12px] leading-[1.25] sm:block',
            onDark ? 'text-gray-400 shadow-[inset_1px_0_0_rgb(255_255_255/0.14)]' : 'text-gray-600 shadow-[inset_1px_0_0_rgb(0_0_0/0.1)]',
          )}
        >
          металлопрокат
          <br />
          Астана
        </span>
      )}
    </span>
  )
}
