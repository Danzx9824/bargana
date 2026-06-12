import { createClient } from "@/lib/supabase/server";
import OfferCard from "@/components/OfferCard";
import { platforms } from "@/lib/data";
import Link from "next/link";

// ISR: Revalida a página no cache a cada 60 segundos
export const revalidate = 60;

export default async function Home({ searchParams }: { searchParams: { filter?: string } }) {
  const supabase = await createClient();
  const activeFilter = searchParams.filter || "Todas";

  // Usa a View otimizada criada no banco (já retorna o menor preço agrupado)
  let query = supabase.from("deals_with_lowest_price").select("*").order("discount_percent", { ascending: false });

  if (activeFilter !== "Todas") {
    query = query.or(`listing_platform.ilike.%${activeFilter}%,store.ilike.%${activeFilter}%`);
  }

  const { data: deals } = await query.limit(30);

  const parsePrice = (price: number | string) => typeof price === 'string' ? parseFloat(price) : price;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Ofertas em Destaque</h1>

      {/* Filtros - Navegação por URL em vez de Estado (Melhora SEO e Cache) */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {platforms.map((platform) => (
          <Link 
            key={platform} 
            href={`/?filter=${platform}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === platform 
                ? "bg-gold text-background" 
                : "bg-surface border border-border text-muted hover:text-white hover:border-muted"
            }`}
          >
            {platform}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {deals?.map((deal) => (
          <OfferCard 
            key={deal.product_id} 
            deal={{
              ...deal,
              current_price: parsePrice(deal.current_price),
              original_price: parsePrice(deal.original_price)
            }} 
          />
        ))}
      </div>
    </div>
  );
}