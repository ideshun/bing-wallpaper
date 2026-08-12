/**
 * 按浏览器地址栏规则规范化站点 URL：
 * - https 默认不显示 :443
 * - http 默认不显示 :80
 * - 非默认端口保留（如 :8443）
 * @param siteUrl - 原始站点 URL 或 Host
 */
export function normalizeSiteUrl(siteUrl: string): string {
  const raw = siteUrl.trim().replace(/\/$/, '')
  if (!raw) return ''

  try {
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
    const url = new URL(withProto)
    const isHttps = url.protocol === 'https:'
    const isHttp = url.protocol === 'http:'

    // 与浏览器一致：仅隐藏协议默认端口
    if ((isHttps && url.port === '443') || (isHttp && url.port === '80')) {
      url.port = ''
    }

    return url.origin
  } catch {
    return raw
  }
}
