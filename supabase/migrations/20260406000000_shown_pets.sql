-- Run in Supabase SQL Editor, or apply via Supabase CLI if you use it.
create table if not exists public.shown_pets (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists shown_pets_created_at_idx on public.shown_pets (created_at desc);

alter table public.shown_pets enable row level security;

create policy "Public read shown_pets"
  on public.shown_pets for select
  using (true);

create policy "Public insert shown_pets"
  on public.shown_pets for insert
  with check (true);
