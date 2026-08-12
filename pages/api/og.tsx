import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { DEFAULT_LOCALE, type AppLocale } from '../../lib/i18n'

export const config = {
  runtime: 'edge',
}

/** OG 文案按语言内联（Edge 下不便读 JSON 文件） */
const OG_COPY: Record<
  AppLocale,
  { h1: string; subtitle: string; font: 'cjk' | 'latin' | 'cyrillic' }
> = {
  'zh-CN': {
    h1: '必应每日壁纸 API',
    subtitle: '简单、快速地获取来自世界各地的高清壁纸，支持多种分辨率与随机获取',
    font: 'cjk',
  },
  en: {
    h1: 'Daily Bing Wallpaper API',
    subtitle:
      'Fetch beautiful wallpapers from around the world quickly, with multiple resolutions and random picks',
    font: 'latin',
  },
  'zh-TW': {
    h1: '必應每日壁紙 API',
    subtitle: '簡單、快速地取得來自世界各地的高清壁紙，支援多種解析度與隨機取得',
    font: 'cjk',
  },
  de: {
    h1: 'Tägliche Bing-Wallpaper-API',
    subtitle:
      'Holen Sie schnell hochwertige Wallpapers aus aller Welt, mit mehreren Auflösungen und Zufallsauswahl',
    font: 'latin',
  },
  fr: {
    h1: 'API de fonds d\'écran Bing quotidiens',
    subtitle:
      'Récupérez rapidement de magnifiques images du monde entier, avec plusieurs résolutions et un mode aléatoire',
    font: 'latin',
  },
  ja: {
    h1: 'Bing 毎日壁紙 API',
    subtitle: '世界各地の美しい壁紙を素早く取得。複数の解像度とランダム取得に対応',
    font: 'cjk',
  },
  ru: {
    h1: 'API ежедневных обоев Bing',
    subtitle:
      'Быстро получайте красивые обои со всего мира в разных разрешениях, включая случайный выбор',
    font: 'cyrillic',
  },
}

/**
 * 按书写系统加载字体
 * @param kind - 字体类别
 */
async function loadFont(kind: 'cjk' | 'latin' | 'cyrillic'): Promise<ArrayBuffer | null> {
  const urls = {
    cjk: 'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-sc@5.0.0/chinese-simplified-700-normal.woff',
    latin:
      'https://cdn.jsdelivr.net/fontsource/fonts/inter@5.0.0/latin-700-normal.woff',
    cyrillic:
      'https://cdn.jsdelivr.net/fontsource/fonts/inter@5.0.0/cyrillic-700-normal.woff',
  }

  try {
    const res = await fetch(urls[kind])
    if (!res.ok) return null
    return res.arrayBuffer()
  } catch {
    return null
  }
}

/**
 * 动态生成 Open Graph 分享图（1200×630），支持 ?locale=
 */
export default async function handler(req: NextRequest) {
  const localeParam = req.nextUrl.searchParams.get('locale') || DEFAULT_LOCALE
  const locale = (localeParam in OG_COPY ? localeParam : DEFAULT_LOCALE) as AppLocale
  const copy = OG_COPY[locale]

  const fontData = await loadFont(copy.font)
  const fonts = fontData
    ? [
        {
          name: 'OG Sans',
          data: fontData,
          style: 'normal' as const,
          weight: 700 as const,
        },
      ]
    : []

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #1e3a8a 100%)',
          padding: '64px 72px',
          color: '#f8fafc',
          fontFamily: fonts.length ? 'OG Sans' : 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              width: 64,
              height: 64,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <div style={{ width: 32, height: 32, background: '#33D413' }} />
            <div style={{ width: 32, height: 32, background: '#FFCB30' }} />
            <div style={{ width: 32, height: 32, background: '#18ABFF' }} />
            <div style={{ width: 32, height: 32, background: '#FF1843' }} />
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#94a3b8',
              letterSpacing: 1,
            }}
          >
            Bing Wallpaper
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              fontSize: copy.font === 'cjk' ? 56 : 52,
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: -1,
            }}
          >
            {copy.h1}
          </div>
          <div
            style={{
              fontSize: 26,
              color: '#cbd5e1',
              lineHeight: 1.45,
              maxWidth: 920,
            }}
          >
            {copy.subtitle}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 24,
            color: '#64748b',
          }}
        >
          <span>bz.w3h5.com</span>
          <span>UHD · 1080P · Random · History</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    }
  )
}
