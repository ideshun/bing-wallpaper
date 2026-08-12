import type { BingWallpaper } from './api'
import { getBingWallpapers } from './api'

/** 缓存条目 */
interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const TTL_MS = 60 * 60 * 1000 // 1 小时

let todayCache: CacheEntry<BingWallpaper | null> | null = null
let recentCache: CacheEntry<BingWallpaper[]> | null = null

/**
 * 获取今日壁纸（带内存缓存）
 */
export async function getCachedTodayWallpaper(): Promise<BingWallpaper | null> {
  if (todayCache && Date.now() < todayCache.expiresAt) {
    return todayCache.data
  }

  const [wallpaper] = await getBingWallpapers({ ind: 0, num: 1, type: '1920x1080' })
  todayCache = { data: wallpaper ?? null, expiresAt: Date.now() + TTL_MS }
  return todayCache.data
}

/**
 * 获取近期壁纸列表（带内存缓存）
 */
export async function getCachedRecentWallpapers(): Promise<BingWallpaper[]> {
  if (recentCache && Date.now() < recentCache.expiresAt) {
    return recentCache.data
  }

  const wallpapers = await getBingWallpapers({ ind: 0, num: 8, type: '1920x1080' })
  recentCache = { data: wallpapers, expiresAt: Date.now() + TTL_MS }
  return recentCache.data
}

/** 首页壁纸数据的兜底值 */
export const FALLBACK_WALLPAPER: BingWallpaper = {
  url: '',
  title: 'Bing 每日壁纸',
  copyright: '',
  date: '',
  idx: 0,
}
