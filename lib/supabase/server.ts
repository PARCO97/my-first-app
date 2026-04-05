import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side client with the publishable (anon) key. No cookies — fine for
 * public RLS policies. When you add Supabase Auth, introduce @supabase/ssr and
 * a cookie-aware client for session refresh.
 */
export function createPublicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key);
}
