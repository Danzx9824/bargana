"use client";

import { AlertTriangle } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <AlertTriangle size={48} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Algo deu errado!</h2>
      <p className="text-muted mb-6">Ocorreu um erro ao processar sua requisição.</p>
      <button
        onClick={() => reset()}
        className="bg-gold text-background px-6 py-2 rounded-lg font-semibold hover:bg-gold-dark transition-colors"
      >
        Tentar Novamente
      </button>
    </div>
  );
}