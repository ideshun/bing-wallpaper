'use client'

import { useCallback, useState } from 'react'
import cn from 'classnames'
import { useTranslation } from 'next-i18next/pages'

type Props = {
  text: string
  className?: string
  label?: string
}

/**
 * 一键复制文本到剪贴板
 */
const CopyButton = ({ text, className, label }: Props) => {
  const { t } = useTranslation('common')
  const [copied, setCopied] = useState(false)
  const copyLabel = label || t('copy.label')

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [text])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 border',
        copied
          ? 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30 dark:text-emerald-300'
          : 'bg-fill text-fg-muted border-border hover:bg-fill-hover hover:text-fg',
        className
      )}
      aria-label={copied ? t('copy.done') : copyLabel}
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {t('copy.done')}
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          {copyLabel}
        </>
      )}
    </button>
  )
}

export default CopyButton
