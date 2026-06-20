-- 1. Applications table
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text,
  email text not null,
  phone text not null,
  package text not null,
  universities text[] not null,
  status text default 'pending',
  notes text,
  passport_url text,
  certificate_urls text[],
  created_at timestamp with time zone default now()
);

-- 2. Allow anyone to insert/read/update (public app)
alter table public.applications enable row level security;

create policy "insert_applications" on public.applications for insert with check (true);
create policy "read_applications" on public.applications for select using (true);
create policy "update_applications" on public.applications for update using (true);

-- 3. Storage bucket for documents
insert into storage.buckets (id, name, public) values ('documents', 'documents', true);

create policy "upload_documents" on storage.objects for insert with check (bucket_id = 'documents');
create policy "read_documents" on storage.objects for select using (bucket_id = 'documents');
