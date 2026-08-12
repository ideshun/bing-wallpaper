'use client'

import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next/pages'
import { CANONICAL_SITE_URL, HOME_OG_IMAGE_URL, SITE_NAME } from '../lib/constants'
import {
  DEFAULT_LOCALE,
  LOCALES,
  OG_LOCALE_MAP,
  localizedPath,
  type AppLocale,
} from '../lib/i18n'

/**
 * 去掉 locale 前缀，得到规范路径
 * @param asPath - router.asPath
 * @param locale - 当前语言
 */
function stripLocalePrefix(asPath: string, locale: string): string {
  const path = asPath.split('?')[0].split('#')[0]
  if (locale === DEFAULT_LOCALE) return path || '/'
  const prefix = `/${locale}`
  if (path === prefix) return '/'
  if (path.startsWith(`${prefix}/`)) return path.slice(prefix.length) || '/'
  return path || '/'
}

/**
 * 全局 Meta 标签（canonical、hreflang、OG、JSON-LD）
 */
const Meta = () => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const locale = (router.locale || DEFAULT_LOCALE) as AppLocale
  const path = stripLocalePrefix(router.asPath || '/', locale)
  const finalCanonical =
    path === '/' && locale === DEFAULT_LOCALE
      ? CANONICAL_SITE_URL
      : `${CANONICAL_SITE_URL}${localizedPath(path, locale)}`

  const title = t('site.title')
  const description = t('site.description')
  const ogLocale = OG_LOCALE_MAP[locale]
  const ogImageUrl = `${HOME_OG_IMAGE_URL}?locale=${encodeURIComponent(locale)}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: CANONICAL_SITE_URL,
        description,
        inLanguage: locale,
      },
      {
        '@type': 'Organization',
        name: SITE_NAME,
        url: CANONICAL_SITE_URL,
        description,
      },
    ],
  }

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={finalCanonical} />

      {LOCALES.map((loc) => (
        <link
          key={loc}
          rel="alternate"
          hrefLang={loc}
          href={`${CANONICAL_SITE_URL}${localizedPath(path, loc)}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${CANONICAL_SITE_URL}${localizedPath(path, DEFAULT_LOCALE)}`}
      />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/favicon/safari-pinned-tab.svg"
        color="#2563eb"
      />
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
      <meta name="msapplication-TileColor" content="#0f172a" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f8fafc" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0f172a" />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:locale" content={ogLocale} />
      {LOCALES.filter((loc) => loc !== locale).map((loc) => (
        <meta key={loc} property="og:locale:alternate" content={OG_LOCALE_MAP[loc]} />
      ))}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  )
}

export default Meta
