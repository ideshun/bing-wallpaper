/**
 * next-i18next 配置
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en', 'zh-TW', 'de', 'fr', 'ja', 'ru'],
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
