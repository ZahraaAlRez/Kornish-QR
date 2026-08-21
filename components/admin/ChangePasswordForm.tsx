"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { changePassword } from "@/app/admin/(dashboard)/settings/actions";

export default function ChangePasswordForm() {
  const { t } = useLocale();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await changePassword(formData);
    if (result.ok) {
      setStatus("saved");
      setError(null);
      e.currentTarget.reset();
      setTimeout(() => setStatus("idle"), 2500);
    } else {
      setStatus("error");
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-4 shadow-card">
      <h2 className="font-serif text-lg italic text-navy">{t("admin.settings.changePassword")}</h2>

      <label className="block text-sm font-medium text-navy">
        {t("admin.settings.currentPassword")}
        <input type="password" name="currentPassword" required className="mt-1 w-full rounded-lg border border-gold/30 p-2 text-sm" />
      </label>
      <label className="block text-sm font-medium text-navy">
        {t("admin.settings.newPassword")}
        <input type="password" name="newPassword" required minLength={8} className="mt-1 w-full rounded-lg border border-gold/30 p-2 text-sm" />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <motion.button
        whileHover={{ scale: 1.01, filter: "brightness(1.06)" }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full rounded-full border border-gold py-3 text-sm font-semibold uppercase tracking-wide text-bronze"
      >
        {status === "saved" ? t("admin.settings.passwordUpdated") : t("admin.settings.updatePassword")}
      </motion.button>
    </form>
  );
}
