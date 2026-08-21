"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, checkAdminPassword, createSessionToken } from "@/lib/auth";
import { verifyPasswordHash } from "@/lib/passwordHash";
import { createServiceClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  const supabase = createServiceClient();
  const { data: settings } = await supabase
    .from("cafe_settings")
    .select("admin_password_hash")
    .eq("id", 1)
    .maybeSingle();

  // Once a real password has been set from Settings, the hash is
  // authoritative. Until then, fall back to ADMIN_PASSWORD from env — keeps
  // fresh installs working without forcing a password change first.
  const isValid = settings?.admin_password_hash
    ? await verifyPasswordHash(password, settings.admin_password_hash)
    : checkAdminPassword(password);

  if (!isValid) {
    redirect("/admin/login?error=1");
  }

  const token = await createSessionToken();
  cookies().set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin/orders");
}

export async function logout() {
  cookies().delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
