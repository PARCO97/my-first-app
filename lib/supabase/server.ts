import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type SupabaseEnvCheck =
  | { ok: true; url: string; key: string }
  | { ok: false; message: string };

/**
 * Validates env before createClient — avoids opaque "Invalid supabaseUrl" errors when
 * the URL is missing https:// or has typos.
 */
export function checkSupabaseEnv(): SupabaseEnvCheck {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

  if (!url && !key) {
    return {
      ok: false,
      message: "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local (see Supabase → Project Settings → API).",
    };
  }
  if (!url) {
    return { ok: false, message: "NEXT_PUBLIC_SUPABASE_URL is missing." };
  }
  if (!key) {
    return { ok: false, message: "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing." };
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") {
      return {
        ok: false,
        message: "NEXT_PUBLIC_SUPABASE_URL must start with https:// (paste the full Project URL from Supabase).",
      };
    }
  } catch {
    return {
      ok: false,
      message:
        "NEXT_PUBLIC_SUPABASE_URL is not a valid URL. It should look like https://xxxxxxxx.supabase.co with no spaces or extra quotes.",
    };
  }

  return { ok: true, url, key };
}

/**
 * Server-side client with the publishable (anon) key. No cookies — fine for
 * public RLS policies. When you add Supabase Auth, introduce @supabase/ssr and
 * a cookie-aware client for session refresh.
 */
export function createPublicClient(): SupabaseClient | null {
  const check = checkSupabaseEnv();
  if (!check.ok) return null;
  return createClient(check.url, check.key);
}
