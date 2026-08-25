-- Run this in your Supabase SQL editor to create the applications table

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  owner_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  city text not null,
  state text not null,
  industry text not null,
  entity_type text not null,
  time_in_business_months integer not null,
  additional_notes text,
  matched_lender_id text,
  matched_lender_name text,
  match_reasons jsonb,
  email_sent boolean default false,
  submitted_at timestamptz default now()
);

-- Optional: enable Row Level Security (disable for private admin-only access)
-- alter table applications enable row level security;
