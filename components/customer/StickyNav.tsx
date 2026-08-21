"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
import LanguageToggle from "@/components/LanguageToggle";

interface Props {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  /** 0 while still on the hero, 1 once scrolled into the menu. */
  progress: MotionValue<number>;
  onLogoClick: () => void;
  onCartButtonRectChange: (rect: DOMRect | null) => void;
}

/**
 * Compact warm glass bar. The hero's large logo hands off into the small
 * mark here as `progress` advances — same real artwork, same `.logo-mask`
 * navy recolor, so the shape carries through unbroken.
 */
export default function StickyNav({
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  progress,
  onLogoClick,
  onCartButtonRectChange,
}: Props) {
  const { t } = useLocale();
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const [bump, setBump] = useState(false);
  const prevCount = useRef(cartCount);

  useEffect(() => {
    function report() {
      onCartButtonRectChange(cartButtonRef.current?.getBoundingClientRect() ?? null);
    }
    report();
    window.addEventListener("resize", report);
    return () => window.removeEventListener("resize", report);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartCount]);

  useEffect(() => {
    if (cartCount !== prevCount.current) {
      setBump(true);
      prevCount.current = cartCount;
      const timer = setTimeout(() => setBump(false), 350);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const barOpacity = useTransform(progress, [0.35, 0.75], [0, 1]);
  const barBlur = useTransform(barOpacity, (v) => `blur(${v * 14}px)`);
  const logoOpacity = useTransform(progress, [0.5, 0.85], [0, 1]);
  const logoScale = useTransform(progress, [0.5, 0.85], [0.7, 1]);
  const chromeOpacity = useTransform(progress, [0.5, 0.85], [0, 1]);
  const chromeY = useTransform(progress, [0.5, 0.85], [8, 0]);
  // While still on the hero this bar is invisible (opacity-animated), but an
  // invisible element still captures clicks unless pointer-events is turned
  // off — without this, its own (invisible) logo/search/language/cart
  // controls sit on top of and steal clicks from the hero's real ones below.
  const navPointerEvents = useTransform(progress, (v) => (v > 0.3 ? "auto" : "none"));

  return (
    <motion.div style={{ pointerEvents: navPointerEvents }} className="fixed inset-x-0 top-0 z-30">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 border-b border-navy/10 bg-ivory/85"
        style={{ opacity: barOpacity, backdropFilter: barBlur }}
      />
      <div className="relative mx-auto flex max-w-[1180px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <motion.button
          onClick={onLogoClick}
          style={{ opacity: logoOpacity, scale: logoScale }}
          className="-m-2 flex h-11 w-11 shrink-0 items-center justify-center"
          aria-label={t("hero.cta")}
        >
          <span
            className="logo-mask block h-7 w-7 bg-navy"
            style={{ maskImage: "url(/brand/sultana-logo-icon.png)", WebkitMaskImage: "url(/brand/sultana-logo-icon.png)" }}
            role="img"
            aria-label=""
          />
        </motion.button>

        <motion.div style={{ opacity: chromeOpacity, y: chromeY }} className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("menu.searchPlaceholder")}
              className="h-11 w-full rounded-full border border-navy/10 bg-white/90 px-4 font-ui text-sm text-navy outline-none placeholder:text-navy/40 focus:border-gold"
            />
          </div>
          <LanguageToggle variant="light" />
          <button
            ref={cartButtonRef}
            onClick={onOpenCart}
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-cream"
            aria-label={t("menu.cartView")}
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 4h2l2.2 11.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
              <circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none" />
            </svg>
            {cartCount > 0 && (
              <span
                className={`absolute -end-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-navy ${
                  bump ? "animate-badge-pulse" : ""
                }`}
              >
                {cartCount}
              </span>
            )}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
