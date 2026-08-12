import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import axios from 'axios'
import { DEFAULT_LOCALE, toBingMkt } from './i18n'

const postsDirectory = join(process.cwd(), '_posts')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  type Items = {
    [key: string]: string
  }

  const items: Items = {}

  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })

  return items
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}

/**
 * 在对象中查找是否存在对应的 key
 * @param obj - 待查询对象
 * @param targetKey - 目标 key
 */
export const findKey = (obj: Record<string, string>, targetKey: string) => {
  const keys = Object.keys(obj)
  if (keys.includes(targetKey)) {
    return targetKey
  }
  return undefined
}

/** Bing 壁纸原始数据 */
export interface BingImageRaw {
  urlbase: string
  title: string
  copyright: string
  startdate: string
  enddate: string
  quiz?: string
}

/** 格式化后的 Bing 壁纸 */
export interface BingWallpaper {
  url: string
  title: string
  copyright: string
  date: string
  idx: number
}

const BING_UA = 'Mozilla/5.0 (compatible; bing-wallpaper/1.0)'

/**
 * 按市场选择 Bing API 主机（非中文不要回退 www/cn，国内 IP 会强制中文）
 * @param mkt - Bing 市场代码
 */
function bingHostsForMkt(mkt: string): string[] {
  if (mkt === 'zh-CN') {
    return ['https://cn.bing.com', 'https://www.bing.com', 'https://global.bing.com']
  }
  return ['https://global.bing.com', 'https://global.bing.com', 'https://global.bing.com']
}

/**
 * 壁纸图片 CDN 主机
 * @param mkt - Bing 市场代码
 */
function bingImageHost(mkt: string): string {
  return mkt === 'zh-CN' ? 'https://cn.bing.com' : 'https://www.bing.com'
}

/**
 * 标题是否可用（Bing ROW 市场常返回无意义的 Info）
 * @param title - 原始标题
 */
function isUsableTitle(title?: string): boolean {
  const normalized = (title || '').trim().toLowerCase()
  return normalized.length > 0 && normalized !== 'info'
}

/**
 * 解析展示标题：无效时回退到 copyright 描述
 * @param title - Bing title
 * @param copyright - Bing copyright
 */
function resolveTitle(title: string, copyright: string): string {
  if (isUsableTitle(title)) return title.trim()
  const fromCopyright = (copyright || '').split(/\(©|©/)[0].trim()
  return fromCopyright || title.trim() || 'Bing Wallpaper'
}

/**
 * 校验返回结果是否属于目标市场（防止被强制成中文）
 * @param images - Bing 返回的图片列表
 * @param mkt - 目标市场
 */
function matchesBingMkt(images: BingImageRaw[], mkt: string): boolean {
  const first = images[0]
  const urlbase = first?.urlbase
  if (!urlbase) return false
  const base = urlbase.toUpperCase()
  const tag = mkt.toUpperCase()
  if (base.includes(`_${tag}`)) return true
  // ROW 仅在标题可用时接受，避免 Info 占位文案
  if (mkt !== 'zh-CN' && base.includes('_ROW') && isUsableTitle(first.title)) {
    return true
  }
  return false
}

/**
 * 获取必应每日壁纸列表
 * @param ind - 请求图片截止天数，0 为今天
 * @param num - 返回数量，最多 8 张
 * @param type - 分辨率类型
 * @param locale - 应用语言（映射为 Bing mkt，影响标题/版权文案）
 */
export async function getBingWallpapers({
  ind = 0,
  num = 1,
  type = 'UHD',
  locale = DEFAULT_LOCALE,
}: {
  ind?: number
  num?: number
  type?: string
  locale?: string
}): Promise<BingWallpaper[]> {
  const mkt = toBingMkt(locale)
  const hosts = bingHostsForMkt(mkt)
  let lastError: unknown

  for (const host of hosts) {
    try {
      const response = await axios.get<{ images: BingImageRaw[] }>(
        `${host}/HPImageArchive.aspx`,
        {
          params: { format: 'js', idx: ind, n: num, mkt },
          timeout: 10000,
          headers: {
            'User-Agent': BING_UA,
            Cookie: `_EDGE_S=mkt=${mkt}`,
          },
        }
      )

      const images = response.data?.images
      if (!images?.length) continue
      if (!matchesBingMkt(images, mkt)) continue

      const imageHost = bingImageHost(mkt)
      return images.map((image, index) => ({
        url: `${imageHost}${image.urlbase}_${type}.jpg`,
        title: resolveTitle(image.title, image.copyright),
        copyright: image.copyright,
        date: image.startdate,
        idx: ind + index,
      }))
    } catch (error) {
      lastError = error
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Failed to fetch Bing wallpapers for mkt=${mkt}`)
}

/**
 * 获取单张必应壁纸 URL（兼容旧接口）
 * @param ind - 请求图片截止天数
 * @param num - 返回数量
 * @param type - 分辨率类型
 * @param locale - 应用语言
 */
export async function getBingImages({
  ind = 0,
  num = 1,
  type = 'UHD',
  locale = DEFAULT_LOCALE,
}: {
  ind?: number
  num?: number
  type?: string
  locale?: string
}): Promise<string> {
  const wallpapers = await getBingWallpapers({ ind, num, type, locale })
  return wallpapers[0]?.url ?? ''
}
