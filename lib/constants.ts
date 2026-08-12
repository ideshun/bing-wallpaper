export const SITE_NAME = 'Bing Wallpaper'
export const SITE_DESCRIPTION =
  '必应每日壁纸 API — 简单、快速地获取来自世界各地的高清壁纸，支持多种分辨率与随机获取。'
/** SEO / canonical 使用的主域名（不随访问域名变化） */
export const CANONICAL_SITE_URL = 'https://bz.w3h5.com'
/** 默认站点 URL，本地开发或未识别 Host 时使用 */
export const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || CANONICAL_SITE_URL
/** @deprecated 请使用 getSiteUrlFromRequest 或传入的 siteUrl */
export const SITE_URL = DEFAULT_SITE_URL
export const GITHUB_URL = 'https://github.com/ideshun/bing-wallpaper'
export const CMS_NAME = 'Markdown'

/** Matomo 统计 */
export const MATOMO_URL = 'https://a.w3to.dev/'
export const MATOMO_SITE_ID = '16'

/** Google Analytics 4 */
export const GA_MEASUREMENT_ID = 'G-455T3QD0VM'

/** @deprecated 保留兼容 */
export const EXAMPLE_PATH = 'blog-starter'
export const HOME_OG_IMAGE_URL = `${CANONICAL_SITE_URL}/api/og`
