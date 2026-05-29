import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://save.digitalh.net';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Si on ajoute des pages d'articles de blog SEO plus tard, 
    // on pourra les fetcher depuis la base de données ici et les mapper.
  ]
}
