// Dentro do useEffect do arquivo PriceHistoryChart.tsx anterior:

const fetchHistory = async () => {
  setLoading(true);
  // ... lógica de data filter ...
  
  const { data, error } = await supabase
    .from("price_history")
    .select("price, recorded_at")
    .eq("listing_id", selectedListing.id)
    .gte("recorded_at", dateFilter.toISOString())
    .order("recorded_at", { ascending: true });

  if (data) {
    const parsed = data.map(d => ({
      date: new Date(d.recorded_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      price: typeof d.price === 'string' ? parseFloat(d.price) : d.price
    }));

    // DOWNSAMPLING: Se houver mais de 200 pontos, reduz para não travar o navegador
    const downsampleData = (data: any[], maxPoints = 200) => {
      if (data.length <= maxPoints) return data;
      const step = Math.ceil(data.length / maxPoints);
      return data.filter((_, index) => index % step === 0);
    };

    setChartData(downsampleData(parsed));
  }
  setLoading(false);
};