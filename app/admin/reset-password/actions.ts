"use server";

import { redirect } from "next/navigation";
import { hashPassword } from "@/lib/passwordHash";
import { sendPasswordResetEmail } from "@/lib/email";
import { createServiceClient } from "@/lib/supabase/server";

const TOKEN_TTL_MS = 1000 * 60 * 60; // 1 hour

/**
 * Primary forgot-password path: emails a single-use, expiring link to the
 * recovery address on file in Settings. No email/username is typed in —
 * there's only ever one recovery address, so this just confirms and sends.
 */
export async function requestPasswordReset(): Promise<
  { ok: true; sent: boolean; maskedEmail: string } | { ok: false; error: string }
> {
  const supabase = createServiceClient();
  const { data: settings } = await supabase.from("cafe_settings").select("admin_recovery_email").eq("id", 1).maybeSingle();

  const email = settings?.admin_recovery_email;
  if (!email) {
    return { ok: false, error: "no_recovery_email" };
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

  const { error } = await supabase
    .from("cafe_settings")
    .update({ admin_reset_token: token, admin_reset_token_expires_at: expiresAt })
    .eq("id", 1);
  if (error) return { ok: false, error: "server_error" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const resetUrl = `${siteUrl.replace(/\/$/, "")}/admin/reset-password?token=${token}`;

  const result = await sendPasswordResetEmail(email, resetUrl);

  const [local, domain] = email.split("@");
  const maskedEmail = domain ? `${local.slice(0, 2)}${"*".repeat(Math.max(local.length - 2, 1))}@${domain}` : email;

  return { ok: true, sent: result.sent, maskedEmail };
}

/** Completes the email-link flow: verifies the token + expiry, then sets the new password. */
export async function resetPasswordWithToken(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  if (!token) redirect("/admin/reset-password?error=1");
  if (newPassword.length < 8) redirect(`/admin/reset-password?token=${token}&error=2`);

  const supabase = createServiceClient();
  const { data: settings } = await supabase
    .from("cafe_settings")
    .select("admin_reset_token, admin_reset_token_expires_at")
    .eq("id", 1)
    .maybeSingle();

  const validToken =
    settings?.admin_reset_token &&
    settings.admin_reset_token === token &&
    settings.admin_reset_token_expires_at &&
    new Date(settings.admin_reset_token_expires_at).getTime() > Date.now();

  if (!validToken) {
    redirect("/admin/reset-password?error=4");
  }

  const hash = await hashPassword(newPassword);
  const { error } = await supabase
    .from("cafe_settings")
    .update({ admin_password_hash: hash, admin_reset_token: null, admin_reset_token_expires_at: null })
    .eq("id", 1);

  if (error) redirect(`/admin/reset-password?token=${token}&error=3`);

  redirect("/admin/login?reset=1");
}

/**
 * Manual recovery fallback via env var — whoever manages the server/hosting
 * sets ADMIN_RECOVERY_KEY. Kept alongside the email flow above for when
 * email sending isn't configured yet.
 */
export async function resetPassword(formData: FormData) {
  const recoveryKey = String(formData.get("recoveryKey") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  const expectedKey = process.env.ADMIN_RECOVERY_KEY;
  if (!expectedKey || recoveryKey !== expectedKey) {
    redirect("/admin/reset-password?error=1");
  }
  if (newPassword.length < 8) {
    redirect("/admin/reset-password?error=2");
  }

  const hash = await hashPassword(newPassword);
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("cafe_settings")
    .update({ admin_password_hash: hash })
    .eq("id", 1);

  if (error) {
    redirect("/admin/reset-password?error=3");
  }

  redirect("/admin/login?reset=1");
}
