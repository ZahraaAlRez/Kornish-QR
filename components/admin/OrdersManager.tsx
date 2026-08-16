"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { OrderWithItems } from "@/app/admin/(dashboard)/orders/page";
import { updateOrderStatus } from "@/app/admin/(dashboard)/orders/actions";
import type { OrderStatus } from "@/lib/supabase/types";
import Calendar from "./Calendar";

const STATUS_FLOW: Record<OrderStatus, OrderStatus> = {
  new: "preparing",
  preparing: "done",
  done: "new",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface Props {
  orders: OrderWithItems[];
  year: number;
  month: number;
  selectedDay: number | null;
}

export default function OrdersManager({ orders, year, month, selectedDay }: Props) {
  const router = useRouter();

  // Polls for new orders instead of a client-side Supabase Realtime
  // subscription — orders/order_items have no public SELECT policy (only
  // INSERT, so the customer app can submit without exposing every order to
  // anyone with the anon key), and this stays behind the password-gated
  // service-role fetch in page.tsx.
  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 15000);
    return () => clearInterval(interval);
  }, [router]);

  const summaryByDay = useMemo(() => {
    const map: Record<number, { count: number; total: number }> = {};
    for (const order of orders) {
      const day = new Date(order.created_at).getDate();
      if (!map[day]) map[day] = { count: 0, total: 0 };
      map[day].count += 1;
      map[day].total += order.total;
    }
    return map;
  }, [orders]);

  const visibleOrders = selectedDay
    ? orders.filter((o) => new Date(o.created_at).getDate() === selectedDay)
    : orders;

  const rangeTotal = visibleOrders.reduce((sum, o) => sum + o.total, 0);

  function goToMonth(delta: number) {
    const date = new Date(Date.UTC(year, month - 1 + delta, 1));
    router.push(`/admin/orders?year=${date.getUTCFullYear()}&month=${date.getUTCMonth() + 1}`);
  }

  function selectDay(day: number | null) {
    const params = new URLSearchParams({ year: String(year), month: String(month) });
    if (day) params.set("day", String(day));
    router.push(`/admin/orders?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => goToMonth(-1)} className="text-sm text-espresso-light">
          ← Prev
        </button>
        <h2 className="font-serif text-lg italic">
          {MONTH_NAMES[month - 1]} {year}
        </h2>
        <button onClick={() => goToMonth(1)} className="text-sm text-espresso-light">
          Next →
        </button>
      </div>

      <Calendar year={year} month={month} selectedDay={selectedDay} summaryByDay={summaryByDay} onSelectDay={selectDay} />

      <div className="flex items-center justify-between rounded-2xl bg-white p-3 text-sm shadow-card">
        <span className="text-espresso-light">
          {selectedDay ? `Day ${selectedDay}` : "Whole month"} · {visibleOrders.length} orders
        </span>
        <span className="font-semibold">${rangeTotal.toFixed(2)}</span>
      </div>

      <div className="space-y-3">
        {visibleOrders.length === 0 && (
          <p className="py-10 text-center text-sm text-espresso-light">No orders for this period.</p>
        )}
        {visibleOrders.map((order) => (
          <div key={order.id} className="rounded-2xl bg-white p-3 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">
                  {order.order_type === "dine_in" ? `Dine-in · Table ${order.table_number}` : "Delivery"}
                  {order.customer_name ? ` · ${order.customer_name}` : ""}
                </p>
                <p className="text-xs text-espresso-light">
                  {new Date(order.created_at).toLocaleString()}
                </p>
                {order.order_type === "delivery" && (
                  <p className="text-xs text-espresso-light">
                    {order.phone}
                    {order.delivery_address ? ` · ${order.delivery_address}` : ""}
                    {order.delivery_location_url && (
                      <>
                        {" · "}
                        <a href={order.delivery_location_url} target="_blank" rel="noopener noreferrer" className="underline">
                          map
                        </a>
                      </>
                    )}
                  </p>
                )}
              </div>
              <button
                onClick={() => updateOrderStatus(order.id, STATUS_FLOW[order.status])}
                className="shrink-0 rounded-full bg-gold-light/25 px-3 py-1 text-xs font-medium capitalize text-espresso"
              >
                {order.status}
              </button>
            </div>

            <ul className="mt-2 space-y-0.5 text-xs text-espresso-light">
              {order.order_items.map((item) => (
                <li key={item.id}>
                  {item.quantity}x {item.name}
                  {item.notes ? ` (${item.notes})` : ""}
                </li>
              ))}
            </ul>

            <p className="mt-2 text-right text-sm font-semibold text-gold">${order.total.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
