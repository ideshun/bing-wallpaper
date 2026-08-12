import Head from 'next/head'
import { useTranslation } from 'next-i18next/pages'
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations'
import Layout from '../components/layout'
import WallpaperHero from '../components/wallpaper-hero'
import FeatureGrid from '../components/feature-grid'
import ApiEndpoints from '../components/api-endpoints'
import WallpaperGallery from '../components/wallpaper-gallery'
import UsageGuide from '../components/usage-guide'
import type { BingWallpaper } from '../lib/api'
import { CANONICAL_SITE_URL, HOME_OG_IMAGE_URL } from '../lib/constants'
import { DAILY_ENDPOINTS, RANDOM_ENDPOINTS } from '../lib/endpoints'
import { getSiteUrlFromRequest } from '../lib/site-url'
import {
  FALLBACK_WALLPAPER,
  getCachedRecentWallpapers,
  getCachedTodayWallpaper,
} from '../lib/wallpaper-cache'
import type { GetServerSideProps } from 'next'
import nextI18NextConfig from '../next-i18next.config'

type Props = {
  todayWallpaper: BingWallpaper
  recentWallpapers: BingWallpaper[]
  siteUrl: string
}

/**
 * 首页 — Bing 壁纸 API 展示
 */
export default function Index({ todayWallpaper, recentWallpapers, siteUrl }: Props) {
  const { t } = useTranslation('common')

  return (
    <Layout>
      <Head>
        <meta property="og:url" content={CANONICAL_SITE_URL} />
        <meta property="og:image" content={HOME_OG_IMAGE_URL} />
      </Head>

      <WallpaperHero wallpaper={todayWallpaper} siteUrl={siteUrl} />

      <section className="container mx-auto px-5 py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="section-title mb-3">{t('home.whyTitle')}</h2>
          <p className="mx-auto max-w-2xl text-fg-muted">{t('site.description')}</p>
        </div>
        <FeatureGrid />
      </section>

      <section id="endpoints" className="container mx-auto px-5 pb-16 md:pb-24">
        <div className="space-y-16">
          <ApiEndpoints
            title={t('home.dailyTitle')}
            description={t('home.dailyDesc')}
            endpoints={DAILY_ENDPOINTS}
            siteUrl={siteUrl}
          />
          <ApiEndpoints
            title={t('home.randomTitle')}
            description={t('home.randomDesc')}
            endpoints={RANDOM_ENDPOINTS}
            siteUrl={siteUrl}
          />
        </div>
      </section>

      <section id="gallery" className="container mx-auto px-5 pb-16 md:pb-24">
        <h2 className="section-title mb-2">{t('home.galleryTitle')}</h2>
        <p className="mb-8 text-fg-muted">{t('home.galleryDesc')}</p>
        <WallpaperGallery wallpapers={recentWallpapers} />
      </section>

      <section id="usage" className="container mx-auto px-5 pb-20 md:pb-28">
        <UsageGuide siteUrl={siteUrl} />
      </section>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, locale }) => {
  const siteUrl = getSiteUrlFromRequest(req)

  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')

  const i18nProps = await serverSideTranslations(
    locale || 'zh-CN',
    ['common'],
    nextI18NextConfig
  )

  try {
    const [todayWallpaper, recentWallpapers] = await Promise.all([
      getCachedTodayWallpaper(),
      getCachedRecentWallpapers(),
    ])

    return {
      props: {
        ...i18nProps,
        siteUrl,
        todayWallpaper: todayWallpaper ?? FALLBACK_WALLPAPER,
        recentWallpapers: recentWallpapers ?? [],
      },
    }
  } catch {
    return {
      props: {
        ...i18nProps,
        siteUrl,
        todayWallpaper: FALLBACK_WALLPAPER,
        recentWallpapers: [],
      },
    }
  }
}
