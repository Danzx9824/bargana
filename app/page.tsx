export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="w-16 h-16 bg-gold rounded-xl flex items-center justify-center text-background font-bold text-3xl mb-6 gold-glow">
        B
      </div>
      <h1 className="text-5xl font-bold mb-4">
        <span className="text-gold">Bargana</span>
      </h1>
      <p className="text-xl text-muted max-w-md">
        Plataforma premium de monitoramento de ofertas gamer.
      </p>
      <p className="text-sm text-border mt-8">
        Instale as dependências com <code className="text-gold bg-surface px-2 py-1 rounded">npm install</code> e rode com <code className="text-gold bg-surface px-2 py-1 rounded">npm run dev</code>
      </p>
    </div>
  );
}