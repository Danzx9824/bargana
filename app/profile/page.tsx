"use client";

import { useAuth } from "@/context/AuthContext";
import { User, Link2, Unlink, LogOut, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database";
import { toast } from "sonner";

type LinkedAccount = Database["public"]["Tables"]["linked_accounts"]["Row"];

export default function ProfilePage() {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    if (user) fetchAccounts();
  }, [user]);

  const fetchAccounts = async () => {
    setLoadingAccounts(true);
    const { data } = await supabase.from("linked_accounts").select("*").eq("user_id", user!.id);
    if (data) setAccounts(data);
    setLoadingAccounts(false);
  };

  const toggleConnection = async (platform: string, isConnected: boolean) => {
    if (isConnected) {
      await supabase.from("linked_accounts").update({ connected: false, access_token: null }).match({ user_id: user!.id, platform });
      toast.success(`${platform} desconectada.`);
    } else {
      // Em produção, aqui entraria o fluxo de OAuth real da plataforma
      await supabase.from("linked_accounts").upsert({
        user_id: user!.id, platform, connected: true, platform_user_id: "mock_123"
      }, { onConflict: "user_id, platform" });
      toast.success(`${platform} conectada com sucesso!`);
    }
    fetchAccounts();
  };

  if (authLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gold" size={32} /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <button onClick={signOut} className="flex items-center gap-2 text-sm text-muted hover:text-red-500 transition-colors">
          <LogOut size={16} /> Sair da Conta
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center text-gold overflow-hidden">
          {profile?.avatar_url ? <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : <User size={48} />}
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold">{profile?.username || "Usuário"}</h2>
          <p className="text-muted">{profile?.email || user?.email}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Contas Conectadas</h2>
      <p className="text-sm text-muted mb-6">Conecte suas contas para sincronizar sua lista de desejos.</p>

      {loadingAccounts ? <Loader2 className="animate-spin text-gold" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {["Steam", "Xbox", "PlayStation", "Nintendo", "Epic Games", "GOG"].map((platform) => {
            const acc = accounts.find(a => a.platform === platform.toLowerCase());
            const isConnected = acc?.connected || false;
            
            return (
              <div key={platform} className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between hover:border-muted transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white bg-surface border border-border">
                    {platform[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{platform}</p>
                    <p className={`text-xs ${isConnected ? 'text-green-500' : 'text-muted'}`}>
                      {isConnected ? 'Conectado' : 'Desconectado'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleConnection(platform.toLowerCase(), isConnected)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isConnected ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-gold/10 text-gold hover:bg-gold/20'
                  }`}
                >
                  {isConnected ? <Unlink size={14} /> : <Link2 size={14} />}
                  {isConnected ? 'Desconectar' : 'Conectar'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}