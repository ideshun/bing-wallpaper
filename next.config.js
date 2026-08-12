const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    ...i18n,
    localeDetection: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cn.bing.com',
        pathname: '/th/**',
      },
      {
        protocol: 'https',
        hostname: 'www.bing.com',
        pathname: '/th/**',
      },
    ],
  },
}

module.exports = nextConfig
