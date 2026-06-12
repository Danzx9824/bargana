"use client";

import { useState } from "react";
import { Heart, ExternalLink, ArrowLeft, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { deals, priceHistory } from "@/lib/data";
import Link from "next/link";

export default function DealPage() {
  const [chartFilter, setChartFilter] = useState("90d");
  const deal = deals[0]; // Mock: Pegando Hollow Knight

  const stats = [
    { label: "Menor Preço", value: "R$ 19.99", icon: TrendingDown, color: "text-green-500" },
    { label: "Maior Preço", value: "R$ 59.99", icon: TrendingUp, color: "text-red-500" },
    { label: "Preço Médio", value: "R$ 42.50", icon: Minus, color: "text-blue-500" },
  ];

  return (
    <div>
      <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-gold mb-6 transition-colors">
        <ArrowLeft size={16} /> Voltar para ofertas
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Imagem */}
        <div className="lg:col-span-1 bg-surface rounded-xl border border-border overflow-hidden aspect-[3/4] md:aspect-auto">
          <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" />
        </div>

        {/* Informações */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-gold/20 text-gold text-xs font-bold px-2 py-0.5 rounded">{deal.platform}</span>
            <span className="bg-background text-muted text-xs font-medium px-2 py-0.5 rounded border border-border">{deal.store}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{deal.name}</h1>
          
          <div className="flex items-center gap-4 mb-2">
            <span className="text-muted line-through text-lg">R$ {deal.originalPrice.toFixed(2)}</span>
            <span className="bg-gold text-background font-bold px-2 py-1 rounded text-sm">-{deal.discount}%</span>
          </div>
          <div className="text-gold font-bold text-4xl mb-6">R$ {deal.currentPrice.toFixed(2)}</div>

          <p className="text-xs text-muted mb-6">Última atualização: Hoje, 14:32</p>

          <div className="flex gap-3 mt-auto">
            <button className="flex-1 bg-gold hover:bg-gold-dark text-background font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <ExternalLink size={18} /> Ver Oferta na Loja
            </button>
            <button className="p-3 border border-border rounded-lg text-muted hover:text-red-500 hover:border-red-500 transition-colors">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Histórico de Preços - Estilo SteamDB */}
      <div className="bg-surface border border-border rounded-xl p-4 md:p-6">
        <h2 className="text-xl font-bold mb-4">Histórico de Preços</h2>
        
        {/* Filtros do Gráfico */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["30d", "90d", "6m", "1y", "Tudo"].map((f) => (
            <button 
              key={f} 
              onClick={() => setChartFilter(f)}
              className={`px-3 py-1 text-xs rounded border transition-colors ${
                chartFilter === f ? "border-gold text-gold bg-gold/10" : "border-border text-muted hover:text-white"
              }`}
            >
              {f === "30d" ? "30 dias" : f === "90d" ? "90 dias" : f === "6m" ? "6 meses" : f === "1y" ? "1 ano" : "Todo histórico"}
            </button>
          ))}
        </div>

        <div className="h-[300px] md:h-[400px] w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceHistory}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
              <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} tickFormatter={(v) => `R$${v}`} />
              <Tooltip 
                contentStyle={{ background: '#141414', border: '1px solid #D4AF37', borderRadius: '8px', color: '#fff' }}
                labelStyle={{ color: '#888' }}
                formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Preço']}
              />
              <Area type="monotone" dataKey="price" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-background p-4 rounded-lg border border-border flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`${stat.color} opacity-50`} size={24} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}