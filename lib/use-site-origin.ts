'use client'

import { useEffect, useState } from 'react'
import { normalizeSiteUrl } from './normalize-site-url'

/**
 * 获取与浏览器地址栏一致的站点 origin。
 * 挂载后使用 window.location.origin（与地址栏完全一致）；
 * SSR 首屏使用服务端 fallback（已按默认端口规则处理）。
 * @param fallback - 服务端解析的站点 URL
 */
export function useSiteOrigin(fallback: string): string {
  const [origin, setOrigin] = useState(() => normalizeSiteUrl(fallback) || fallback)

  useEffect(() => {
    // 浏览器地址栏显示什么，这里就用什么（含非默认端口）
    setOrigin(window.location.origin)
  }, [])

  return origin
}
