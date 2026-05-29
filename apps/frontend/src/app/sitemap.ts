import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://save.digitalh.net';

  // Base static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/tiktok-downloader`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/youtube-downloader`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/instagram-downloader`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/facebook-downloader`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  // Fetch dynamic blog posts from Fastify API
  try {
    const apiUrl = process.env.API_URL || 'http://api:3001';
    const res = await fetch(`${apiUrl}/api/posts`, { 
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (res.ok) {
      const posts = await res.json();
      if (Array.isArray(posts)) {
        posts.forEach((post: any) => {
          if (post.slug) {
            routes.push({
              url: `${baseUrl}/blog/${post.slug}`,
              lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
              changeFrequency: 'weekly' as const,
              priority: 0.7,
            });
          }
        });
      }
    }
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
  }

  return routes;
}
