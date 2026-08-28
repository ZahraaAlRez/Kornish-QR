"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";

const NEXERA_INSTAGRAM_URL =
  "https://www.instagram.com/nexera.software?igsi=MWk5cTZjcTUzcWM2YQ%3D%3D&utm_source=qr";

// Sampled directly from the source logo file's orange diagonal stripe
// (public/brand/nexera-logo.png), not guessed — this is the real brand orange.
const NEXERA_ORANGE = "#FF7A03";
const SPACE_GROTESK = '"Space Grotesk", sans-serif';

/**
 * Fixed "Powered By:" credit — present on every screen, customer and admin
 * alike, and intentionally not exposed in any admin setting (spec §7). A
 * decorative label stacked above a separate clickable Instagram button, the
 * two wrapped in a `flex-col items-stretch` column so the wider of the pair
 * sets the shared width and the other stretches to match it. The NEXERA
 * wordmark itself is recreated in CSS/text (Space Grotesk, matching the
 * source logo's angular geometric letterforms) rather than the source image
 * — the "X" gets its own span in the brand orange, everything else in the
 * page's own dark ink color. A slow, subtle glow breathes behind the whole
 * badge to catch the eye without competing with the page around it.
 */
export default function Footer({ variant = "light" }: { variant?: "dark" | "light" }) {
  const { t } = useLocale();
  const isDark = variant === "dark";

  return (
    <footer className="flex items-center justify-center py-4">
      <div className="relative inline-flex flex-col items-stretch gap-2">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-5 -z-10 rounded-full blur-xl"
          style={{ background: `radial-gradient(circle, ${NEXERA_ORANGE}30, transparent 70%)` }}
          animate={{ opacity: [0.35, 0.8, 0.35], scale: [0.9, 1.08, 0.9] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <span
          className={`text-center font-serif text-sm font-bold italic tracking-wide ${isDark ? "text-cream" : "text-navy"}`}
        >
          {t("footer.poweredBy")}
        </span>

        <a
          href={NEXERA_INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("footer.instagramAriaLabel")}
          className={`group flex flex-col items-center justify-center gap-1 rounded-2xl border bg-transparent px-4 py-2 outline-none transition-[transform,border-color] duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
            isDark ? "border-[#FF7A03]/40 hover:border-[#FF7A03]/70" : "border-[#FF7A03]/35 hover:border-[#FF7A03]/65"
          }`}
        >
          <span
            className={`text-lg font-extrabold uppercase leading-none tracking-[0.14em] ${isDark ? "text-cream" : "text-[#1a1a1a]"}`}
            style={{ fontFamily: SPACE_GROTESK }}
          >
            NE<span style={{ color: NEXERA_ORANGE }}>X</span>ERA
          </span>
          <span className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-px w-3" style={{ backgroundColor: NEXERA_ORANGE }} />
            <span
              className={`text-[7px] font-normal uppercase leading-none tracking-[0.3em] ${isDark ? "text-cream/60" : "text-navy/45"}`}
              style={{ fontFamily: SPACE_GROTESK }}
            >
              Software Solutions
            </span>
            <span className="h-px w-3" style={{ backgroundColor: NEXERA_ORANGE }} />
          </span>
        </a>
      </div>
    </footer>
  );
}
