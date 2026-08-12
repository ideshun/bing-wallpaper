'use client'

import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next/pages'
import type { BingWallpaper } from '../lib/api'
import { format, parse } from 'date-fns'
import { de, enUS, fr, ja, ru, zhCN, zhTW } from 'date-fns/locale'
import type { Locale } from 'date-fns'
import type { AppLocale } from '../lib/i18n'

type Props = {
  wallpapers: BingWallpaper[]
}

const DATE_LOCALES: Record<AppLocale, Locale> = {
  'zh-CN': zhCN,
  en: enUS,
  'zh-TW': zhTW,
  de,
  fr,
  ja,
  ru,
}

/**
 * 将 Bing 日期字符串格式化为可读日期
 * @param dateStr - YYYYMMDD 格式
 * @param locale - 应用语言
 * @param pattern - 日期格式
 */
function formatBingDate(dateStr: string, locale: AppLocale, pattern: string): string {
  try {
    const date = parse(dateStr, 'yyyyMMdd', new Date())
    return format(date, pattern, { locale: DATE_LOCALES[locale] || zhCN })
  } catch {
    return dateStr
  }
}

/**
 * 近期壁纸画廊
 */
const WallpaperGallery = ({ wallpapers }: Props) => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const locale = (router.locale || 'zh-CN') as AppLocale

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {wallpapers.map((wallpaper, index) => (
        <a
          key={wallpaper.date}
          href={wallpaper.url}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card group overflow-hidden transition-all duration-300 hover:border-bing-500/30 hover:shadow-bing-500/10"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <div className="relative aspect-video overflow-hidden bg-surface-light">
            {wallpaper.url && (
              <Image
                src={wallpaper.url}
                alt={wallpaper.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
              <p className="text-xs font-medium text-white line-clamp-2">{wallpaper.title}</p>
            </div>
          </div>
          <div className="p-3">
            <p className="text-xs text-fg-subtle">
              {formatBingDate(wallpaper.date, locale, t('date.format'))}
            </p>
            <p className="mt-1 text-sm font-medium text-fg line-clamp-1">{wallpaper.title}</p>
          </div>
        </a>
      ))}
    </div>
  )
}

export default WallpaperGallery
