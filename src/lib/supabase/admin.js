import { redirect } from "next/navigation";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { hasPermission } from "@/lib/security/permissions";

export { hasPermission };

/**
 * Server-only service role client. Never import this in client components.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createSupabaseJsClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Verifies an authenticated Supabase user on the server using auth.getUser()
 * (never trusts unverified client-side session claims).
 */
export async function requireAuthenticatedUser({ redirectOnFail = true } = {}) {
  if (!isSupabaseConfigured()) {
    if (redirectOnFail) redirect("/admin/login");
    throw new Error("Authentication service is not configured.");
  }

  const supabase = await createClient();
  if (!supabase) {
    if (redirectOnFail) redirect("/admin/login");
    throw new Error("Authentication client unavailable.");
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    if (redirectOnFail) redirect("/admin/login");
    throw new Error("Authentication required.");
  }

  return { user, supabase };
}

/**
 * Returns the verified admin user & database profile, or null if unauthorized.
 */
export async function getCurrentAdmin() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "editor"].includes(profile.role)) {
    return null;
  }

  return { user, profile };
}

/**
 * Enforces server-side administrator authorization.
 */
export async function requireAdmin({ redirectOnFail = true } = {}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    if (redirectOnFail) {
      redirect("/admin/login");
    }
    throw new Error("Unauthorized: Administrator access required.");
  }

  return admin;
}

/**
 * Enforces granular role-based permission on the server.
 */
export async function requirePermission(
  permission,
  { redirectOnFail = false } = {}
) {
  const admin = await requireAdmin({ redirectOnFail });
  if (!hasPermission(admin.profile.role, permission)) {
    if (redirectOnFail) {
      redirect("/admin/dashboard");
    }
    throw new Error("Forbidden: Insufficient permissions for this operation.");
  }
  return admin;
}
