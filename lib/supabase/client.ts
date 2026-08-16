import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Browser/anon client — used by the customer app. RLS restricts this to
 * public-read on menu/categories/settings and public-insert on orders.
 */
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.local.example to .env.local and fill in your Supabase project's API keys."
    );
  }

  return createClient<Database>(url, anonKey);
}
