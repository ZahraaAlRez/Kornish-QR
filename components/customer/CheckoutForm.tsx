"use client";

import { useState } from "react";
import type { CartLine } from "./cartTypes";
import { cartTotal } from "./cartTypes";
import type { OrderType } from "@/lib/supabase/types";

export interface CheckoutValues {
  orderType: OrderType;
  tableNumber: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  deliveryLocationUrl: string;
}

interface Props {
  lines: CartLine[];
  initialTableNumber?: string;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (values: CheckoutValues) => void;
}

export default function CheckoutForm({ lines, initialTableNumber, submitting, error, onClose, onSubmit }: Props) {
  const [orderType, setOrderType] = useState<OrderType>("dine_in");
  const [tableNumber, setTableNumber] = useState(initialTableNumber ?? "");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryLocationUrl, setDeliveryLocationUrl] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const total = cartTotal(lines);

  function shareLocation() {
    if (!navigator.geolocation) {
      setLocationError("Location isn't available on this device/browser.");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDeliveryLocationUrl(`https://www.google.com/maps?q=${latitude},${longitude}`);
        setLocating(false);
      },
      () => {
        setLocationError("Couldn't get your location. You can still type your address below.");
        setLocating(false);
      }
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ orderType, tableNumber, customerName, phone, deliveryAddress, deliveryLocationUrl });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-espresso/60 sm:items-center sm:justify-center">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 sm:max-w-md sm:rounded-3xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl italic">Checkout</h2>
          <button type="button" onClick={onClose} className="text-2xl leading-none text-espresso-light">
            ×
          </button>
        </div>

        <div className="mb-4 flex rounded-full bg-cream p-1">
          <button
            type="button"
            onClick={() => setOrderType("dine_in")}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
              orderType === "dine_in" ? "bg-espresso text-cream" : "text-espresso-light"
            }`}
          >
            Dine-in
          </button>
          <button
            type="button"
            onClick={() => setOrderType("delivery")}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
              orderType === "delivery" ? "bg-espresso text-cream" : "text-espresso-light"
            }`}
          >
            Delivery
          </button>
        </div>

        {orderType === "dine_in" ? (
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Table number *
              <input
                required
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gold-light/40 p-2 outline-none focus:border-gold"
                placeholder="e.g. 4"
              />
            </label>
            <label className="block text-sm font-medium">
              Name <span className="font-normal text-espresso-light">(optional)</span>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gold-light/40 p-2 outline-none focus:border-gold"
              />
            </label>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Name *
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gold-light/40 p-2 outline-none focus:border-gold"
              />
            </label>
            <label className="block text-sm font-medium">
              Phone *
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gold-light/40 p-2 outline-none focus:border-gold"
              />
            </label>

            <button
              type="button"
              onClick={shareLocation}
              disabled={locating}
              className="w-full rounded-xl border border-gold bg-gold-light/10 py-2 text-sm font-medium text-gold disabled:opacity-50"
            >
              {locating ? "Getting location…" : deliveryLocationUrl ? "Location shared ✓" : "Share my location"}
            </button>
            {locationError && <p className="text-xs text-red-600">{locationError}</p>}

            <label className="block text-sm font-medium">
              Address <span className="font-normal text-espresso-light">(or as a fallback)</span>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-xl border border-gold-light/40 p-2 outline-none focus:border-gold"
              />
            </label>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-5 flex items-center justify-between text-sm font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-3 w-full rounded-full bg-espresso py-3 text-sm font-semibold uppercase tracking-wide text-cream disabled:opacity-50"
        >
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </form>
    </div>
  );
}
