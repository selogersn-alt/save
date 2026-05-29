import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // Ne pas indexer la page d'administration
    },
    sitemap: 'https://save.digitalh.net/sitemap.xml',
  }
}
