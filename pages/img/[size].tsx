import type { GetServerSideProps } from 'next'
import { findKey, getBingImages } from '../../lib/api'
import type { AppLocale } from '../../lib/i18n'

const sizes: Record<string, string> = {
  uhd: 'UHD',
  fhd: '1920x1080',
  hd: '1366x768',
  m: '1080x1920',
  rand: 'UHD',
  rand_fhd: '1920x1080',
  rand_hd: '1366x768',
  rand_m: '1080x1920',
}

const ERROR_TEXT: Record<AppLocale, string> = {
  'zh-CN': '图片加载失败',
  en: 'Failed to load image',
  'zh-TW': '圖片載入失敗',
  de: 'Bild konnte nicht geladen werden',
  fr: "Échec du chargement de l'image",
  ja: '画像の読み込みに失敗しました',
  ru: 'Не удалось загрузить изображение',
}

type Props = {
  imageUrl: string | null
  locale: string
}

/**
 * 壁纸图片 API 路由 — 302 重定向到 Bing 原图
 */
const DynamicPage = ({ imageUrl, locale }: Props) => {
  if (!imageUrl) {
    const text = ERROR_TEXT[(locale as AppLocale) in ERROR_TEXT ? (locale as AppLocale) : 'zh-CN']
    return <p>{text}</p>
  }
  return null
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
  query,
  res,
  locale,
}) => {
  try {
    const size = params?.size as string
    const idx = query.idx ? Number(query.idx) : 0
    let type = 'UHD'

    const key = findKey(sizes, size?.toLowerCase() ?? '')
    if (key) type = sizes[key]

    const isRand = key?.includes('rand') ?? false
    const ind = isRand ? Math.floor(Math.random() * 15) : idx % 15

    const imageUrl = await getBingImages({ ind, type })

    if (imageUrl && res) {
      res.writeHead(302, {
        Location: imageUrl,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Robots-Tag': 'noindex, nofollow',
      })
      res.end()
    }

    return { props: { imageUrl: imageUrl || null, locale: locale || 'zh-CN' } }
  } catch (error) {
    console.error('Error fetching image:', error instanceof Error ? error.message : error)
    return { props: { imageUrl: null, locale: locale || 'zh-CN' } }
  }
}

export default DynamicPage
