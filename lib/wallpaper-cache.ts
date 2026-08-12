import type { BingWallpaper } from './api'
import { getBingWallpapers } from './api'
import { DEFAULT_LOCALE } from './i18n'
import { toTraditionalZh } from './zh-convert'

/** 缓存条目 */
interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const TTL_MS = 60 * 60 * 1000 // 1 小时

/** 按应用语言缓存，避免 zh-TW 转换结果与 zh-CN 互相覆盖 */
const recentCache = new Map<string, CacheEntry<BingWallpaper[]>>()
/** 同一语言并发请求复用，避免 banner / 画廊各打一次 */
const inflight = new Map<string, Promise<BingWallpaper[]>>()

/**
 * 将壁纸文案转为繁体（用于 zh-TW）
 * @param wallpaper - 简体壁纸数据
 */
function toTraditionalWallpaper(wallpaper: BingWallpaper): BingWallpaper {
  return {
    ...wallpaper,
    title: toTraditionalZh(wallpaper.title),
    copyright: toTraditionalZh(wallpaper.copyright),
  }
}

/**
 * 拉取并缓存某语言的近期壁纸（含今日）
 * @param locale - 应用语言
 */
async function loadLocaleWallpapers(
  locale: string = DEFAULT_LOCALE
): Promise<BingWallpaper[]> {
  const cacheKey = locale || DEFAULT_LOCALE
  const cached = recentCache.get(cacheKey)
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data
  }

  const pending = inflight.get(cacheKey)
  if (pending) return pending

  const request = getBingWallpapers({
    ind: 0,
    num: 8,
    type: '1920x1080',
    locale,
  })
    .then((wallpapers) => {
      const localized =
        cacheKey === 'zh-TW'
          ? wallpapers.map(toTraditionalWallpaper)
          : wallpapers
      recentCache.set(cacheKey, {
        data: localized,
        expiresAt: Date.now() + TTL_MS,
      })
      return localized
    })
    .finally(() => {
      inflight.delete(cacheKey)
    })

  inflight.set(cacheKey, request)
  return request
}

/**
 * 获取今日壁纸（与画廊同一份数据的首项）
 * @param locale - 应用语言
 */
export async function getCachedTodayWallpaper(
  locale: string = DEFAULT_LOCALE
): Promise<BingWallpaper | null> {
  const wallpapers = await loadLocaleWallpapers(locale)
  return wallpapers[0] ?? null
}

/**
 * 获取近期壁纸列表（按语言缓存）
 * @param locale - 应用语言
 */
export async function getCachedRecentWallpapers(
  locale: string = DEFAULT_LOCALE
): Promise<BingWallpaper[]> {
  return loadLocaleWallpapers(locale)
}

/** 首页壁纸数据的兜底值 */
export const FALLBACK_WALLPAPER: BingWallpaper = {
  url: '',
  title: 'Bing Wallpaper',
  copyright: '',
  date: '',
  idx: 0,
}
