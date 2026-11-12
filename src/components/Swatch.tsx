import clsx from 'clsx'
import type { Finish } from '../data/catalog'

const finishClass: Record<Finish, string> = {
  copper: 'finish-copper',
  brass: 'finish-brass',
  bronze: 'finish-bronze',
  aluminium: 'finish-aluminium',
  steel: 'finish-steel',
  polymer: 'finish-polymer',
  tool: 'finish-tool',
}

interface Props {
  finish: Finish
  image?: string
  alt?: string
  className?: string
  children?: React.ReactNode
}

/** Фото товара, а если его нет — фактура металла. */
export default function Swatch({ finish, image, alt = '', className, children }: Props) {
  return (
    <div className={clsx('relative overflow-hidden', image ? 'bg-gray-100' : finishClass[finish], className)}>
      {image && (
        <img src={image} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      )}
      {/* внутренняя полупрозрачная обводка вместо border */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)]" />
      {children}
    </div>
  )
}

/** Подпись поверх фактуры — белая «таблетка» с тенью. */
export function SwatchLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        'absolute bottom-2.5 left-2.5 rounded-md bg-white/92 px-2 py-1 text-[12px] font-medium text-ink shadow-[0_1px_2px_rgb(0_0_0/0.12)] backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </span>
  )
}
