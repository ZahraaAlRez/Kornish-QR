import "server-only";

/**
 * Minimal email sender using Resend's HTTP API directly (no SDK dependency
 * needed — it's a single POST). Follows the same pattern as the WhatsApp /
 * cafe-system webhook integrations elsewhere in this app: fully wired up,
 * but gracefully "not configured yet" when no API key is present, rather
 * than pretending to send something it can't.
 */
export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "Sultana Restocafe <onboarding@resend.dev>";

  if (!apiKey) {
    console.log(`[email] RESEND_API_KEY not configured — would have sent a reset link to ${to}: ${resetUrl}`);
    return { sent: false, reason: "not_configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: "Reset your Sultana Restocafe admin password",
        html: `
          <p>A password reset was requested for the Sultana Restocafe admin dashboard.</p>
          <p><a href="${resetUrl}">Click here to set a new password</a> (expires in 1 hour).</p>
          <p>If you didn't request this, you can ignore this email.</p>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[email] Resend request failed: ${res.status} ${body}`);
      return { sent: false, reason: "send_failed" };
    }

    return { sent: true };
  } catch (err) {
    console.error("[email] Failed to send password reset email:", err);
    return { sent: false, reason: "send_failed" };
  }
}
