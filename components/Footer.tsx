"use client";

import Image from "next/image";
import { useLocale } from "@/lib/i18n/LocaleContext";

const NEXERA_INSTAGRAM_URL =
  "https://www.instagram.com/nexera.software?igsi=MWk5cTZjcTUzcWM2YQ%3D%3D&utm_source=qr";

/**
 * Fixed "Powered by NEXERA" credit — present on every screen, customer and
 * admin alike, and intentionally not exposed in any admin setting (spec §7).
 * Rendered as a single clickable capsule linking out to NEXERA's Instagram.
 * The source logo is a full square lockup (icon + wordmark + subtext) with
 * generous padding, so it's cropped/zoomed onto just the icon mark here —
 * the "Powered by" label alongside it already carries the wordmark.
 */
export default function Footer({ variant = "light" }: { variant?: "dark" | "light" }) {
  const { t } = useLocale();
  const isDark = variant === "dark";

  return (
    <footer className="flex items-center justify-center py-3">
      <a
        href={NEXERA_INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("footer.instagramAriaLabel")}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 opacity-90 shadow-sm outline-none transition-[transform,opacity,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:cursor-pointer hover:opacity-100 hover:shadow-card active:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
          isDark ? "border-cream/20 bg-navy-light/30" : "border-navy/15 bg-white/60"
        }`}
      >
        <span
          className={`font-ui text-[10px] font-semibold uppercase tracking-wide ${
            isDark ? "text-cream/70" : "text-navy/60"
          }`}
        >
          {t("footer.poweredByShort")}
        </span>
        <span aria-hidden="true" className={`h-3 w-px shrink-0 ${isDark ? "bg-cream/25" : "bg-navy/15"}`} />
        <span className="relative h-4 w-4 shrink-0 overflow-hidden rounded-sm">
          <Image src="/brand/nexera-logo.png" alt="" fill sizes="16px" className="scale-[2.1] object-cover object-[50%_28%]" />
        </span>
      </a>
    </footer>
  );
}
