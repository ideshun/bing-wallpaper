'use client'

import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect } from 'react'
import { GA_MEASUREMENT_ID, MATOMO_SITE_ID, MATOMO_URL } from '../lib/constants'

declare global {
  interface Window {
    _paq?: unknown[][]
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

/**
 * 上报 Matomo 页面浏览
 * @param url - 页面路径
 */
function trackMatomoPageView(url: string) {
  window._paq?.push(['setCustomUrl', url])
  window._paq?.push(['setDocumentTitle', document.title])
  window._paq?.push(['trackPageView'])
}

/**
 * 上报 GA4 页面浏览
 * @param url - 页面路径
 */
function trackGaPageView(url: string) {
  window.gtag?.('config', GA_MEASUREMENT_ID, { page_path: url })
}

/**
 * 全站统计：Matomo + Google Analytics
 */
const Analytics = () => {
  const router = useRouter()

  useEffect(() => {
    const onRouteChange = (url: string) => {
      trackMatomoPageView(url)
      trackGaPageView(url)
    }

    router.events.on('routeChangeComplete', onRouteChange)
    return () => router.events.off('routeChangeComplete', onRouteChange)
  }, [router.events])

  return (
    <>
      <Script id="matomo-init" strategy="afterInteractive">
        {`
          var _paq = window._paq = window._paq || [];
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
            var u="${MATOMO_URL}";
            _paq.push(['setTrackerUrl', u+'matomo.php']);
            _paq.push(['setSiteId', '${MATOMO_SITE_ID}']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
          })();
        `}
      </Script>

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}

export default Analytics
