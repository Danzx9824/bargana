import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v5 as uuidv5 } from 'uuid';

// Configuração do Supabase Admin (bypassa RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Namespace para gerar UUIDs determinísticos (pode ser qualquer UUID válido)
const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; 

export async function GET(request: Request) {
  // 1. Segurança: Verificar o CRON_SECRET
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Buscar dados na Steam Store API com Timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const steamRes = await fetch('https://store.steampowered.com/api/featuredcategories?cc=br&l=portuguese', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!steamRes.ok) throw new Error('Falha ao buscar dados da Steam');

    const steamData = await steamRes.json();
    const specials = steamData.specials?.items;

    if (!specials || specials.length === 0) {
      return NextResponse.json({ success: true, message: 'Nenhuma promoção encontrada' });
    }

    // 3. Buscar preços atuais no banco para calcular o Histórico
    const { data: currentListings } = await supabaseAdmin
      .from('product_listings')
      .select('id, current_price')
      .eq('store', 'Steam');

    const currentPriceMap = new Map(currentListings?.map(l => [l.id, l.current_price]));

    const productsToUpsert = [];
    const listingsToUpsert = [];
    const historyToInsert = [];

    // 4. Mapear os dados
    for (const item of specials) {
      if (!item.id || !item.name) continue;

      const appId = String(item.id);
      const productId = uuidv5(`steam-app-${appId}`, NAMESPACE);
      const listingId = uuidv5(`steam-listing-${appId}`, NAMESPACE);
      
      const slug = item.name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9]+/g, '-') // Troca caracteres especiais por hífen
        .replace(/(^-|-$)+/g, ''); // Remove hífens das pontas

      const currentPrice = item.final_price / 100;
      const originalPrice = item.original_price / 100;

      productsToUpsert.push({
        id: productId,
        title: item.name,
        slug: slug,
        image_url: item.large_capsule_image,
        platform: 'PC'
      });

      listingsToUpsert.push({
        id: listingId,
        product_id: productId,
        store: 'Steam',
        platform: 'Steam',
        url: `https://store.steampowered.com/app/${appId}`,
        current_price: currentPrice,
        original_price: originalPrice,
        discount_percent: item.discount_percent,
        is_lowest_price: item.discount_percent >= 50 // Exemplo: marca como menor preço se desconto > 50%
      });

      // 5. Lógica do Histórico de Preços
      const oldPrice = currentPriceMap.get(listingId);
      if (oldPrice !== undefined && oldPrice !== currentPrice) {
        historyToInsert.push({
          listing_id: listingId,
          price: currentPrice,
          recorded_at: new Date().toISOString()
        });
      } else if (oldPrice === undefined) {
        // Primeiro registro do jogo no sistema
        historyToInsert.push({
          listing_id: listingId,
          price: currentPrice,
          recorded_at: new Date().toISOString()
        });
      }
    }

    // 6. Salvar no Supabase
    const { error: prodError } = await supabaseAdmin
      .from('products')
      .upsert(productsToUpsert, { onConflict: 'id' });
    if (prodError) console.error('Erro Products:', prodError);

    const { error: listError } = await supabaseAdmin
      .from('product_listings')
      .upsert(listingsToUpsert, { onConflict: 'id' });
    if (listError) console.error('Erro Listings:', listError);

    if (historyToInsert.length > 0) {
      const { error: histError } = await supabaseAdmin
        .from('price_history')
        .insert(historyToInsert);
      if (histError) console.error('Erro History:', histError);
    }

    return NextResponse.json({ 
      success: true, 
      synced: productsToUpsert.length,
      historyAdded: historyToInsert.length
    });

  } catch (error: any) {
    console.error('Erro na sincronização:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}