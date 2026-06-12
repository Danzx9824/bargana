import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Usa a SERVICE_ROLE para bypassar o RLS e inserir em massa
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Chave de admin secreta
);

export async function GET() {
  try {
    // Busca os 20 melhores deals da Steam (storeID=1) e GOG (storeID=7) via CheapShark
    const res = await fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1,7&upperPrice=50&pageSize=20');
    const deals = await res.json();

    const productsToInsert = [];
    const listingsToInsert = [];

    for (const deal of deals) {
      if (!deal.title || !deal.steamAppID) continue; 

      const slug = deal.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const storeName = deal.storeID === '1' ? 'Steam' : 'GOG';

      productsToInsert.push({
        id: `steam-${deal.steamAppID}`, 
        title: deal.title,
        slug: slug,
        image_url: deal.thumb,
        platform: 'PC'
      });

      listingsToInsert.push({
        id: `list-${deal.steamAppID}-${storeName}`, 
        product_id: `steam-${deal.steamAppID}`,
        store: storeName,
        platform: storeName,
        url: `https://store.steampowered.com/app/${deal.steamAppID}`,
        current_price: parseFloat(deal.salePrice),
        original_price: import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Função para gerar UUIDs falsos, mas no formato correto que o Supabase aceita
const generateUUID = (id: string | number) => {
  const str = String(id).padStart(8, '0').slice(0, 8);
  return `${str}-0000-0000-0000-000000000000`;
};

export async function GET() {
  try {
    const res = await fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1,7&upperPrice=50&pageSize=20');
    const deals = await res.json();

    const productsToInsert = [];
    const listingsToInsert = [];

    for (const deal of deals) {
      if (!deal.title || !deal.steamAppID) continue; 

      const slug = deal.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const storeName = deal.storeID === '1' ? 'Steam' : 'GOG';
      const productId = generateUUID(deal.steamAppID);
      const listingId = generateUUID(`list-${deal.steamAppID}-${storeName}`);

      productsToInsert.push({
        id: productId, 
        title: deal.title,
        slug: slug,
        image_url: deal.thumb,
        platform: 'PC'
      });

      listingsToInsert.push({
        id: listingId, 
        product_id: productId,
        store: storeName,
        platform: storeName,
        url: `https://store.steampowered.com/app/${deal.steamAppID}`,
        current_price: parseFloat(deal.salePrice),
        original_price: parseFloat(deal.normalPrice),
        discount_percent: parseInt(deal.savings),
        is_lowest_price: deal.isLowestPrice === '1'
      });
    }

    const { error: prodError } = await supabaseAdmin
      .from('products')
      .upsert(productsToInsert, { onConflict: 'id', ignoreDuplicates: false });

    if (prodError) console.error('Erro Products:', prodError);

    const { error: listError } = await supabaseAdmin
      .from('product_listings')
      .upsert(listingsToInsert, { onConflict: 'id', ignoreDuplicates: false });

    if (listError) console.error('Erro Listings:', listError);

    return NextResponse.json({ success: true, inserted: productsToInsert.length });
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao sincronizar' }, { status: 500 });
  }
}parseFloat(deal.normalPrice),
        discount_percent: parseInt(deal.savings),
        is_lowest_price: deal.isLowestPrice === '1'
      });
    }

    // Upsert no Supabase 
    const { error: prodError } = await supabaseAdmin
      .from('products')
      .upsert(productsToInsert, { onConflict: 'id', ignoreDuplicates: false });

    if (prodError) console.error('Erro Products:', prodError);

    const { error: listError } = await supabaseAdmin
      .from('product_listings')
      .upsert(listingsToInsert, { onConflict: 'id', ignoreDuplicates: false });

    if (listError) console.error('Erro Listings:', listError);

    return NextResponse.json({ success: true, inserted: productsToInsert.length });
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao sincronizar' }, { status: 500 });
  }
}