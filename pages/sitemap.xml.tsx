import type { GetServerSideProps } from 'next'
import { getAllPosts } from '../lib/api'
import { CANONICAL_SITE_URL } from '../lib/constants'
import { DEFAULT_LOCALE, LOCALES, localizedPath, type AppLocale } from '../lib/i18n'

/**
 * 生成带多语言 hreflang 的 sitemap URL 节点
 * @param path - 站点相对路径（如 / 或 /posts/xxx）
 * @param lastmod - 可选最后修改日期
 */
function urlEntry(path: string, lastmod?: string): string {
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
  const alternates = LOCALES.map((locale) => {
    const href = `${CANONICAL_SITE_URL}${localizedPath(path, locale as AppLocale)}`
    return `    <xhtml:link rel="alternate" hreflang="${locale}" href="${href}" />`
  }).join('\n')
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${CANONICAL_SITE_URL}${localizedPath(path, DEFAULT_LOCALE)}" />`
  const loc = `${CANONICAL_SITE_URL}${localizedPath(path, DEFAULT_LOCALE)}`

  return `  <url>
    <loc>${loc}</loc>${lastmodTag}
${alternates}
${xDefault}
  </url>`
}

/**
 * 动态生成 sitemap.xml（含多语言备用链接）
 */
function generateSitemapXml(): string {
  const posts = getAllPosts(['slug', 'date'])
  const urls = [
    urlEntry('/'),
    ...posts.map((post) => {
      const lastmod = post.date ? new Date(post.date).toISOString().slice(0, 10) : undefined
      return urlEntry(`/posts/${post.slug}`, lastmod)
    }),
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`
}

/**
 * Sitemap 页面组件（实际响应由 getServerSideProps 写出）
 */
const Sitemap = () => null

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const xml = generateSitemapXml()

  res.setHeader('Content-Type', 'text/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.write(xml)
  res.end()

  return { props: {} }
}

export default Sitemap
