import { DEFAULT_SITE_URL } from './constants'
import { normalizeSiteUrl } from './normalize-site-url'

/** API 端点配置（文案通过 i18n key 解析） */
export interface ApiEndpoint {
  id: string
  labelKey: string
  path: string
  resolution: string
  descriptionKey: string
  badgeKey?: string
}

/** 每日壁纸 API 端点 */
export const DAILY_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'uhd',
    labelKey: 'endpoints.uhd.label',
    path: '/img/uhd',
    resolution: '3840×2160',
    descriptionKey: 'endpoints.uhd.description',
    badgeKey: 'endpoints.recommended',
  },
  {
    id: 'fhd',
    labelKey: 'endpoints.fhd.label',
    path: '/img/fhd',
    resolution: '1920×1080',
    descriptionKey: 'endpoints.fhd.description',
  },
  {
    id: 'hd',
    labelKey: 'endpoints.hd.label',
    path: '/img/hd',
    resolution: '1366×768',
    descriptionKey: 'endpoints.hd.description',
  },
  {
    id: 'm',
    labelKey: 'endpoints.m.label',
    path: '/img/m',
    resolution: '1080×1920',
    descriptionKey: 'endpoints.m.description',
  },
]

/** 随机壁纸 API 端点 */
export const RANDOM_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'rand',
    labelKey: 'endpoints.rand.label',
    path: '/img/rand',
    resolution: '3840×2160',
    descriptionKey: 'endpoints.rand.description',
  },
  {
    id: 'rand_fhd',
    labelKey: 'endpoints.rand_fhd.label',
    path: '/img/rand_fhd',
    resolution: '1920×1080',
    descriptionKey: 'endpoints.rand_fhd.description',
  },
  {
    id: 'rand_hd',
    labelKey: 'endpoints.rand_hd.label',
    path: '/img/rand_hd',
    resolution: '1366×768',
    descriptionKey: 'endpoints.rand_hd.description',
  },
  {
    id: 'rand_m',
    labelKey: 'endpoints.rand_m.label',
    path: '/img/rand_m',
    resolution: '1080×1920',
    descriptionKey: 'endpoints.rand_m.description',
  },
]

/**
 * 生成完整的 API URL
 * @param path - 相对路径
 * @param siteUrl - 站点根 URL，默认使用 DEFAULT_SITE_URL
 */
export function buildApiUrl(path: string, siteUrl: string = DEFAULT_SITE_URL): string {
  const base = normalizeSiteUrl(siteUrl) || DEFAULT_SITE_URL
  return `${base}${path}`
}

/**
 * 生成 HTML img 标签示例
 * @param path - 相对路径
 * @param alt - 图片 alt 文本
 * @param siteUrl - 站点根 URL
 */
export function buildImgSnippet(path: string, alt: string, siteUrl?: string): string {
  return `<img src="${buildApiUrl(path, siteUrl)}" alt="${alt}" />`
}
