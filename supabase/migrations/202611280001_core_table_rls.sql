begin;

do $$
begin
  if to_regclass('public.profiles') is null then
    raise exception 'Required table public.profiles is missing; apply the application schema before this migration.';
  end if;
end
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and lower(coalesce(profiles.role, '')) = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

do $$
declare
  table_name text;
  policy_name text;
begin
  foreach table_name in array array[
    'profiles',
    'stories',
    'events',
    'gallery',
    'donations',
    'subscribers',
    'contact_messages'
  ]
  loop
    if to_regclass(format('public.%I', table_name)) is null then
      raise exception 'Required table public.% is missing; apply the application schema before this migration.', table_name;
    end if;

    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on table public.%I from public, anon, authenticated', table_name);
    execute format('grant select, update, delete on table public.%I to authenticated', table_name);

    for policy_name in
      select p.policyname
      from pg_policies p
      where p.schemaname = 'public'
        and p.tablename = table_name
    loop
      execute format('drop policy %I on public.%I', policy_name, table_name);
    end loop;

    execute format(
      'create policy "Mwayi admins manage rows" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      table_name
    );
  end loop;

  foreach table_name in array array['messages', 'contacts']
  loop
    if to_regclass(format('public.%I', table_name)) is not null then
      execute format('alter table public.%I enable row level security', table_name);
      execute format('revoke all on table public.%I from public, anon, authenticated', table_name);
      execute format('grant select, delete on table public.%I to authenticated', table_name);

      for policy_name in
        select p.policyname
        from pg_policies p
        where p.schemaname = 'public'
          and p.tablename = table_name
      loop
        execute format('drop policy %I on public.%I', policy_name, table_name);
      end loop;

      execute format(
        'create policy "Mwayi admins manage rows" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
        table_name
      );
    end if;
  end loop;
end
$$;

grant insert on table public.profiles, public.stories, public.events, public.gallery to authenticated;
grant select on table public.stories, public.events, public.gallery to anon, authenticated;

create policy "Public can read published stories"
  on public.stories
  for select
  to anon, authenticated
  using (published is true);

create policy "Public can read events"
  on public.events
  for select
  to anon, authenticated
  using (true);

create policy "Public can read gallery"
  on public.gallery
  for select
  to anon, authenticated
  using (true);

grant insert (name, email, message) on table public.contact_messages to anon, authenticated;
drop policy if exists "Public can submit contact messages" on public.contact_messages;
create policy "Public can submit contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (
    length(trim(name)) between 1 and 120
    and length(trim(email)) between 3 and 254
    and length(trim(message)) between 1 and 5000
  );

grant insert (email, subscribed, source) on table public.subscribers to anon, authenticated;
drop policy if exists "Public can subscribe" on public.subscribers;
create policy "Public can subscribe"
  on public.subscribers
  for insert
  to anon, authenticated
  with check (
    length(trim(email)) between 3 and 254
    and subscribed is true
    and source = 'website'
  );

commit;
