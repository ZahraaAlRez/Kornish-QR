// Uses the global Web Crypto API (not Node's `crypto` module) so this file
// works both in server actions (Node runtime) and in middleware.ts (Edge
// runtime) — Node's createHmac/timingSafeEqual aren't available on Edge.

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET. Set it in .env.local (any long random string).");
  }
  return secret;
}

async function getHmacKey(): Promise<CryptoKey> {
  const keyData = new TextEncoder().encode(getSecret());
  return crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/** Single shared admin password (per spec §8/§4 decision), no per-user accounts. */
export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("Missing ADMIN_PASSWORD. Set it in .env.local.");
  }
  // Lengths are only ever compared for small, non-secret-derived strings here;
  // constant-time equality isn't critical for a single shared cafe password,
  // but we still avoid short-circuiting on the first differing character.
  if (password.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function createSessionToken(): Promise<string> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return `${payload}.${toHex(signature)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, signatureHex] = token.split(".");
  if (!payload || !signatureHex) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() >= expiresAt) return false;

  const key = await getHmacKey();
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    fromHex(signatureHex) as BufferSource,
    new TextEncoder().encode(payload)
  );
  return valid;
}
