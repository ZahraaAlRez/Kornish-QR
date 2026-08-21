"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
import LanguageToggle from "@/components/LanguageToggle";
import { requestPasswordReset } from "@/app/admin/reset-password/actions";

const ERROR_MESSAGES: Record<string, { en: string; ar: string }> = {
  "1": { en: "Wrong recovery key.", ar: "مفتاح الاسترداد غير صحيح." },
  "2": { en: "New password must be at least 8 characters.", ar: "يجب ألا تقل كلمة المرور الجديدة عن 8 أحرف." },
  "3": { en: "Something went wrong. Try again.", ar: "حدث خطأ ما. حاول مرة أخرى." },
  "4": { en: "That reset link is invalid or has expired.", ar: "رابط إعادة التعيين غير صالح أو منتهي الصلاحية." },
};

interface Props {
  /** Present once the admin has clicked the emailed link. */
  token?: string;
  errorCode?: string;
  keyAction: (formData: FormData) => void;
  tokenAction: (formData: FormData) => void;
}

export default function ResetPasswordCard({ token, errorCode, keyAction, tokenAction }: Props) {
  const { t, locale } = useLocale();
  const errorMessage = errorCode ? ERROR_MESSAGES[errorCode]?.[locale] : null;

  return (
    <div className="w-full max-w-xs rounded-3xl bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <Image src="/brand/sultana-logo-icon.png" alt="" width={40} height={40} className="h-10 w-10 object-contain" />
        <LanguageToggle variant="light" />
      </div>

      <h1 className="mb-1 font-serif text-xl italic text-navy">{t("admin.reset.title")}</h1>

      {token ? (
        <TokenStep token={token} action={tokenAction} errorMessage={errorMessage} />
      ) : (
        <EmailLinkStep keyAction={keyAction} errorMessage={errorMessage} />
      )}
    </div>
  );
}

/** Step 1: no manual email entry — there's only ever one recovery address on file. */
function EmailLinkStep({ keyAction, errorMessage }: { keyAction: (formData: FormData) => void; errorMessage: string | null }) {
  const { t } = useLocale();
  const [showKeyFallback, setShowKeyFallback] = useState(false);
  const [status, setStatus] = useState<{ sent: boolean; maskedEmail: string } | { error: string } | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSend() {
    setSending(true);
    try {
      const result = await requestPasswordReset();
      setStatus(result.ok ? { sent: result.sent, maskedEmail: result.maskedEmail } : { error: result.error });
    } catch {
      // Never leave the button stuck on "Sending…" — surface the recovery-key
      // fallback instead of a silent dead end.
      setStatus({ error: "server_error" });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <p className="mb-5 text-xs text-navy/60">{t("admin.reset.emailHint")}</p>

      {!status && (
        <motion.button
          whileHover={{ scale: 1.02, filter: "brightness(1.06)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSend}
          disabled={sending}
          className="w-full rounded-full bg-gold-gradient py-3 text-sm font-semibold uppercase tracking-wide text-navy disabled:opacity-60"
        >
          {sending ? t("admin.reset.sending") : t("admin.reset.sendLink")}
        </motion.button>
      )}

      {status && "error" in status && (
        <p className="rounded-lg bg-red-50 p-3 text-xs text-red-600">
          {status.error === "no_recovery_email" ? t("admin.reset.noRecoveryEmail") : t("admin.reset.hint")}
        </p>
      )}

      {status && "sent" in status && status.sent && (
        <p className="rounded-lg bg-whatsapp/10 p-3 text-xs text-whatsapp">
          {t("admin.reset.linkSent")} {status.maskedEmail}
        </p>
      )}

      {status && "sent" in status && !status.sent && (
        <p className="rounded-lg bg-gold/10 p-3 text-xs text-navy/70">{t("admin.reset.emailNotConfigured")}</p>
      )}

      <button
        type="button"
        onClick={() => setShowKeyFallback((v) => !v)}
        className="mt-4 flex min-h-11 w-full items-center justify-center text-center text-xs text-navy/50 underline"
      >
        {t("admin.reset.useKeyInstead")}
      </button>

      {showKeyFallback && (
        <form action={keyAction} className="mt-4 space-y-3 border-t border-gold/20 pt-4">
          <p className="text-xs text-navy/60">{t("admin.reset.hint")}</p>
          <label className="block text-sm font-medium text-navy">
            {t("admin.reset.recoveryKey")}
            <input
              type="password"
              name="recoveryKey"
              required
              className="mt-1 w-full min-h-11 rounded-xl border border-gold/30 bg-white p-2 outline-none focus:border-gold"
            />
          </label>
          <label className="block text-sm font-medium text-navy">
            {t("admin.reset.newPassword")}
            <input
              type="password"
              name="newPassword"
              required
              minLength={8}
              className="mt-1 w-full min-h-11 rounded-xl border border-gold/30 bg-white p-2 outline-none focus:border-gold"
            />
          </label>

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full rounded-full border border-gold py-3 text-sm font-semibold uppercase tracking-wide text-terracotta"
          >
            {t("admin.reset.submit")}
          </button>
        </form>
      )}
    </>
  );
}

/** Step 2: reached via the emailed link — just set a new password. */
function TokenStep({ token, action, errorMessage }: { token: string; action: (formData: FormData) => void; errorMessage: string | null }) {
  const { t } = useLocale();

  return (
    <form action={action} className="space-y-3">
      <p className="mb-2 text-xs text-navy/60">{t("admin.reset.tokenHint")}</p>
      <input type="hidden" name="token" value={token} />
      <label className="block text-sm font-medium text-navy">
        {t("admin.reset.newPassword")}
        <input
          type="password"
          name="newPassword"
          required
          minLength={8}
          autoFocus
          className="mt-1 w-full min-h-11 rounded-xl border border-gold/30 bg-white p-2 outline-none focus:border-gold"
        />
      </label>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <motion.button
        whileHover={{ scale: 1.02, filter: "brightness(1.06)" }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full rounded-full bg-gold-gradient py-3 text-sm font-semibold uppercase tracking-wide text-navy"
      >
        {t("admin.reset.submit")}
      </motion.button>
    </form>
  );
}
