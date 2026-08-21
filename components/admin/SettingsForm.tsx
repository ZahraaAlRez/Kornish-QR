"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { CafeSettings } from "@/lib/supabase/types";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { saveSettings } from "@/app/admin/(dashboard)/settings/actions";

export default function SettingsForm({ settings }: { settings: CafeSettings }) {
  const { t } = useLocale();
  const [saved, setSaved] = useState(false);
  const [recoveryEmailError, setRecoveryEmailError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await saveSettings(formData);
    if (result.ok) {
      setRecoveryEmailError(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else if (result.error === "recoveryEmail") {
      setRecoveryEmailError(true);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-4 shadow-card">
      <h2 className="font-serif text-xl italic text-navy">{t("admin.settings.title")}</h2>

      <label className="block text-sm font-medium text-navy">
        {t("admin.settings.cafeName")}
        <input name="cafeName" defaultValue={settings.cafe_name} className="mt-1 w-full rounded-lg border border-gold/30 p-2 text-sm" />
      </label>

      <label className="block text-sm font-medium text-navy">
        {t("admin.settings.logo")}
        {settings.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={settings.logo_url} alt="Logo" className="my-1 h-16 w-16 rounded-lg bg-navy object-contain p-1" />
        )}
        <input type="file" name="logo" accept="image/*" className="w-full text-xs" />
      </label>

      <label className="block text-sm font-medium text-navy">
        {t("admin.settings.whatsappNumber")} <span className="font-normal text-navy/50">{t("admin.settings.whatsappHint")}</span>
        <input
          name="whatsappNumber"
          defaultValue={settings.whatsapp_number ?? ""}
          className="mt-1 w-full rounded-lg border border-gold/30 p-2 text-sm"
        />
        {!settings.whatsapp_number && (
          <span className="mt-1 block text-xs text-red-600">{t("admin.settings.whatsappNotConfigured")}</span>
        )}
      </label>

      <label className="block text-sm font-medium text-navy">
        {t("admin.settings.webhookUrl")} <span className="font-normal text-navy/50">{t("admin.settings.webhookHint")}</span>
        <input name="webhookUrl" defaultValue={settings.external_system_webhook_url ?? ""} className="mt-1 w-full rounded-lg border border-gold/30 p-2 text-sm" />
      </label>

      <label className="block text-sm font-medium text-navy">
        {t("admin.settings.apiKey")}
        <input name="apiKey" defaultValue={settings.external_system_api_key ?? ""} className="mt-1 w-full rounded-lg border border-gold/30 p-2 text-sm" />
      </label>

      <label className="block text-sm font-medium text-navy">
        {t("admin.settings.recoveryEmail")} <span className="font-normal text-red-500">*</span>{" "}
        <span className="font-normal text-navy/50">{t("admin.settings.recoveryEmailHint")}</span>
        <input
          type="email"
          name="recoveryEmail"
          defaultValue={settings.admin_recovery_email ?? ""}
          onChange={() => setRecoveryEmailError(false)}
          className={`mt-1 w-full rounded-lg border p-2 text-sm ${recoveryEmailError ? "border-red-400" : "border-gold/30"}`}
        />
        {recoveryEmailError && (
          <span className="mt-1 block text-xs text-red-600">{t("admin.settings.recoveryEmailRequired")}</span>
        )}
      </label>

      <div className="grid grid-cols-3 gap-3">
        <label className="block text-xs font-medium text-navy">
          {t("admin.settings.primaryColor")}
          <input type="color" name="primaryColor" defaultValue={settings.brand_colors.primary} className="mt-1 h-9 w-full rounded" />
        </label>
        <label className="block text-xs font-medium text-navy">
          {t("admin.settings.accentColor")}
          <input type="color" name="accentColor" defaultValue={settings.brand_colors.accent} className="mt-1 h-9 w-full rounded" />
        </label>
        <label className="block text-xs font-medium text-navy">
          {t("admin.settings.secondaryColor")}
          <input type="color" name="secondaryColor" defaultValue={settings.brand_colors.secondary} className="mt-1 h-9 w-full rounded" />
        </label>
      </div>

      <motion.button
        whileHover={{ scale: 1.01, filter: "brightness(1.06)" }}
        whileTap={{ scale: 0.98 }}
        className="w-full rounded-full bg-gold-gradient py-3 text-sm font-semibold uppercase tracking-wide text-navy"
      >
        {saved ? t("admin.settings.saved") : t("admin.settings.save")}
      </motion.button>
    </form>
  );
}
