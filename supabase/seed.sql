-- 1. Produtos
INSERT INTO public.products (id, title, slug, image_url, platform) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Hollow Knight', 'hollow-knight', 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1rgi.webp', 'PC'),
('b2c3d4e5-f6a7-8901-2345-678901bcdef0', 'Celeste', 'celeste', 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2lcu.webp', 'Nintendo'),
('c3d4e5f6-a7b8-9012-3456-789012cdef01', 'Persona 4 Golden', 'persona-4-golden', 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r0h.webp', 'PlayStation')
ON CONFLICT (id) DO NOTHING;

-- 2. Listagens/Lojas
INSERT INTO public.product_listings (id, product_id, store, platform, current_price, original_price, discount_percent, is_lowest_price) VALUES
('11111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Steam', 'Steam', 19.99, 59.99, 67, true),
('22222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'GOG', 'GOG', 24.99, 59.99, 58, false),
('33333333-3333-3333-3333-333333333333', 'b2c3d4e5-f6a7-8901-2345-678901bcdef0', 'Amazon', 'Nintendo', 24.90, 79.90, 69, true),
('44444444-4444-4444-4444-444444444444', 'c3d4e5f6-a7b8-9012-3456-789012cdef01', 'Terabyte', 'PlayStation', 49.90, 159.90, 69, true),
('55555555-5555-5555-5555-555555555555', 'c3d4e5f6-a7b8-9012-3456-789012cdef01', 'Nuuvem', 'PlayStation', 59.90, 159.90, 63, false)
ON CONFLICT (id) DO NOTHING;

-- 3. Histórico de Preços (Corrigido: usando generate_series no FROM)
INSERT INTO public.price_history (listing_id, price, recorded_at)
SELECT 
    '11111111-1111-1111-1111-111111111111'::uuid, 
    CASE 
        WHEN (gs.day % 30) BETWEEN 0 AND 10 THEN 59.99
        WHEN (gs.day % 30) BETWEEN 11 AND 20 THEN 29.99
        ELSE 19.99 
    END,
    NOW() - (gs.day || ' days')::interval
FROM generate_series(1, 90) AS gs(day);