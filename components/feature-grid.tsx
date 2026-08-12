'use client'

import { useTranslation } from 'next-i18next/pages'

/**
 * 功能特性展示
 */
const FeatureGrid = () => {
  const { t } = useTranslation('common')

  const features = [
    {
      key: 'resolution',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      key: 'random',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      key: 'history',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: 'easy',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => (
        <div
          key={feature.key}
          className="glass-card p-5 transition-all duration-300 hover:border-bing-500/20"
        >
          <div className="mb-3 inline-flex rounded-xl bg-bing-500/10 p-2.5 text-bing-600 dark:text-bing-400">
            {feature.icon}
          </div>
          <h3 className="mb-1.5 font-semibold text-fg">
            {t(`features.${feature.key}.title`)}
          </h3>
          <p className="text-sm text-fg-muted">
            {t(`features.${feature.key}.description`)}
          </p>
        </div>
      ))}
    </div>
  )
}

export default FeatureGrid
