/**
 * 应用支持的语言列表与标签
 */

export const LOCALES = ['zh-CN', 'en', 'zh-TW', 'de', 'fr', 'ja', 'ru'] as const

export type AppLocale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = 'zh-CN'

/** 语言切换器展示名称 */
export const LOCALE_LABELS: Record<AppLocale, string> = {
  'zh-CN': '简体中文',
  en: 'English',
  'zh-TW': '繁體中文',
  de: 'Deutsch',
  fr: 'Français',
  ja: '日本語',
  ru: 'Русский',
}

/** 语言切换器按钮短标签 */
export const LOCALE_SHORT_LABELS: Record<AppLocale, string> = {
  'zh-CN': '中',
  en: 'EN',
  'zh-TW': '繁',
  de: 'DE',
  fr: 'FR',
  ja: '日',
  ru: 'RU',
}

/** Open Graph locale 映射 */
export const OG_LOCALE_MAP: Record<AppLocale, string> = {
  'zh-CN': 'zh_CN',
  en: 'en_US',
  'zh-TW': 'zh_TW',
  de: 'de_DE',
  fr: 'fr_FR',
  ja: 'ja_JP',
  ru: 'ru_RU',
}

/** HTML lang 属性映射 */
export const HTML_LANG_MAP: Record<AppLocale, string> = {
  'zh-CN': 'zh-CN',
  en: 'en',
  'zh-TW': 'zh-TW',
  de: 'de',
  fr: 'fr',
  ja: 'ja',
  ru: 'ru',
}

/**
 * 生成带语言前缀的路径（默认语言无前缀）
 * @param path - 以 / 开头的路径
 * @param locale - 语言
 */
export function localizedPath(path: string, locale: AppLocale): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (locale === DEFAULT_LOCALE) return normalized === '' ? '/' : normalized
  if (normalized === '/') return `/${locale}`
  return `/${locale}${normalized}`
}
