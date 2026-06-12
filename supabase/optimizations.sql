-- 1. VIEW: Agrupa ofertas e retorna apenas o menor preço atual por produto
create or replace view public.deals_with_lowest_price as
select 
    p.id as product_id,
    p.title,
    p.slug,
    p.image_url,
    p.platform as base_platform,
    pl.store,
    pl.platform as listing_platform,
    pl.current_price,
    pl.original_price,
    pl.discount_percent,
    pl.is_lowest_price,
    pl.is_new_offer,
    pl.url,
    pl.updated_at
from public.products p
join public.product_listings pl on p.id = pl.product_id
where pl.current_price = (
    select min(pl2.current_price)
    from public.product_listings pl2
    where pl2.product_id = p.id
);

-- 2. INDICES COMPOSTOS (Crucial para o Gráfico de Histórico)
create index if not exists idx_price_history_listing_date_desc 
on public.price_history (listing_id, recorded_at desc);

-- 3. SEGURANÇA: Limitar alertas por usuário por produto (Max 3)
create or replace function public.limit_price_alerts()
returns trigger as $$ declare
    alert_count int;
begin
    select count(*) into alert_count
    from public.price_alerts
    where user_id = new.user_id and product_id = new.product_id;
    
    if alert_count >= 3 then
        raise exception 'Limite de 3 alertas por produto atingido.';
    end if;
    return new;
end;
 $$ language plpgsql security definer;

drop trigger if exists enforce_alert_limit on public.price_alerts;
create trigger enforce_alert_limit
before insert on public.price_alerts
for each row execute procedure public.limit_price_alerts();