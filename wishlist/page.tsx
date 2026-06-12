"use client";

import { useWishlist } from "@/context/WishlistContext";
import { Trash2, Loader2, Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlistItems, loading, toggleWishlist } = useWishlist();

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gold" size={32} /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lista de Desejos</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-xl flex flex-col items-center">
          <Heart size={48} className="text-muted mb-4" />
          <h3 className="text-xl font-bold mb-2">Sua lista está vazia</h3>
          <p className="text-muted mb-6">Adicione jogos e produtos para acompanhar as ofertas.</p>
          <Link href="/" className="bg-gold text-background px-6 py-2 rounded-lg font-semibold hover:bg-gold-dark transition-colors">
            Explorar Ofertas
          </Link>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border text-xs text-muted uppercase tracking-wider">
            <div className="col-span-5">Produto</div>
            <div className="col-span-3">Melhor Preço Atual</div>
            <div className="col-span-2">Loja</div>
            <div className="col-span-2 text-right">Ações</div>
          </div>

          {wishlistItems.map((item) => {
            // Ordena para encontrar o menor preço atual entre as lojas disponíveis
            const cheapestListing = item.products.product_listings?.sort((a, b) => a.current_price - b.current_price)[0];

            return (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-border hover:bg-background/50 transition-colors items-center">
                <div className="col-span-5 flex items-center gap-4">
                  <img src={item.products.image_url || "/placeholder.jpg"} alt={item.products.title} className="w-12 h-16 md:w-16 md:h-20 rounded-lg object-cover" />
                  <span className="font-medium">{item.products.title}</span>
                </div>
                
                <div className="col-span-3 flex items-baseline gap-2">
                  {cheapestListing ? (
                    <>
                      <span className="text-gold font-bold text-lg">R$ {cheapestListing.current_price.toFixed(2)}</span>
                      {cheapestListing.discount_percent > 0 && (
                        <span className="text-muted line-through text-xs">R$ {cheapestListing.original_price.toFixed(2)}</span>
                      )}
                    </>
                  ) : (
                    <span className="text-muted text-sm">Sem estoque</span>
                  )}
                </div>

                <div className="col-span-2 text-sm text-muted">
                  {cheapestListing?.store || "-"}
                </div>

                <div className="col-span-2 flex justify-end">
                  <button onClick={() => toggleWishlist(item.product_id)} className="p-2 text-muted hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}