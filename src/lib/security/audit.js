import { createServiceRoleClient } from "@/lib/supabase/admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

const SENSITIVE_KEY_PATTERN =
  /(password|secret|token|authorization|cookie|key|credit|ssn)/i;

function sanitizeMetadata(meta = {}) {
  if (!meta || typeof meta !== "object") return {};
  const clean = {};
  for (const [k, v] of Object.entries(meta)) {
    if (SENSITIVE_KEY_PATTERN.test(k)) continue;
    clean[k] = typeof v === "string" ? v.slice(0, 240) : v;
  }
  return clean;
}

/**
 * Appends an immutable record to public.audit_logs.
 * Never throws or blocks primary business flow if logging fails,
 * and never logs secrets, passwords, or tokens.
 */
export async function logAuditEvent({
  actorId = null,
  action,
  resourceType,
  resourceId = null,
  metadata = {},
}) {
  if (!isSupabaseConfigured() || !action || !resourceType) return;

  try {
    const client = createServiceRoleClient() || (await createClient());
    if (!client) return;

    await client.from("audit_logs").insert({
      actor_id: actorId,
      action: String(action).slice(0, 120),
      resource_type: String(resourceType).slice(0, 80),
      resource_id: resourceId ? String(resourceId).slice(0, 120) : null,
      metadata: sanitizeMetadata(metadata),
    });
  } catch {
    // Fail safely without leaking internals or breaking user-facing operations
  }
}
