
import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
// NOTE: For the Preview environment, these keys won't be set, so the app handles null gracefully.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/* 
  === SUPABASE SQL SCHEMA ===
  Run this in your Supabase SQL Editor to set up the database:

  create table public.companies (
    id text primary key,
    name text not null,
    description text,
    website text,
    last_analysis_date text,
    analysis jsonb
  );

  create table public.requests (
    id text primary key,
    user_id text,
    company_name text,
    website text,
    document_name text,
    document_content text,
    status text,
    submission_date text,
    analysis_result jsonb
  );

  -- Enable Row Level Security (RLS) is recommended for production
  alter table public.companies enable row level security;
  alter table public.requests enable row level security;
  
  -- Create policies (Simplified for demo: public read/write)
  create policy "Public Access" on public.companies for all using (true);
  create policy "Public Access Requests" on public.requests for all using (true);
*/
