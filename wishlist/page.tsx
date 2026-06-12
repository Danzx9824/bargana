import { Trash2, ArrowUpDown } from "lucide-react";
import { deals } from "@/lib/data";

export default function WishlistPage() {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Lista de Desejos</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg text-sm text-muted hover:text-white hover:border-muted transition-colors">
            <ArrowUpDown size={14} /> Ordenar por Preço
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg text-sm text-muted hover:text-white hover:border-muted transition-colors">
            <ArrowUpDown size={14} /> Ordenar por Desconto
          </button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {/* Header da Lista */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border text-xs text-muted uppercase tracking-wider">
          <div className="col-span-5">Produto</div>
          <div className="col-span-2">Plataforma</div>
          <div className="col-span-3">Preço</div>
          <div className="col-span-2 text-right">Ações</div>
        </div>

        {/* Itens */}
        {deals.slice(0, 3).map((deal) => (
          <div key={deal.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-border hover:bg-background/50 transition-colors items-center">
            <div className="col-span-5 flex items-center gap-4">
              <img src={deal.image} alt={deal.name} className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover" />
              <span className="font-medium">{deal.name}</span>
            </div>
            <div className="col-span-2 text-sm text-muted">{deal.platform}</div>
            <div className="col-span-3 flex items-baseline gap-2">
              <span className="text-gold font-bold text-lg">R$ {deal.currentPrice.toFixed(2)}</span>
              <span className="text-muted line-through text-xs">R$ {deal.originalPrice.toFixed(2)}</span>
            </div>
            <div className="col-span-2 flex justify-end">
              <button className="p-2 text-muted hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}