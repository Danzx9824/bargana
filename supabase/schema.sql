-- ==========================================
-- 1. EXTENSÕES
-- ==========================================
create extension if not exists "uuid-ossp" schema extensions;

-- ==========================================
-- 2. TABELAS CORE
-- ==========================================

create table public.profiles (
  id uuid not null references auth.users on delete cascade primary key,
  username text,
  full_name text,
  avatar_url text,
  email text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.user_preferences (
  user_id uuid not null references public.profiles on delete cascade primary key,
  favorite_platforms text[] default array[]::text[],
  favorite_stores text[] default array[]::text[],
  notification_settings jsonb default '{"price_drop": true, "new_offer": true, "wishlist": true}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.products (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  image_url text,
  platform text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.product_listings (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid not null references public.products on delete cascade,
  store text not null,
  platform text not null,
  url text,
  current_price numeric(10,2) not null,
  original_price numeric(10,2) not null,
  discount_percent integer not null default 0,
  is_lowest_price boolean default false,
  is_new_offer boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  constraint unique_product_store unique (product_id, store)
);

create table public.price_history (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid not null references public.product_listings on delete cascade,
  price numeric(10,2) not null,
  recorded_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.wishlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.profiles on delete cascade,
  product_id uuid not null references public.products on delete cascade,
  added_at timestamp with time zone default timezone('utc'::text, now()),
  constraint unique_user_product unique (user_id, product_id)
);

create table public.price_alerts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.profiles on delete cascade,
  product_id uuid not null references public.products on delete cascade,
  target_price numeric(10,2) not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.linked_accounts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.profiles on delete cascade,
  platform text not null,
  platform_user_id text,
  access_token text,
  connected boolean default false,
  connected_at timestamp with time zone default timezone('utc'::text, now()),
  constraint unique_user_platform unique (user_id, platform)
);

create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.profiles on delete cascade,
  listing_id uuid references public.product_listings on delete set null,
  type text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ==========================================
-- 3. ÍNDICES PARA PERFORMANCE
-- ==========================================
create index idx_product_listings_product on public.product_listings(product_id);
create index idx_product_listings_store on public.product_listings(store);
create index idx_product_listings_discount on public.product_listings(discount_percent desc);
create index idx_price_history_listing on public.price_history(listing_id);
create index idx_price_history_recorded on public.price_history(recorded_at desc);
create index idx_wishlists_user on public.wishlists(user_id);
create index idx_price_alerts_user_active on public.price_alerts(user_id, is_active);
create index idx_notifications_user_read on public.notifications(user_id, is_read);

-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ==========================================
alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.products enable row level security;
alter table public.product_listings enable row level security;
alter table public.price_history enable row level security;
alter table public.wishlists enable row level security;
alter table public.price_alerts enable row level security;
alter table public.linked_accounts enable row level security;
alter table public.notifications enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check ((auth.uid()) = id);
create policy "Users can update own profile." on public.profiles for update using ((auth.uid()) = id);

create policy "Users can view own preferences." on public.user_preferences for select using ((auth.uid()) = user_id);
create policy "Users can insert own preferences." on public.user_preferences for insert with check ((auth.uid()) = user_id);
create policy "Users can update own preferences." on public.user_preferences for update using ((auth.uid()) = user_id);

create policy "Products are viewable by everyone." on public.products for select using (true);
create policy "Listings are viewable by everyone." on public.product_listings for select using (true);
create policy "Price history is viewable by everyone." on public.price_history for select using (true);

create policy "Users can view own wishlist." on public.wishlists for select using ((auth.uid()) = user_id);
create policy "Users can insert own wishlist." on public.wishlists for insert with check ((auth.uid()) = user_id);
create policy "Users can delete own wishlist." on public.wishlists for delete using ((auth.uid()) = user_id);

create policy "Users can view own alerts." on public.price_alerts for select using ((auth.uid()) = user_id);
create policy "Users can insert own alerts." on public.price_alerts for insert with check ((auth.uid()) = user_id);
create policy "Users can update own alerts." on public.price_alerts for update using ((auth.uid()) = user_id);
create policy "Users can delete own alerts." on public.price_alerts for delete using ((auth.uid()) = user_id);

create policy "Users can view own accounts." on public.linked_accounts for select using ((auth.uid()) = user_id);
create policy "Users can manage own accounts." on public.linked_accounts for all using ((auth.uid()) = user_id);

create policy "Users can view own notifications." on public.notifications for select using ((auth.uid()) = user_id);
create policy "Users can update own notifications." on public.notifications for update using ((auth.uid()) = user_id);

-- ==========================================
-- 5. TRIGGERS (Automação)
-- ==========================================

create or replace function public.handle_new_user()
returns trigger as $$ begin
  insert into public.profiles (id, full_name, username, email, avatar_url)
  values (
    new.id, 
    new.raw_user_meta_data ->> 'full_name', 
    new.raw_user_meta_data ->> 'username', 
    new.email,
    new.raw_user_meta_data ->> 'avatar_url'
  );
  insert into public.user_preferences (user_id) values (new.id);
  return new;
end;
 $$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.moddatetime()
returns trigger as $$ begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
 $$ language plpgsql;

create trigger set_profiles_updated_at before update on public.profiles for each row execute procedure public.moddatetime();
create trigger set_products_updated_at before update on public.products for each row execute procedure public.moddatetime();
create trigger set_listings_updated_at before update on public.product_listings for each row execute procedure public.moddatetime();