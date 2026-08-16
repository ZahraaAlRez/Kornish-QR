import type { CafeSettings, Order, OrderItem } from "./supabase/types";

/**
 * Spec §5, Option A: a wa.me link pre-fills the message on the customer's
 * own phone — they still tap Send. Returns null when the cafe hasn't
 * provided a WhatsApp number yet (cafe_settings.whatsapp_number empty);
 * callers should show a "WhatsApp sending isn't configured yet" note in
 * that case rather than failing the order.
 *
 * Swapping to Option B (WhatsApp Business API) later means replacing the
 * body of this function with an API call — every call site already just
 * treats this as "however the order gets sent to WhatsApp."
 */
export function buildWhatsAppLink(
  cafeSettings: Pick<CafeSettings, "whatsapp_number">,
  order: Order,
  items: OrderItem[]
): string | null {
  const number = cafeSettings.whatsapp_number?.replace(/[^\d]/g, "");
  if (!number) return null;

  const message = buildOrderMessage(order, items);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildOrderMessage(order: Order, items: OrderItem[]): string {
  const lines: string[] = [];
  lines.push("New order:");
  for (const item of items) {
    const notes = item.notes ? ` (${item.notes})` : "";
    lines.push(`- ${item.quantity}x ${item.name}${notes} — $${(item.price * item.quantity).toFixed(2)}`);
  }
  lines.push("");

  if (order.order_type === "dine_in") {
    lines.push(`Dine-in — Table ${order.table_number ?? "?"}`);
    if (order.customer_name) lines.push(`Name: ${order.customer_name}`);
  } else {
    lines.push("Delivery");
    if (order.customer_name) lines.push(`Name: ${order.customer_name}`);
    if (order.phone) lines.push(`Phone: ${order.phone}`);
    if (order.delivery_address) lines.push(`Address: ${order.delivery_address}`);
    if (order.delivery_location_url) lines.push(`Location: ${order.delivery_location_url}`);
  }

  lines.push("");
  lines.push(`Total: $${order.total.toFixed(2)}`);
  return lines.join("\n");
}
