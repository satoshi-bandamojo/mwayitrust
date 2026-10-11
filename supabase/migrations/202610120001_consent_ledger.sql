create table if not exists public.consent_events (
  id uuid not null default gen_random_uuid(),
  visitor_id uuid null,
  subscriber_id uuid null,
  document_type text not null,
  action text not null,
  document_version text not null,
  document_sha256 text not null,
  source text not null default 'website',
  recorded_at timestamp with time zone not null default now(),
  constraint consent_events_pkey primary key (id),
  constraint consent_events_subscriber_fkey
    foreign key (subscriber_id)
    references public.subscribers (id)
    on delete cascade,
  constraint consent_events_subject_required
    check (visitor_id is not null or subscriber_id is not null),
  constraint consent_events_document_type_valid
    check (document_type in ('terms_of_use', 'privacy_notice', 'marketing_email')),
  constraint consent_events_action_valid
    check (
      (document_type = 'terms_of_use' and action = 'accepted')
      or (document_type = 'privacy_notice' and action = 'acknowledged')
      or (document_type = 'marketing_email' and action in ('accepted', 'withdrawn'))
    ),
  constraint consent_events_version_present
    check (length(trim(document_version)) > 0),
  constraint consent_events_sha256_valid
    check (document_sha256 ~ '^[0-9a-f]{64}$')
);

alter table public.consent_events
  drop constraint if exists consent_events_subscriber_fkey;

alter table public.consent_events
  add constraint consent_events_subscriber_fkey
    foreign key (subscriber_id)
    references public.subscribers (id)
    on delete cascade;

create index if not exists idx_consent_events_visitor_recorded
  on public.consent_events (visitor_id, recorded_at desc)
  where visitor_id is not null;

create index if not exists idx_consent_events_subscriber_recorded
  on public.consent_events (subscriber_id, recorded_at desc)
  where subscriber_id is not null;

create unique index if not exists consent_events_visitor_document_action_version_key
  on public.consent_events (visitor_id, document_type, document_version, action);

alter table public.consent_events enable row level security;
revoke all on public.consent_events from anon, authenticated;
grant all on public.consent_events to service_role;
