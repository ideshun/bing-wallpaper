import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import axios from 'axios'

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

/**
 * 获取必应每日壁纸列表
 * @param ind - 请求图片截止天数，0 为今天
 * @param num - 返回数量，最多 8 张
 * @param type - 分辨率类型
 */
export async function getBingWallpapers({
  ind = 0,
  num = 1,
  type = 'UHD',
}: {
  ind?: number
  num?: number
  type?: string
}): Promise<BingWallpaper[]> {
  const response = await axios.get<{ images: BingImageRaw[] }>(
    `https://cn.bing.com/HPImageArchive.aspx?format=js&idx=${ind}&n=${num}&mkt=zh-CN`
  )

  return response.data.images.map((image, index) => ({
    url: `https://cn.bing.com${image.urlbase}_${type}.jpg`,
    title: image.title,
    copyright: image.copyright,
    date: image.startdate,
    idx: ind + index,
  }))
}

/**
 * 获取单张必应壁纸 URL（兼容旧接口）
 * @param ind - 请求图片截止天数
 * @param num - 返回数量
 * @param type - 分辨率类型
 */
export async function getBingImages({
  ind = 0,
  num = 1,
  type = 'UHD',
}: {
  ind?: number
  num?: number
  type?: string
}): Promise<string> {
  const wallpapers = await getBingWallpapers({ ind, num, type })
  return wallpapers[0]?.url ?? ''
}
