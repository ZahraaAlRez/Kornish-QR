import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Service-role client — server-only. Bypasses RLS, so this must only ever
 * be used from admin server actions/routes that already sit behind the
 * password-gated middleware, or from the order-submission action.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Copy .env.local.example to .env.local and fill in your Supabase project's API keys."
    );
  }

  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false },
  });
}
