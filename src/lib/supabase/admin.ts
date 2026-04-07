import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Returns true if the env vars needed for service-role Supabase access
 * are present. Used by every store/backend to fall back to in-memory
 * implementations when running locally without Supabase configured.
 */
export function supabaseEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

let cached: SupabaseClient | null = null;

/**
 * Memoized service-role Supabase client for server-side use.
 * The client is constructed once per Node process and reused — creating
 * a fresh client on every request is expensive (it parses URLs, builds
 * fetcher closures, etc.) and was previously a hot-path bottleneck.
 */
export function supabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  cached = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
  return cached;
}
