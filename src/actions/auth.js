"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/utils/validation";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { logAuditEvent } from "@/lib/security/audit";
import { sanitizeRedirectPath } from "@/lib/security/permissions";

export async function loginAdmin(formData) {
  if (!isSupabaseConfigured()) {
    return {
      error: "Authentication service is not configured yet.",
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.email,
    password: formData.password,
  });

  if (!parsed.success) {
    return { error: "Invalid email or password." };
  }

  const ip = await getClientIp();
  const rate = checkRateLimit(
    `login:${ip}:${parsed.data.email.toLowerCase()}`,
    { limit: 5, windowMs: 15 * 60_000 }
  );

  if (!rate.allowed) {
    await logAuditEvent({
      action: "auth.login_rate_limited",
      resourceType: "auth",
      metadata: { ip },
    });
    return {
      error: `Too many login attempts. Please try again in ${Math.ceil(
        rate.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    await logAuditEvent({
      action: "auth.login_failed",
      resourceType: "auth",
      metadata: { ip },
    });
    return { error: "Invalid email or password." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (!profile || !["admin", "editor"].includes(profile.role)) {
    await supabase.auth.signOut();
    await logAuditEvent({
      actorId: data.user.id,
      action: "auth.login_unauthorized_role",
      resourceType: "auth",
      metadata: { ip },
    });
    return { error: "Invalid email or password." };
  }

  await logAuditEvent({
    actorId: data.user.id,
    action: "auth.login_success",
    resourceType: "auth",
    metadata: { role: profile.role },
  });

  revalidatePath("/admin");
  redirect(sanitizeRedirectPath(formData.next || "/admin/dashboard"));
}

export async function requestPasswordReset(email) {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Authentication service is not configured." };
  }

  const trimmed = String(email || "").trim();
  if (!trimmed || !trimmed.includes("@")) {
    return { ok: false, message: "Enter a valid email address." };
  }

  const ip = await getClientIp();
  const rate = checkRateLimit(`reset:${ip}`, { limit: 3, windowMs: 15 * 60_000 });
  if (!rate.allowed) {
    return {
      ok: false,
      message: "Too many reset requests. Please try again later.",
    };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  await supabase.auth.resetPasswordForEmail(trimmed, {
    redirectTo: `${siteUrl}/admin/login`,
  });

  await logAuditEvent({
    action: "auth.password_reset_requested",
    resourceType: "auth",
    metadata: { ip },
  });

  // Always return a generic message to prevent account enumeration
  return {
    ok: true,
    message:
      "If an administrator account matches that email, a password recovery link has been sent.",
  };
}

export async function logoutAdmin() {
  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await logAuditEvent({
        actorId: user.id,
        action: "auth.logout",
        resourceType: "auth",
      });
    }
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
