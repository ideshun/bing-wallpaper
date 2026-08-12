import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import { CANONICAL_SITE_URL, SITE_NAME } from '../../lib/constants'
import markdownToHtml from '../../lib/markdownToHtml'
import type PostType from '../../interfaces/post'
import nextI18NextConfig from '../../next-i18next.config'
import { LOCALES, localizedPath, type AppLocale } from '../../lib/i18n'

type Props = {
  post: PostType
  preview?: boolean
}

/**
 * Markdown 文档详情页
 */
export default function Post({ post, preview }: Props) {
  const router = useRouter()
  const title = `${post.title} | ${SITE_NAME}`
  const description = post.excerpt || `${post.title} — ${SITE_NAME}`
  const locale = (router.locale || 'zh-CN') as AppLocale
  const canonicalUrl = `${CANONICAL_SITE_URL}${localizedPath(`/posts/${post.slug}`, locale)}`

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout preview={preview}>
      <Container>
        <div className="pt-24">
          {router.isFallback ? (
            <PostTitle>Loading…</PostTitle>
          ) : (
            <article className="mb-32 max-w-4xl mx-auto">
              <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content={post.ogImage.url} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} />
            </article>
          )}
        </div>
      </Container>
    </Layout>
  )
}

type Params = {
  params: {
    slug: string
  }
  locale?: string
}

export async function getStaticProps({ params, locale }: Params) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'excerpt',
    'ogImage',
    'coverImage',
  ])
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh-CN', ['common'], nextI18NextConfig)),
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: LOCALES.flatMap((locale) =>
      posts.map((post) => ({
        params: { slug: post.slug },
        locale,
      }))
    ),
    fallback: false,
  }
}
