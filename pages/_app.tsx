import type { AppProps } from 'next/app'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { appWithTranslation } from 'next-i18next/pages'
import { ThemeProvider } from 'next-themes'
import '../styles/index.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

/**
 * Next.js 应用入口（主题 + 多语言）
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className={`${inter.variable} ${display.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  )
}

export default appWithTranslation(MyApp)
