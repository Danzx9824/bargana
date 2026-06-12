export const deals = [
  {
    id: "1",
    name: "Hollow Knight",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rgi.webp",
    platform: "Steam",
    store: "Steam",
    currentPrice: 19.99,
    originalPrice: 59.99,
    discount: 67,
    badges: ["Menor Preço Histórico", "Nova Oferta"],
  },
  {
    id: "2",
    name: "Celeste",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lcu.webp",
    platform: "Nintendo",
    store: "Amazon",
    currentPrice: 24.90,
    originalPrice: 79.90,
    discount: 69,
    badges: ["Melhor Preço"],
  },
  {
    id: "3",
    name: "Persona 4 Golden",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r0h.webp",
    platform: "PlayStation",
    store: "Terabyte",
    currentPrice: 49.90,
    originalPrice: 159.90,
    discount: 69,
    badges: ["Preço Histórico"],
  },
  {
    id: "4",
    name: "SSD Gamer 1TB NVMe",
    image: "https://images.kabum.com.br/produtos/fotos/383627/ssd-kingston-nv2-1tb-m-2-pcie-nvme-read-3500mb-s-write-2100mb-s-snv2s-1000g_1686161546_g.jpg",
    platform: "Hardware",
    store: "KaBuM!",
    currentPrice: 359.90,
    originalPrice: 599.90,
    discount: 40,
    badges: ["Nova Oferta"],
  },
  {
    id: "5",
    name: "Headset Gamer HyperX Cloud II",
    image: "https://images.kabum.com.br/produtos/fotos/104979/headset-gamer-hyperx-cloud-ii-red-linear-com-caixa-de-som-removivel-hx-hsc2-bk-em_1597782732_g.jpg",
    platform: "Periférico",
    store: "Amazon",
    currentPrice: 299.90,
    originalPrice: 499.90,
    discount: 40,
    badges: [],
  }
];

export const priceHistory = Array.from({ length: 90 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (90 - i));
  let price = 59.99;
  if (i > 20 && i < 40) price = 29.99;
  if (i > 60 && i < 75) price = 19.99; // Menor preço
  if (i === 89) price = 19.99; // Preço atual
  return {
    date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
    price: price,
  };
});

export const platforms = [
  "Todas", "Xbox", "PlayStation", "Nintendo", "Steam", "Epic Games", "GOG", "Amazon", "KaBuM!", "Terabyte"
];