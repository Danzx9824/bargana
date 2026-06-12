import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  // Busca o produto pelo slug da URL
  const { data: product } = await supabase.from("products").select("*").eq("slug", params.slug).single();
  if (!product) notFound();

  // Busca as lojas disponíveis para este produto
  const { data: listings } = await supabase.from("product_listings").select("*").eq("product_id", product.id);
  
  const parsedListings = listings?.map(l => ({
    ...l,
    current_price: typeof l.current_price === 'string' ? parseFloat(l.current_price) : l.current_price,
    original_price: typeof l.original_price === 'string' ? parseFloat(l.original_price) : l.original_price,
  })) || [];

  if (parsedListings.length === 0) return <div className="text-center py-16 text-muted">Nenhuma loja disponível no momento.</div>;

  // Encontra a loja mais barata
  const cheapestListing = parsedListings.sort((a, b) => a.current_price - b.current_price)[0];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna da Esquerda - Imagem e Info */}
        <div className="lg:col-span-1">
          <img src={product.image_url || "/placeholder.jpg"} alt={product.title} className="w-full rounded-xl border border-border mb-4 object-cover aspect-[3/4]" />
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <div className="bg-surface border border-border rounded-xl p-4">
            <p className="text-sm text-muted">Menor preço atual em <strong className="text-white">{cheapestListing.store}</strong></p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-gold font-bold text-4xl">R$ {cheapestListing.current_price.toFixed(2)}</span>
              {cheapestListing.discount_percent > 0 && (
                <span className="bg-gold/20 text-gold text-sm font-bold px-2 py-0.5 rounded">-{cheapestListing.discount_percent}%</span>
              )}
            </div>
            {cheapestListing.discount_percent > 0 && (
              <p className="text-muted line-through text-sm mt-1">R$ {cheapestListing.original_price.toFixed(2)}</p>
            )}
          </div>
        </div>

        {/* Coluna da Direita - Comparação de Lojas */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Comparar Preços</h2>
          <div className="bg-surface border border-border rounded-xl overflow-hidden divide-y divide-border">
            {parsedListings.map((listing) => (
              <div key={listing.id} className={`flex items-center justify-between p-4 ${listing.current_price === cheapestListing.current_price ? 'bg-gold/5' : 'hover:bg-background/50'} transition-colors`}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center font-bold text-sm text-muted">
                    {listing.store.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{listing.store}</p>
                    <p className="text-xs text-muted">{listing.platform}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-muted line-through text-xs">R$ {listing.original_price.toFixed(2)}</p>
                    <p className={`font-bold text-lg ${listing.current_price === cheapestListing.current_price ? 'text-gold' : 'text-white'}`}>
                      R$ {listing.current_price.toFixed(2)}
                    </p>
                  </div>
                  <a href={listing.url || "#"} target="_blank" rel="noopener noreferrer" className="p-2 bg-gold text-background rounded-lg hover:bg-gold-dark transition-colors text-sm font-semibold">
                    Ver Oferta
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}