import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <h1 className="text-6xl font-bold text-gold mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Página não encontrada</h2>
      <p className="text-muted mb-6">O produto ou página que você procura não existe mais.</p>
      <Link href="/" className="bg-gold text-background px-6 py-2 rounded-lg font-semibold hover:bg-gold-dark transition-colors">
        Voltar para Início
      </Link>
    </div>
  );
}