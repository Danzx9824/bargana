import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bargana - Monitor de Ofertas Gamer",
  description: "Encontre as melhores ofertas de jogos e hardware gamer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-background antialiased">
        {children}
      </body>
    </html>
  );
}