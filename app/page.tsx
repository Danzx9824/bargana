"use client";

import { useState, useEffect } from "react";
import OfferCard from "@/components/OfferCard";
import { platforms } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function Home() {
  const supabase = createClient();
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, [activeFilter]);

  const fetchDeals = async () => {
    setLoading(true);
    
    // Busca os produtos (com suas listagens/preços mais baixos)
    let query = supabase
      .from("product_listings")
      .select(`*, products (*)`)
      .order("discount_percent", { ascending: false });

    if (activeFilter !== "Todas") {
      query = query.or(`platform.ilike.%${activeFilter}%,store.ilike.%${activeFilter}%`);
    }

    const { data, error } = await query.limit(20);

    if (data) {
      // Formata para o formato que o OfferCard espera
      const formatted = data.map(d => ({
        product_id: d.product_id,
        title: d.products.title,
        image_url: d.products.image_url,
        platform: d.platform,
        store: d.store,
        current_price: d.current_price,
        original_price: d.original_price,
        discount_percent: d.discount_percent,
        is_lowest_price: d.is_lowest_price,
        is_new_offer: d.is_new_offer,
        url: d.url
      }));
      setDeals(formatted);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Ofertas em Destaque</h1>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => setActiveFilter(platform)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === platform 
                ? "bg-gold text-background" 
                : "bg-surface border border-border text-muted hover:text-white hover:border-muted"
            }`}
          >
            {platform}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-gold" size={32} /></div>
      ) : deals.length === 0 ? (
        <div className="text-center py-16 text-muted">Nenhuma oferta encontrada para esta categoria.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {deals.map((deal, i) => (
            <OfferCard key={i} deal={deal} />
          ))}
        </div>
      )}
    </div>
  );
}