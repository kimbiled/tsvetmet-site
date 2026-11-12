import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { Tooltip } from 'antd'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'

export async function copyText(value: string, message = 'Скопировано') {
  try {
    await navigator.clipboard.writeText(value)
    toast.success(message)
    return true
  } catch {
    toast.error('Не удалось скопировать', { description: 'Выделите текст и скопируйте вручную.' })
    return false
  }
}

/** Иконка «копировать» морфится в галочку (opacity + scale + blur, на transitions — прерываемо). */
export function useCopied() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const flash = () => {
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1600)
  }
  return [copied, flash] as const
}

export function CopyIcon({ copied, className }: { copied: boolean; className?: string }) {
  return (
    <span className={clsx('relative grid size-4 place-items-center', className)} aria-hidden>
      <Copy className="icon-swap absolute size-4" data-hidden={copied} />
      <Check className="icon-swap absolute size-4 text-emerald-600" data-hidden={!copied} strokeWidth={2.5} />
    </span>
  )
}

interface Props {
  value: string
  label: string
}

export default function CopyButton({ value, label }: Props) {
  const [copied, flash] = useCopied()
  return (
    <Tooltip title={copied ? 'Скопировано' : 'Скопировать'} mouseEnterDelay={0.4}>
      <button
        type="button"
        onClick={async () => {
          if (await copyText(value, `${label}: скопировано`)) flash()
        }}
        aria-label={`Скопировать: ${label}`}
        className="grid size-9 shrink-0 place-items-center rounded-lg text-gray-400 transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.94] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-gray-100 [@media(hover:hover)_and_(pointer:fine)]:hover:text-ink"
      >
        <CopyIcon copied={copied} />
      </button>
    </Tooltip>
  )
}
