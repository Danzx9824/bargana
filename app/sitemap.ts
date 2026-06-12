import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("slug, updated_at");

  const productEntries = products?.map(product => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  })) || [];

  return [
    {
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bargana.com.br',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...productEntries
  ]
}