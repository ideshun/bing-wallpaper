import type { IncomingMessage } from 'http'
import { DEFAULT_SITE_URL } from './constants'
import { normalizeSiteUrl } from './normalize-site-url'

export { normalizeSiteUrl } from './normalize-site-url'

/**
 * 从请求头解析当前访问的站点 URL（支持多域名）
 * 规则与浏览器地址栏一致：仅隐藏 https:443 / http:80
 * @param req - Node.js 请求对象
 */
export function getSiteUrlFromRequest(req: IncomingMessage): string {
  const forwardedHost = req.headers['x-forwarded-host']
  const rawHost =
    pickHeader(forwardedHost) ||
    req.headers.host ||
    new URL(DEFAULT_SITE_URL).host

  const host = rawHost.split(',')[0]?.trim() || rawHost

  const forwardedProto = req.headers['x-forwarded-proto']
  const proto =
    pickHeader(forwardedProto)?.split(',')[0]?.trim() ||
    (isLocalHost(host) ? 'http' : 'https')

  if (isLocalHost(host)) {
    const fromEnv = process.env.NEXT_PUBLIC_SITE_URL
    if (fromEnv) return normalizeSiteUrl(fromEnv) || fromEnv
  }

  return normalizeSiteUrl(`${proto}://${host}`) || DEFAULT_SITE_URL
}

/**
 * 是否为本地访问
 * @param host - Host 字符串
 */
function isLocalHost(host: string): boolean {
  return (
    host.includes('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.startsWith('[::1]')
  )
}

/**
 * 取首个 header 值
 * @param value - header 原始值
 */
function pickHeader(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0]
  return value
}
