"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthContext";
import { Database } from "@/types/database";
import { toast } from "sonner";

type WishlistItem = Database["public"]["Tables"]["wishlists"]["Row"] & {
  products: {
    id: string;
    title: string;
    image_url: string | null;
    slug: string;
    product_listings: Database["public"]["Tables"]["product_listings"]["Row"][];
  };
};

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistProductIds: Set<string>;
  loading: boolean;
  toggleWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistProductIds, setWishlistProductIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      setWishlistProductIds(new Set());
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("wishlists")
      .select(`*, products ( id, title, image_url, slug, product_listings (*) )`)
      .eq("user_id", user.id)
      .order("added_at", { ascending: false });

    if (!error && data) {
      setWishlistItems(data as WishlistItem[]);
      setWishlistProductIds(new Set(data.map((item) => item.product_id)));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error("Você precisa estar logado para usar a Lista de Desejos.");
      return;
    }

    const isWishlisted = wishlistProductIds.has(productId);

    // Otimismo de UI (Atualiza instantaneamente)
    if (isWishlisted) {
      setWishlistProductIds(prev => { const n = new Set(prev); n.delete(productId); return n; });
      setWishlistItems(prev => prev.filter(i => i.product_id !== productId));
    } else {
      setWishlistProductIds(prev => { const n = new Set(prev); n.add(productId); return n; });
    }

    // Requisição ao banco
    if (isWishlisted) {
      const { error } = await supabase.from("wishlists").delete().match({ user_id: user.id, product_id: productId });
      if (error) {
        toast.error("Erro ao remover da lista.");
        fetchWishlist(); // Reverte UI
      } else {
        toast.success("Removido da Lista de Desejos.");
      }
    } else {
      const { error } = await supabase.from("wishlists").insert({ user_id: user.id, product_id: productId });
      if (error) {
        toast.error("Erro ao adicionar na lista.");
        fetchWishlist(); // Reverte UI
      } else {
        toast.success("Adicionado à Lista de Desejos!");
        fetchWishlist(); // Refaz fetch para pegar dados completos do produto
      }
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, wishlistProductIds, loading, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};