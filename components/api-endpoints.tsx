'use client'

import type { ApiEndpoint } from '../lib/endpoints'
import { buildApiUrl, buildImgSnippet } from '../lib/endpoints'
import { useSiteOrigin } from '../lib/use-site-origin'
import { useTranslation } from 'next-i18next/pages'
import CopyButton from './copy-button'

type EndpointCardProps = {
  endpoint: ApiEndpoint
  siteUrl: string
}

/**
 * 单个 API 端点卡片
 */
const EndpointCard = ({ endpoint, siteUrl }: EndpointCardProps) => {
  const { t } = useTranslation('common')
  const label = t(endpoint.labelKey)
  const url = buildApiUrl(endpoint.path, siteUrl)
  const snippet = buildImgSnippet(endpoint.path, label, siteUrl)

  return (
    <div className="glass-card group p-5 transition-all duration-300 hover:border-bing-500/30 hover:shadow-bing-500/10">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-fg">{label}</h3>
            {endpoint.badgeKey && (
              <span className="rounded-full bg-bing-500/20 px-2 py-0.5 text-xs font-medium text-bing-700 dark:text-bing-300">
                {t(endpoint.badgeKey)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-fg-subtle">{endpoint.resolution}</p>
        </div>
        <CopyButton text={url} />
      </div>

      <p className="mb-4 text-sm text-fg-muted">{t(endpoint.descriptionKey)}</p>

      <div className="space-y-2">
        <code className="code-block block text-xs text-bing-700 dark:text-bing-300 break-all">{url}</code>
        <details className="group/details">
          <summary className="cursor-pointer text-xs text-fg-subtle transition-colors hover:text-fg-muted">
            {t('endpoints.viewHtml')}
          </summary>
          <div className="mt-2 flex items-start justify-between gap-2">
            <code className="code-block flex-1 text-xs">{snippet}</code>
            <CopyButton text={snippet} className="shrink-0" />
          </div>
        </details>
      </div>
    </div>
  )
}

type SectionProps = {
  title: string
  description: string
  endpoints: ApiEndpoint[]
  siteUrl: string
}

/**
 * API 端点列表区块
 */
const ApiEndpoints = ({ title, description, endpoints, siteUrl }: SectionProps) => {
  const origin = useSiteOrigin(siteUrl)

  return (
    <div>
      <h2 className="section-title mb-2">{title}</h2>
      <p className="mb-6 text-fg-muted">{description}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {endpoints.map((endpoint) => (
          <EndpointCard key={endpoint.id} endpoint={endpoint} siteUrl={origin} />
        ))}
      </div>
    </div>
  )
}

export default ApiEndpoints
