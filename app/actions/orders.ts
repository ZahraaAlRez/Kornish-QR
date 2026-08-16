"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { sendToCafeSystem } from "@/lib/cafeSystem";
import type { OrderType } from "@/lib/supabase/types";

export interface SubmitOrderLineInput {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
}

export interface SubmitOrderInput {
  orderType: OrderType;
  tableNumber?: string;
  customerName?: string;
  phone?: string;
  deliveryAddress?: string;
  deliveryLocationUrl?: string;
  items: SubmitOrderLineInput[];
}

export interface SubmitOrderResult {
  orderId: string;
  total: number;
  whatsappLink: string | null;
}

export async function submitOrder(input: SubmitOrderInput): Promise<SubmitOrderResult> {
  if (!input.items.length) {
    throw new Error("Your cart is empty.");
  }
  if (input.orderType === "dine_in" && !input.tableNumber?.trim()) {
    throw new Error("Table number is required for dine-in orders.");
  }
  if (input.orderType === "delivery" && (!input.customerName?.trim() || !input.phone?.trim())) {
    throw new Error("Name and phone are required for delivery orders.");
  }

  const supabase = createServiceClient();
  const total = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_type: input.orderType,
      table_number: input.orderType === "dine_in" ? input.tableNumber!.trim() : null,
      customer_name: input.customerName?.trim() || null,
      phone: input.orderType === "delivery" ? input.phone!.trim() : null,
      delivery_address: input.orderType === "delivery" ? input.deliveryAddress?.trim() || null : null,
      delivery_location_url: input.orderType === "delivery" ? input.deliveryLocationUrl || null : null,
      total,
    })
    .select()
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "Failed to create order.");
  }

  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .insert(
      input.items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes.trim() || null,
      }))
    )
    .select();

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  const { data: cafeSettings } = await supabase.from("cafe_settings").select("*").eq("id", 1).single();

  let whatsappLink: string | null = null;
  if (cafeSettings) {
    whatsappLink = buildWhatsAppLink(cafeSettings, order, orderItems ?? []);
    await sendToCafeSystem(cafeSettings, order, orderItems ?? []);
  }

  return { orderId: order.id, total, whatsappLink };
}
