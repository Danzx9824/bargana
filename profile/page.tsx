import { User, Link2, Unlink } from "lucide-react";

const accounts = [
  { name: "Steam", connected: true, color: "#1b2838" },
  { name: "Xbox", connected: false, color: "#107c10" },
  { name: "PlayStation", connected: true, color: "#003087" },
  { name: "Nintendo", connected: false, color: "#e60012" },
  { name: "Epic Games", connected: false, color: "#2a2a2a" },
  { name: "GOG", connected: true, color: "#86328a" },
];

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

      <div className="bg-surface border border-border rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center text-gold">
          <User size={48} />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold">Gamer Premium</h2>
          <p className="text-muted">gamer@email.com</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Contas Conectadas</h2>
      <p className="text-sm text-muted mb-6">Conecte suas contas para sincronizar sua lista de desejos e receber alertas personalizados.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div key={acc.name} className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between hover:border-muted transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white" style={{ backgroundColor: acc.color }}>
                {acc.name[0]}
              </div>
              <div>
                <p className="font-semibold">{acc.name}</p>
                <p className={`text-xs ${acc.connected ? 'text-green-500' : 'text-muted'}`}>
                  {acc.connected ? 'Conectado' : 'Desconectado'}
                </p>
              </div>
            </div>
            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              acc.connected 
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                : 'bg-gold/10 text-gold hover:bg-gold/20'
            }`}>
              {acc.connected ? <Unlink size={14} /> : <Link2 size={14} />}
              {acc.connected ? 'Desconectar' : 'Conectar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}