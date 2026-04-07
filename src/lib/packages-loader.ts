import "server-only";
import { PACKAGES } from "./packages";
import type { Package, PackageId } from "./types";

/**
 * Loads packages from Supabase if configured, falls back to the static
 * src/lib/packages.ts list otherwise. Used by server components.
 */
export async function loadPackages(): Promise<Package[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return [...PACKAGES].sort((a, b) => a.sort_order - b.sort_order);
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { persistSession: false } }
    );

    const { data, error } = await sb
      .from("packages")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return [...PACKAGES].sort((a, b) => a.sort_order - b.sort_order);
    }

    return data.map((row) => ({
      id: row.id as PackageId,
      name: row.name,
      name_he: row.name_he,
      price_per_sqm: row.price_per_sqm,
      features: row.features,
      sort_order: row.sort_order,
    }));
  } catch {
    return [...PACKAGES].sort((a, b) => a.sort_order - b.sort_order);
  }
}
