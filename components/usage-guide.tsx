'use client'

import { buildApiUrl } from '../lib/endpoints'
import { useSiteOrigin } from '../lib/use-site-origin'
import { useTranslation } from 'next-i18next/pages'
import CopyButton from './copy-button'

type Props = {
  siteUrl: string
}

/**
 * 用法说明与 idx 参数示例
 */
const UsageGuide = ({ siteUrl }: Props) => {
  const { t } = useTranslation('common')
  const origin = useSiteOrigin(siteUrl)
  const idxExample = buildApiUrl('/img/uhd?idx=1', origin)
  const htmlSnippet = `<img src="${buildApiUrl('/img/uhd', origin)}" alt="${t('usage.imgAlt')}" />`
  const cssSnippet = `background-image: url('${buildApiUrl('/img/fhd', origin)}');`

  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="section-title mb-2">{t('usage.title')}</h2>
      <p className="mb-6 text-fg-muted">{t('usage.intro')}</p>

      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-fg">{t('usage.html')}</h3>
          <div className="flex items-start gap-2">
            <code className="code-block flex-1">{htmlSnippet}</code>
            <CopyButton text={htmlSnippet} />
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-fg">{t('usage.css')}</h3>
          <div className="flex items-start gap-2">
            <code className="code-block flex-1">{cssSnippet}</code>
            <CopyButton text={cssSnippet} />
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-fg">{t('usage.idxTitle')}</h3>
          <p className="mb-3 text-sm text-fg-muted">
            {t('usage.idxDesc')}
          </p>
          <div className="flex items-start gap-2">
            <code className="code-block flex-1">{idxExample}</code>
            <CopyButton text={idxExample} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-fg-subtle">
            <span className="rounded-lg bg-fill px-3 py-1.5">{t('usage.idxToday')}</span>
            <span className="rounded-lg bg-fill px-3 py-1.5">{t('usage.idxYesterday')}</span>
            <span className="rounded-lg bg-fill px-3 py-1.5">{t('usage.idxWeek')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsageGuide
