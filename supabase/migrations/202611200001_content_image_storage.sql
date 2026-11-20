insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('stories', 'stories', true, 1048576, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('events', 'events', true, 1048576, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('gallery', 'gallery', true, 1048576, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view gallery images" on storage.objects;
drop policy if exists "Admins can upload gallery images" on storage.objects;
drop policy if exists "Admins can update gallery images" on storage.objects;
drop policy if exists "Admins can delete gallery images" on storage.objects;
drop policy if exists "Public can view content images" on storage.objects;
drop policy if exists "Admins can upload content images" on storage.objects;
drop policy if exists "Admins can update content images" on storage.objects;
drop policy if exists "Admins can delete content images" on storage.objects;

create policy "Public can view content images"
  on storage.objects
  for select
  to public
  using (bucket_id in ('stories', 'events', 'gallery'));

create policy "Admins can upload content images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id in ('stories', 'events', 'gallery')
    and exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and lower(coalesce(profiles.role, '')) = 'admin'
    )
  );

create policy "Admins can update content images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id in ('stories', 'events', 'gallery')
    and exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and lower(coalesce(profiles.role, '')) = 'admin'
    )
  )
  with check (
    bucket_id in ('stories', 'events', 'gallery')
    and exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and lower(coalesce(profiles.role, '')) = 'admin'
    )
  );

create policy "Admins can delete content images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id in ('stories', 'events', 'gallery')
    and exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and lower(coalesce(profiles.role, '')) = 'admin'
    )
  );
