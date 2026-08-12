import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentInitialProps,
} from 'next/document'
import { DEFAULT_LOCALE, HTML_LANG_MAP, type AppLocale } from '../lib/i18n'

type Props = DocumentInitialProps & {
  locale: string
}

/**
 * 自定义 Document，按 locale 设置 html lang
 */
class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext): Promise<Props> {
    const initialProps = await Document.getInitialProps(ctx)
    const locale = ctx.locale || DEFAULT_LOCALE
    return { ...initialProps, locale }
  }

  render() {
    const locale = (this.props.locale || DEFAULT_LOCALE) as AppLocale
    const lang = HTML_LANG_MAP[locale] || 'zh-CN'

    return (
      <Html lang={lang} suppressHydrationWarning>
        <Head />
        <body className="bg-surface">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
