"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/supabase/types";

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}
