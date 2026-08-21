"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";

interface Props {
  className?: string;
  variant?: "dark" | "light";
}

export default function LanguageToggle({ className = "", variant = "light" }: Props) {
  const { locale, setLocale, t } = useLocale();
  const track = variant === "dark" ? "bg-navy-light/40" : "bg-navy/5";
  const inactive = variant === "dark" ? "text-cream/70" : "text-navy/60";

  return (
    <div className={`inline-flex items-center rounded-full p-1 text-xs font-semibold ${track} ${className}`}>
      <button
        onClick={() => setLocale("en")}
        className={`flex h-11 min-w-11 items-center justify-center rounded-full px-2.5 transition ${
          locale === "en" ? "bg-gold text-navy" : inactive
        }`}
      >
        {t("lang.en")}
      </button>
      <button
        onClick={() => setLocale("ar")}
        className={`flex h-11 min-w-11 items-center justify-center rounded-full px-2.5 transition ${
          locale === "ar" ? "bg-gold text-navy" : inactive
        }`}
      >
        {t("lang.ar")}
      </button>
    </div>
  );
}
