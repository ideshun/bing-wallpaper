'use client'

import Link from 'next/link'
import { useTranslation } from 'next-i18next/pages'
import { SITE_NAME } from '../lib/constants'
import LanguageSwitcher from './language-switcher'
import ThemeToggle from './theme-toggle'

/**
 * 顶部导航栏
 */
const Header = () => {
  const { t } = useTranslation('common')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-5 py-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <svg
            className="h-9 w-9 transition-transform group-hover:scale-105"
            viewBox="0 0 1024 1024"
            aria-hidden
          >
            <path
              d="M143.730932 493.357364H492.844714V31.92621c0-21.296612-24.268551-44.483212-41.511273-23.967248L153.263049 431.891644c-20.77618 33.26654-27.692443 61.465719-9.532117 61.46572z"
              fill="#33D413"
            />
            <path
              d="M530.274708 144.21619v349.141174h461.431154c21.310307 0 44.496908-24.254855 23.967248-41.511274L591.754123 153.734612c-33.26654-20.77618-61.479415-27.678748-61.479415-9.518422z"
              fill="#FFCB30"
            />
            <path
              d="M879.128274 530.636706H529.973406v461.431154c0 21.296612 24.268551 44.496908 41.511273 23.967248l298.111479-423.932682c20.789876-33.26654 27.692443-61.465719 9.532116-61.46572z"
              fill="#FF1843"
            />
            <path
              d="M493.707535 881.517217V532.362348H32.276381c-21.296612 0-44.483212 24.268551-23.967248 41.511273l423.932683 298.111479c33.211758 20.789876 61.465719 27.692443 61.465719 9.532117z"
              fill="#18ABFF"
            />
          </svg>
          <span className="text-lg font-semibold text-fg">{SITE_NAME}</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <a href="#endpoints" className="nav-link">
            API
          </a>
          <a href="#gallery" className="nav-link">
            {t('nav.gallery')}
          </a>
          <a href="#usage" className="hidden sm:inline-flex nav-link">
            {t('nav.usage')}
          </a>
          <ThemeToggle />
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}

export default Header
