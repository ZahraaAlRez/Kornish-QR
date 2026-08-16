import "server-only";
import type { CafeSettings, Order, OrderItem } from "./supabase/types";

/**
 * Spec §5/§11: the cafe's own POS/ordering system isn't chosen yet.
 * STUB — once it is, replace the body with a single fetch() to
 * cafeSettings.external_system_webhook_url (using external_system_api_key
 * if that system needs one). The order/order_items shape is already
 * structured, so this becomes a small follow-up, not a redesign.
 */
export async function sendToCafeSystem(
  cafeSettings: Pick<CafeSettings, "external_system_webhook_url" | "external_system_api_key">,
  order: Order,
  items: OrderItem[]
): Promise<void> {
  if (!cafeSettings.external_system_webhook_url) {
    console.log(`[cafeSystem] no webhook configured yet — skipping order ${order.id}`);
    return;
  }

  try {
    await fetch(cafeSettings.external_system_webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cafeSettings.external_system_api_key
          ? { Authorization: `Bearer ${cafeSettings.external_system_api_key}` }
          : {}),
      },
      body: JSON.stringify({ order, items }),
    });
  } catch (err) {
    console.error(`[cafeSystem] failed to forward order ${order.id}`, err);
  }
}
