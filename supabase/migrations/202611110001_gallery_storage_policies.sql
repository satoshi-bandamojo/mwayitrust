insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Public can view gallery images" on storage.objects;
create policy "Public can view gallery images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'gallery');

drop policy if exists "Admins can upload gallery images" on storage.objects;
create policy "Admins can upload gallery images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'gallery'
    and exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and lower(coalesce(profiles.role, '')) = 'admin'
    )
  );

drop policy if exists "Admins can update gallery images" on storage.objects;
create policy "Admins can update gallery images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'gallery'
    and exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and lower(coalesce(profiles.role, '')) = 'admin'
    )
  )
  with check (
    bucket_id = 'gallery'
    and exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and lower(coalesce(profiles.role, '')) = 'admin'
    )
  );

drop policy if exists "Admins can delete gallery images" on storage.objects;
create policy "Admins can delete gallery images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'gallery'
    and exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and lower(coalesce(profiles.role, '')) = 'admin'
    )
  );
