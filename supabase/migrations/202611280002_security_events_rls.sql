begin;

create table if not exists public.security_events (
  id uuid not null default gen_random_uuid(),
  event_type text not null,
  severity text not null default 'low',
  source_ip inet null,
  user_id uuid null references auth.users (id) on delete set null,
  route text null,
  description text null,
  user_agent text null,
  metadata jsonb null default '{}'::jsonb,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint security_events_pkey primary key (id),
  constraint security_events_severity_check
    check (severity in ('low', 'medium', 'high', 'critical')),
  constraint security_events_status_check
    check (status in ('new', 'investigating', 'resolved', 'ignored'))
);

create index if not exists idx_security_events_created_at
  on public.security_events (created_at desc);
create index if not exists idx_security_events_severity
  on public.security_events (severity);
create index if not exists idx_security_events_event_type
  on public.security_events (event_type);
create index if not exists idx_security_events_status
  on public.security_events (status);
create index if not exists idx_security_events_user_id
  on public.security_events (user_id);
create index if not exists idx_security_events_ip_type_created_at
  on public.security_events (source_ip, event_type, created_at desc);

alter table public.security_events enable row level security;

do $$
declare
  policy_name text;
begin
  for policy_name in
    select p.policyname
    from pg_policies p
    where p.schemaname = 'public'
      and p.tablename = 'security_events'
  loop
    execute format('drop policy %I on public.security_events', policy_name);
  end loop;
end
$$;

revoke all on table public.security_events from public, anon, authenticated, service_role;
grant select on table public.security_events to authenticated;
grant select, insert on table public.security_events to service_role;

create policy "Admins can read security events"
  on public.security_events
  for select
  to authenticated
  using (public.is_admin());

commit;
