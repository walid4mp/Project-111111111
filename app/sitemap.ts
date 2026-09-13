import type { MetadataRoute } from 'next';

const routes = [
  '',
  '/games',
  '/games/1',
  '/live',
  '/live/1',
  '/voice',
  '/voice/1',
  '/chat',
  '/chat/1',
  '/store',
  '/gifts',
  '/profile',
  '/leaderboard',
  '/tournaments',
  '/tournaments/1',
  '/achievements',
  '/missions',
  '/friends',
  '/followers',
  '/following',
  '/favorites',
  '/inventory',
  '/settings',
  '/vip',
  '/terms',
  '/privacy',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith('/auth') ? 'monthly' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));
}
