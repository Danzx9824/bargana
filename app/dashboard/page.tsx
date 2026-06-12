"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Heart, Bell, TrendingDown, Trophy } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const supabase = createClient();
  const { user } = useAuth();
  const [stats, setStats] = useState({ wishlistCount: 0, alertsCount: 0, lowestHistoryCount: 0, highestDiscount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Busca Wishlist com listagens
    const { data: wishlistData } = await supabase
      .from("wishlists")
      .select(`id, products ( product_listings ( current_price, original_price, is_lowest_price, discount_percent ) )`)
      .eq("user_id", user!.id);

    // Busca Alertas Ativos
    const { count: alertCount } = await supabase
      .from("price_alerts")
      .select("*", { count: 'exact', head: true })
      .eq("user_id", user!.id)
      .eq("is_active", true);

    let lowestHistoryCount = 0;
    let highestDiscount = 0;

    if (wishlistData) {
      wishlistData.forEach(item => {
        const listings = item.products.product_listings;
        if (listings && listings.length > 0) {
          listings.forEach((l: any) => {
            const price = typeof l.current_price === 'string' ? parseFloat(l.current_price) : l.current_price;
            const origPrice = typeof l.original_price === 'string' ? parseFloat(l.original_price) : l.original_price;
            
            if (l.is_lowest_price) lowestHistoryCount++;
            const disc = origPrice > 0 ? Math.round(((origPrice - price) / origPrice) * 100) : 0;
            if (disc > highestDiscount) highestDiscount = disc;
          });
        }
      });

      setStats({
        wishlistCount: wishlistData.length,
        alertsCount: alertCount || 0,
        lowestHistoryCount,
        highestDiscount
      });
    }
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gold" size={32} /></div>;

  const cards = [
    { title: "Itens na Wishlist", value: stats.wishlistCount, icon: Heart, color: "text-red-500" },
    { title: "Alertas Ativos", value: stats.alertsCount, icon: Bell, color: "text-blue-500" },
    { title: "Menor Preço Histórico", value: stats.lowestHistoryCount, icon: Trophy, color: "text-gold" },
    { title: "Maior Desconto na Lista", value: `${stats.highestDiscount}%`, icon: TrendingDown, color: "text-green-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(card => (
          <div key={card.title} className="bg-surface border border-border rounded-xl p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm text-muted">{card.title}</p>
              <card.icon className={card.color} size={20} />
            </div>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 text-center">
        <h3 className="font-bold mb-2">Estatísticas Avançadas em Breve</h3>
        <p className="text-sm text-muted">Gráficos de economia, evolução de preços da sua lista e comparação de lojas serão adicionados aqui.</p>
      </div>
    </div>
  );
}