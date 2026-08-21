"use client";

import Image from "next/image";
import { useLocale } from "@/lib/i18n/LocaleContext";

/**
 * Fixed "Powered by NEXERA" credit — present on every screen, customer and
 * admin alike, and intentionally not exposed in any admin setting (spec §7).
 * The source logo is a full square lockup (icon + wordmark + subtext) with
 * generous padding, so it's cropped/zoomed onto just the icon mark here —
 * the adjacent "Powered by NEXERA" text already carries the wordmark.
 */
export default function Footer({ variant = "light" }: { variant?: "dark" | "light" }) {
  const { t } = useLocale();
  const textColor = variant === "dark" ? "text-cream/50" : "text-navy/45";

  return (
    <footer className={`flex items-center justify-center gap-1.5 py-3 text-[11px] opacity-90 transition hover:opacity-100 ${textColor}`}>
      <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded-sm">
        <Image src="/brand/nexera-logo.jpeg" alt="" fill sizes="16px" className="scale-[2.1] object-cover object-[50%_28%]" />
      </div>
      <span>{t("footer.poweredBy")}</span>
    </footer>
  );
}
