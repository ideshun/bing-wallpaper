import Footer from './footer'
import Header from './header'
import Meta from './meta'

type Props = {
  preview?: boolean
  children: React.ReactNode
}

/**
 * 全局页面布局
 */
const Layout = ({ children }: Props) => {
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  )
}

export default Layout
