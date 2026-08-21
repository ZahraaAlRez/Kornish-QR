"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderWithItems } from "@/app/admin/(dashboard)/orders/page";
import { updateOrderStatus } from "@/app/admin/(dashboard)/orders/actions";
import type { OrderStatus } from "@/lib/supabase/types";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Calendar from "./Calendar";

const STATUS_FLOW: Record<OrderStatus, OrderStatus> = {
  new: "preparing",
  preparing: "done",
  done: "new",
};

const MONTH_NAMES = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
};

// Always a fixed, explicit locale — never the server's or browser's default
// (which can silently differ between them, e.g. Arabic-Indic numerals on
// one side and ASCII digits on the other) — that mismatch is exactly what
// causes a React hydration error on a value like this.
function formatOrderTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface Props {
  orders: OrderWithItems[];
  year: number;
  month: number;
  selectedDay: number | null;
}

export default function OrdersManager({ orders, year, month, selectedDay }: Props) {
  const router = useRouter();
  const { t, locale } = useLocale();
  const [picker, setPicker] = useState<"month" | "year" | null>(null);
  const [yearInput, setYearInput] = useState(String(year));

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

  function goToYearMonth(nextYear: number, nextMonth: number) {
    router.push(`/admin/orders?year=${nextYear}&month=${nextMonth}`);
    setPicker(null);
  }

  function selectDay(day: number | null) {
    const params = new URLSearchParams({ year: String(year), month: String(month) });
    if (day) params.set("day", String(day));
    router.push(`/admin/orders?${params.toString()}`);
  }

  const currentYear = new Date().getFullYear();
  const quickYears = Array.from({ length: 6 }, (_, i) => currentYear - 4 + i);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => goToMonth(-1)} className="text-sm text-navy/60">
          ← {t("admin.orders.prev")}
        </button>
        <div className="flex items-center gap-1.5 font-serif text-lg italic text-navy">
          <button
            onClick={() => setPicker(picker === "month" ? null : "month")}
            className={`rounded-lg px-1.5 transition ${picker === "month" ? "bg-gold/20" : "hover:bg-gold/10"}`}
          >
            {MONTH_NAMES[locale][month - 1]}
          </button>
          <button
            onClick={() => {
              setYearInput(String(year));
              setPicker(picker === "year" ? null : "year");
            }}
            className={`rounded-lg px-1.5 transition ${picker === "year" ? "bg-gold/20" : "hover:bg-gold/10"}`}
          >
            {year}
          </button>
        </div>
        <button onClick={() => goToMonth(1)} className="text-sm text-navy/60">
          {t("admin.orders.next")} →
        </button>
      </div>

      {picker === "month" && (
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-3 shadow-card">
          {MONTH_NAMES[locale].map((name, i) => (
            <button
              key={name}
              onClick={() => goToYearMonth(year, i + 1)}
              className={`rounded-lg py-2 text-xs font-medium ${
                i + 1 === month ? "bg-navy text-cream" : "text-navy/70 hover:bg-gold/10"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {picker === "year" && (
        <div className="space-y-3 rounded-2xl bg-white p-3 shadow-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const parsed = Number(yearInput);
              if (Number.isFinite(parsed) && parsed > 0) goToYearMonth(parsed, month);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              dir="ltr"
              value={yearInput}
              onChange={(e) => setYearInput(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full rounded-lg border border-gold/30 p-2 text-sm"
              aria-label={t("admin.orders.selectYear")}
            />
            <button type="submit" className="shrink-0 rounded-lg bg-gold-gradient px-4 text-xs font-semibold uppercase text-navy">
              {t("admin.orders.go")}
            </button>
          </form>
          <div className="grid grid-cols-3 gap-2">
            {quickYears.map((y) => (
              <button
                key={y}
                onClick={() => goToYearMonth(y, month)}
                className={`rounded-lg py-2 text-xs font-medium ${y === year ? "bg-navy text-cream" : "text-navy/70 hover:bg-gold/10"}`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      )}

      <Calendar year={year} month={month} selectedDay={selectedDay} summaryByDay={summaryByDay} onSelectDay={selectDay} />

      <div className="flex items-center justify-between rounded-2xl bg-white p-3 text-sm shadow-card">
        <span className="text-navy/60">
          {selectedDay ? `${t("admin.orders.day")} ${selectedDay}` : t("admin.orders.wholeMonth")} · {visibleOrders.length}{" "}
          {t("admin.orders.orders")}
        </span>
        <span className="font-semibold text-navy">${rangeTotal.toFixed(2)}</span>
      </div>

      <div className="space-y-3">
        {visibleOrders.length === 0 && (
          <p className="py-10 text-center text-sm text-navy/50">{t("admin.orders.noOrders")}</p>
        )}
        {visibleOrders.map((order) => (
          <div key={order.id} className="rounded-2xl bg-white p-3 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-navy">
                  {order.order_type === "dine_in" ? `${t("checkout.dineIn")} · Table ${order.table_number}` : t("checkout.delivery")}
                  {order.customer_name ? ` · ${order.customer_name}` : ""}
                </p>
                <p className="text-xs text-navy/50">{formatOrderTimestamp(order.created_at)}</p>
                {order.order_type === "delivery" && (
                  <p className="text-xs text-navy/50">
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
                className="shrink-0 rounded-full bg-gold/20 px-3 py-1 text-xs font-medium text-navy"
              >
                {t(`admin.orders.status.${order.status}` as const)}
              </button>
            </div>

            <ul className="mt-2 space-y-0.5 text-xs text-navy/60">
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
