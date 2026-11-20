// app/sitemap.ts - Next.js App Router sitemap generation
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ecosense.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/deforestation`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/reforestation`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/carbon`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/waterlogging`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/about`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/data-sources`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/legal/privacy`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${BASE_URL}/legal/terms`, priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  return routes.map(r => ({
    url: r.url,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
