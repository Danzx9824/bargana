"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Bell, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  productId: string;
  currentLowestPrice: number;
}

export default function PriceAlertManager({ productId, currentLowestPrice }: Props) {
  const supabase = createClient();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [targetPrice, setTargetPrice] = useState<string>((currentLowestPrice * 0.9).toFixed(2)); // Sugere 10% abaixo
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchAlerts();
  }, [user]);

  const fetchAlerts = async () => {
    const { data } = await supabase
      .from("price_alerts")
      .select("*")
      .eq("user_id", user!.id)
      .eq("product_id", productId);
    
    if (data) setAlerts(data);
  };

  const createAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Logue para criar alertas.");
    setLoading(true);

    const { error } = await supabase.from("price_alerts").insert({
      user_id: user.id,
      product_id: productId,
      target_price: parseFloat(targetPrice),
    });

    if (error) toast.error("Erro ao criar alerta.");
    else {
      toast.success("Alerta criado com sucesso!");
      fetchAlerts();
    }
    setLoading(false);
  };

  const deleteAlert = async (id: string) => {
    await supabase.from("price_alerts").delete().eq("id", id);
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast.info("Alerta removido.");
  };

  if (!user) return null;

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <h3 className="font-bold mb-4 flex items-center gap-2"><Bell size={18} className="text-gold" /> Alertas de Preço</h3>
      
      <form onSubmit={createAlert} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">R$</span>
          <input 
            type="number" 
            step="0.01" 
            value={targetPrice} 
            onChange={(e) => setTargetPrice(e.target.value)} 
            required
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-gold"
          />
        </div>
        <button type="submit" disabled={loading} className="bg-gold text-background px-4 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors flex items-center gap-1 disabled:opacity-50">
          {loading ? <Loader2 size={16} className="animate-spin"/> : 'Criar'}
        </button>
      </form>

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map(alert => (
            <div key={alert.id} className="flex justify-between items-center bg-background p-2 rounded-lg border border-border text-sm">
              <span>Notificar quando chegar a <strong className="text-gold">R$ {parseFloat(alert.target_price).toFixed(2)}</strong></span>
              <button onClick={() => deleteAlert(alert.id)} className="text-muted hover:text-red-500"><Trash2 size={14}/></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}