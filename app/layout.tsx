import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bargana - Monitor de Ofertas Gamer",
  description: "Encontre as melhores ofertas de jogos e hardware gamer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <WishlistProvider>
            <Toaster theme="dark" richColors position="bottom-right" />
            <div className="flex flex-col h-screen">
              <Header />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 mt-16 bg-background">
                  {children}
                </main>
              </div>
            </div>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}