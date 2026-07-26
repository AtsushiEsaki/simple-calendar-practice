create table public.events (
  id bigint generated always as identity primary key,
  title text not null,
  event_date date not null,
  start_time time not null,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "Anyone can read events"
on public.events
for select
to anon
using (true);

create policy "Anyone can create events"
on public.events
for insert
to anon
with check (true);
