import { createServiceClient } from "@/lib/supabase/server";
import type { Order, OrderItem } from "@/lib/supabase/types";
import OrdersManager from "@/components/admin/OrdersManager";

export const dynamic = "force-dynamic";

export type OrderWithItems = Order & { order_items: OrderItem[] };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { year?: string; month?: string; day?: string };
}) {
  const now = new Date();
  const year = Number(searchParams.year) || now.getFullYear();
  const month = Number(searchParams.month) || now.getMonth() + 1; // 1-12
  const selectedDay = searchParams.day ? Number(searchParams.day) : null;

  const start = new Date(Date.UTC(year, month - 1, 1)).toISOString();
  const end = new Date(Date.UTC(year, month, 1)).toISOString();

  const supabase = createServiceClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .gte("created_at", start)
    .lt("created_at", end)
    .order("created_at", { ascending: false });

  return (
    <OrdersManager
      orders={(orders as OrderWithItems[] | null) ?? []}
      year={year}
      month={month}
      selectedDay={selectedDay}
    />
  );
}
