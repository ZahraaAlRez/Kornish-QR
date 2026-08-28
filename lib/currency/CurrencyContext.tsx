"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Currency = "USD" | "LBP";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  /** Formats a USD amount (the storage/source-of-truth unit) into the customer's chosen display currency. */
  formatPrice: (usdAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const STORAGE_KEY = "sultana-currency";

const DEFAULT_RATE = 90000;

export function CurrencyProvider({ rate, children }: { rate: number; children: React.ReactNode }) {
  // Guards against the rate arriving as undefined/0/NaN — e.g. before the
  // usd_to_lbp_rate migration has been run against a given database, or any
  // other unexpected value — so a misconfigured/missing rate can never
  // silently turn every LBP price into "NaN LL".
  const safeRate = Number.isFinite(rate) && rate > 0 ? rate : DEFAULT_RATE;
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "USD" || stored === "LBP") setCurrencyState(stored);
  }, []);

  function setCurrency(next: Currency) {
    setCurrencyState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      toggleCurrency: () => setCurrency(currency === "USD" ? "LBP" : "USD"),
      formatPrice: (usdAmount) => {
        if (currency === "USD") return `$${usdAmount.toFixed(2)}`;
        // Explicit "en-US" locale (not the browser/OS default) — the same
        // fix as elsewhere in this app for locale-dependent number
        // formatting, which otherwise renders Arabic-Indic digits on an
        // Arabic-locale device regardless of the page's own language.
        const lbp = Math.round(usdAmount * safeRate).toLocaleString("en-US");
        return `${lbp} LL`;
      },
    }),
    [currency, safeRate]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
