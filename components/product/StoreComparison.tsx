import { CheckCircle, ExternalLink } from "lucide-react";

interface Listing {
  id: string;
  store: string;
  platform: string;
  current_price: number;
  original_price: number;
  discount_percent: number;
  url: string | null;
}

export default function StoreComparison({ listings }: { listings: Listing[] }) {
  const lowestPrice = Math.min(...listings.map(l => l.current_price));

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold">Comparar Preços</h2>
      </div>
      <div className="divide-y divide-border">
        {listings.sort((a,b) => a.current_price - b.current_price).map((listing) => (
          <div key={listing.id} className={`flex items-center justify-between p-4 ${listing.current_price === lowestPrice ? 'bg-gold/5' : 'hover:bg-background/50'} transition-colors`}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center font-bold text-sm text-muted">
                {listing.store.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-medium flex items-center gap-2">
                  {listing.store}
                  {listing.current_price === lowestPrice && (
                    <span className="text-[10px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle size={10} /> Melhor Preço
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted">{listing.platform}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-muted line-through text-xs">R$ {listing.original_price.toFixed(2)}</p>
                <p className={`font-bold text-lg ${listing.current_price === lowestPrice ? 'text-gold' : 'text-white'}`}>
                  R$ {listing.current_price.toFixed(2)}
                </p>
              </div>
              <a href={listing.url || "#"} target="_blank" rel="noopener noreferrer" className="p-2 bg-gold text-background rounded-lg hover:bg-gold-dark transition-colors">
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}