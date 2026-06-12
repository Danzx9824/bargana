"use client";

import { Heart, ExternalLink } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";

export default function OfferCard({ deal }: any) {
  const { wishlistProductIds, toggleWishlist } = useWishlist();
  const isWishlisted = wishlistProductIds.has(deal.product_id);

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden group hover:border-gold/50 transition-all duration-300 flex flex-col">
      <Link href={`/deal/${deal.product_id}`} className="relative aspect-[3/4] md:aspect-[4/3] overflow-hidden block">
        <img src={deal.image_url} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {deal.is_lowest_price && (
            <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full font-semibold bg-green-500/90 text-white">
              Menor Preço Histórico
            </span>
          )}
          {deal.is_new_offer && (
            <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full font-semibold bg-gold text-background">
              Nova Oferta
            </span>
          )}
        </div>

        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] md:text-xs text-gold border border-gold/30">
          {deal.platform}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-sm md:text-base mb-1 truncate" title={deal.title}>{deal.title}</h3>
        <p className="text-xs text-muted mb-3">{deal.store}</p>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <span className="block text-xs text-muted line-through">R$ {deal.original_price.toFixed(2)}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-gold font-bold text-xl">R$ {deal.current_price.toFixed(2)}</span>
              <span className="bg-gold/20 text-gold text-xs font-bold px-1.5 py-0.5 rounded">-{deal.discount_percent}%</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => toggleWishlist(deal.product_id)}
              className={`p-2 rounded-lg transition-colors ${isWishlisted ? 'bg-red-500/20 text-red-500' : 'bg-background hover:bg-red-500/20 hover:text-red-500 text-muted'}`}
            >
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <a href={deal.url || "#"} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-gold text-background hover:bg-gold-dark transition-colors">
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}