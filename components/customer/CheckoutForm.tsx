"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
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
  const { t } = useLocale();
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
      setLocationError(t("checkout.locationError"));
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
        setLocationError(t("checkout.locationError"));
        setLocating(false);
      }
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ orderType, tableNumber, customerName, phone, deliveryAddress, deliveryLocationUrl });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-navy-deep/50 backdrop-blur-sm sm:items-center sm:justify-center">
      <motion.form
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-cream p-5 pb-8 sm:max-w-md sm:rounded-3xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl italic text-navy">{t("checkout.title")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="-m-2.5 flex h-11 w-11 items-center justify-center text-2xl leading-none text-navy/50"
          >
            ×
          </button>
        </div>

        <div className="mb-4 flex rounded-full bg-navy/5 p-1">
          <button
            type="button"
            onClick={() => setOrderType("dine_in")}
            className={`min-h-11 flex-1 rounded-full py-2 text-sm font-medium transition ${
              orderType === "dine_in" ? "bg-gold-gradient text-navy" : "text-navy/60"
            }`}
          >
            {t("checkout.dineIn")}
          </button>
          <button
            type="button"
            onClick={() => setOrderType("delivery")}
            className={`min-h-11 flex-1 rounded-full py-2 text-sm font-medium transition ${
              orderType === "delivery" ? "bg-gold-gradient text-navy" : "text-navy/60"
            }`}
          >
            {t("checkout.delivery")}
          </button>
        </div>

        {orderType === "dine_in" ? (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-navy">
              {t("checkout.tableNumber")} *
              <input
                required
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="mt-1 w-full min-h-11 rounded-xl border border-gold/30 bg-white p-2 outline-none focus:border-gold"
                placeholder="e.g. 4"
              />
            </label>
            <label className="block text-sm font-medium text-navy">
              {t("checkout.name")} <span className="font-normal text-navy/50">{t("checkout.optional")}</span>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 w-full min-h-11 rounded-xl border border-gold/30 bg-white p-2 outline-none focus:border-gold"
              />
            </label>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-navy">
              {t("checkout.name")} *
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 w-full min-h-11 rounded-xl border border-gold/30 bg-white p-2 outline-none focus:border-gold"
              />
            </label>
            <label className="block text-sm font-medium text-navy">
              {t("checkout.phone")} *
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full min-h-11 rounded-xl border border-gold/30 bg-white p-2 outline-none focus:border-gold"
              />
            </label>

            <button
              type="button"
              onClick={shareLocation}
              disabled={locating}
              className="min-h-11 w-full rounded-xl border border-gold bg-gold/10 py-2 font-ui text-sm font-medium text-terracotta disabled:opacity-50"
            >
              {locating ? t("checkout.gettingLocation") : deliveryLocationUrl ? t("checkout.locationShared") : t("checkout.shareLocation")}
            </button>
            {locationError && <p className="text-xs text-red-600">{locationError}</p>}

            <label className="block text-sm font-medium text-navy">
              {t("checkout.address")} <span className="font-normal text-navy/50">{t("checkout.addressHint")}</span>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={2}
                className="mt-1 w-full min-h-11 rounded-xl border border-gold/30 bg-white p-2 outline-none focus:border-gold"
              />
            </label>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-5 flex items-center justify-between font-ui text-sm font-semibold text-navy">
          <span>{t("cart.total")}</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, filter: "brightness(1.06)" }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={submitting}
          className="mt-3 w-full rounded-full bg-gold-gradient py-3 font-ui text-sm font-semibold uppercase tracking-wide text-navy disabled:opacity-50"
        >
          {submitting ? t("checkout.placingOrder") : t("checkout.placeOrder")}
        </motion.button>
      </motion.form>
    </div>
  );
}
