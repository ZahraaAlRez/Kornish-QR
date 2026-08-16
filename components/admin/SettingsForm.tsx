"use client";

import { useState } from "react";
import type { CafeSettings } from "@/lib/supabase/types";
import { saveSettings } from "@/app/admin/(dashboard)/settings/actions";

export default function SettingsForm({ settings }: { settings: CafeSettings }) {
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={async (formData) => {
        await saveSettings(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }}
      className="space-y-4 rounded-2xl bg-white p-4 shadow-card"
    >
      <label className="block text-sm font-medium">
        Cafe name
        <input name="cafeName" defaultValue={settings.cafe_name} className="mt-1 w-full rounded-lg border border-gold-light/40 p-2 text-sm" />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-medium">
          Logo
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {settings.logo_url && <img src={settings.logo_url} alt="Logo" className="my-1 h-16 w-16 rounded-lg object-contain" />}
          <input type="file" name="logo" accept="image/*" className="w-full text-xs" />
        </label>
        <label className="block text-sm font-medium">
          Main picture
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {settings.main_picture_url && <img src={settings.main_picture_url} alt="Main picture" className="my-1 h-16 w-full rounded-lg object-cover" />}
          <input type="file" name="mainPicture" accept="image/*" className="w-full text-xs" />
        </label>
      </div>

      <label className="block text-sm font-medium">
        WhatsApp number <span className="font-normal text-espresso-light">(digits only, with country code)</span>
        <input
          name="whatsappNumber"
          defaultValue={settings.whatsapp_number ?? ""}
          placeholder="Not configured yet"
          className="mt-1 w-full rounded-lg border border-gold-light/40 p-2 text-sm"
        />
        {!settings.whatsapp_number && (
          <span className="mt-1 block text-xs text-red-600">Not configured — orders won&apos;t offer WhatsApp sending yet.</span>
        )}
      </label>

      <label className="block text-sm font-medium">
        Cafe system webhook URL <span className="font-normal text-espresso-light">(optional, fill in once chosen)</span>
        <input name="webhookUrl" defaultValue={settings.external_system_webhook_url ?? ""} className="mt-1 w-full rounded-lg border border-gold-light/40 p-2 text-sm" />
      </label>

      <label className="block text-sm font-medium">
        Cafe system API key <span className="font-normal text-espresso-light">(optional)</span>
        <input name="apiKey" defaultValue={settings.external_system_api_key ?? ""} className="mt-1 w-full rounded-lg border border-gold-light/40 p-2 text-sm" />
      </label>

      <div className="grid grid-cols-3 gap-3">
        <label className="block text-xs font-medium">
          Primary
          <input type="color" name="primaryColor" defaultValue={settings.brand_colors.primary} className="mt-1 h-9 w-full rounded" />
        </label>
        <label className="block text-xs font-medium">
          Accent
          <input type="color" name="accentColor" defaultValue={settings.brand_colors.accent} className="mt-1 h-9 w-full rounded" />
        </label>
        <label className="block text-xs font-medium">
          Secondary
          <input type="color" name="secondaryColor" defaultValue={settings.brand_colors.secondary} className="mt-1 h-9 w-full rounded" />
        </label>
      </div>

      <button className="w-full rounded-full bg-espresso py-3 text-sm font-semibold uppercase tracking-wide text-cream">
        {saved ? "Saved ✓" : "Save settings"}
      </button>
    </form>
  );
}
