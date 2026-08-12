'use client'

import Image from 'next/image'
import { useTranslation } from 'next-i18next/pages'
import type { BingWallpaper } from '../lib/api'
import { buildApiUrl } from '../lib/endpoints'
import { useSiteOrigin } from '../lib/use-site-origin'
import CopyButton from './copy-button'

type Props = {
  wallpaper: BingWallpaper
  siteUrl: string
}

/**
 * 首页 Hero 区域，展示今日必应壁纸
 */
const WallpaperHero = ({ wallpaper, siteUrl }: Props) => {
  const { t } = useTranslation('common')
  const origin = useSiteOrigin(siteUrl)
  const apiUrl = buildApiUrl('/img/uhd', origin)

  return (
    <section className="relative h-dvh min-h-dvh flex items-end overflow-hidden">
      <div className="absolute inset-0">
        {wallpaper.url ? (
          <Image
            src={wallpaper.url}
            alt={wallpaper.title}
            fill
            priority
            className="object-cover scale-105"
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-surface-light" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-5 pb-16 pt-32">
        <div className="max-w-3xl animate-slide-up">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            {t('hero.badge')}
          </span>

          <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            {t('site.h1')}
          </h1>

          <p className="mt-4 text-xl font-medium text-white/90 md:text-2xl">
            {wallpaper.title}
          </p>

          <p className="mt-2 text-base text-white/70 md:text-lg">
            {wallpaper.copyright}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {wallpaper.url && (
              <a
                href={wallpaper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-bing-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-bing-600/30 transition-all hover:bg-bing-500 hover:shadow-bing-500/40"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t('hero.download')}
              </a>
            )}
            <CopyButton text={apiUrl} label={t('hero.copyApi')} className="!px-4 !py-2.5 !text-sm !bg-white/10 !text-white !border-white/20 hover:!bg-white/20" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default WallpaperHero
