"use client";

import { useCurrency } from "@/lib/currency/CurrencyContext";

interface Props {
  className?: string;
  variant?: "dark" | "light";
}

/**
 * A single tap-to-cycle pill (not a two-segment group like LanguageToggle)
 * — at the primary target width (375px phones), StickyNav's row already
 * holds a logo, search input, language toggle, and cart button, and a
 * second two-segment group there crushed the search input's placeholder
 * down to a couple of visible characters. Same pill/gold-highlight
 * language as the rest of the toggles, just half the footprint.
 */
export default function CurrencyToggle({ className = "", variant = "light" }: Props) {
  const { currency, toggleCurrency } = useCurrency();
  const track = variant === "dark" ? "bg-navy-light/40 text-cream/90" : "bg-navy/5 text-navy/80";

  return (
    <button
      type="button"
      onClick={toggleCurrency}
      aria-label={currency === "USD" ? "Switch to Lebanese Lira" : "Switch to US Dollar"}
      className={`flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-xs font-semibold transition ${track} ${className}`}
    >
      {currency === "USD" ? "$" : "LL"}
    </button>
  );
}
