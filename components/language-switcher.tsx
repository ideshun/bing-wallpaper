'use client'

import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import {
  LOCALES,
  LOCALE_LABELS,
  LOCALE_SHORT_LABELS,
  type AppLocale,
} from '../lib/i18n'

/**
 * 语言切换下拉菜单
 */
const LanguageSwitcher = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const current = (router.locale || 'zh-CN') as AppLocale

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  /**
   * 切换语言并保持当前路径
   * @param locale - 目标语言
   */
  const switchLocale = (locale: AppLocale) => {
    setOpen(false)
    if (locale === current) return
    const { pathname, asPath, query } = router
    router.push({ pathname, query }, asPath, { locale })
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="nav-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={LOCALE_LABELS[current]}
        onClick={() => setOpen((v) => !v)}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        <span className="min-w-[1.25rem] text-center text-sm font-medium">
          {LOCALE_SHORT_LABELS[current]}
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 min-w-[9rem] overflow-hidden rounded-xl border border-border bg-surface-card py-1 shadow-xl"
        >
          {LOCALES.map((locale) => (
            <li key={locale}>
              <button
                type="button"
                role="option"
                aria-selected={locale === current}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-fill ${
                  locale === current
                    ? 'text-bing-600 dark:text-bing-300 font-medium'
                    : 'text-fg-muted'
                }`}
                onClick={() => switchLocale(locale)}
              >
                <span className="w-5 shrink-0 text-center font-medium">
                  {LOCALE_SHORT_LABELS[locale]}
                </span>
                <span>{LOCALE_LABELS[locale]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LanguageSwitcher
