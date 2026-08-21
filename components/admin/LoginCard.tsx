"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function LoginCard({
  action,
  hasError,
  justReset,
}: {
  action: (formData: FormData) => void;
  hasError: boolean;
  justReset?: boolean;
}) {
  const { t, locale } = useLocale();

  return (
    <div className="w-full max-w-xs rounded-3xl bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <Image src="/brand/sultana-logo-icon.png" alt="" width={40} height={40} className="h-10 w-10 object-contain" />
        <LanguageToggle variant="light" />
      </div>

      <p className="mb-5 text-sm text-navy/70">{t("admin.subtitle")}</p>

      {justReset && (
        <p className="mb-4 rounded-lg bg-whatsapp/10 p-2 text-xs text-whatsapp">
          {locale === "ar" ? "تم تحديث كلمة المرور، سجّل الدخول بها الآن." : "Password updated — log in with it now."}
        </p>
      )}

      <form action={action}>
        <label className="block text-sm font-medium text-navy">
          {t("admin.password")}
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="mt-1 w-full min-h-11 rounded-xl border border-gold/30 bg-white p-2 outline-none focus:border-gold"
          />
        </label>

        {hasError && <p className="mt-3 text-sm text-red-600">{t("admin.wrongPassword")}</p>}

        <motion.button
          whileHover={{ scale: 1.02, filter: "brightness(1.06)" }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="mt-5 w-full rounded-full bg-gold-gradient py-3 text-sm font-semibold uppercase tracking-wide text-navy"
        >
          {t("admin.login")}
        </motion.button>
      </form>

      <Link href="/admin/reset-password" className="mt-4 block text-center text-xs text-navy/50 underline">
        {t("admin.forgotPassword")}
      </Link>
    </div>
  );
}
