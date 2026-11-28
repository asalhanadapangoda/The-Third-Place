"use server";

import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/supabase/admin";
import { enquirySchema } from "@/lib/utils/validation";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { isValidUuid, PERMISSIONS } from "@/lib/security/permissions";
import { logAuditEvent } from "@/lib/security/audit";

export async function submitEnquiry(payload) {
  const ip = await getClientIp();
  const rate = checkRateLimit(`enquiry:${ip}`, {
    limit: 5,
    windowMs: 10 * 60_000,
  });

  if (!rate.allowed) {
    return {
      ok: false,
      error: "Too many enquiries submitted recently. Please wait a few minutes or message us on WhatsApp.",
    };
  }

  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Please check your details and try again.",
    };
  }

  // Honeypot spam trap
  if (parsed.data.website) {
    return { ok: true, message: "Thank you for reaching out." };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error:
        "Enquiry submission is not connected to Supabase yet. Please contact us directly at 077 220 1989 or via WhatsApp.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("enquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      topic: parsed.data.topic,
      message: parsed.data.message,
      event_date: parsed.data.event_date || null,
      guest_count: parsed.data.guest_count || null,
      status: "new",
    });

    if (error) {
      return {
        ok: false,
        error: "Could not submit your enquiry right now. Please try again.",
      };
    }

    revalidatePath("/admin/messages");
    revalidatePath("/admin/dashboard");
    return {
      ok: true,
      message: "Thank you! Your message has been received by The Third Place team.",
    };
  } catch {
    return {
      ok: false,
      error:
        "An unexpected error occurred. Please reach out on WhatsApp or call 077 220 1989.",
    };
  }
}

export async function updateEnquiryStatus(id, status) {
  const admin = await requirePermission(PERMISSIONS.MANAGE_ENQUIRIES);
  if (!isValidUuid(id) || !["new", "in_progress", "resolved"].includes(status)) {
    return { ok: false, error: "Invalid request parameters." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("enquiries")
    .update({ status })
    .eq("id", id);

  if (error) return { ok: false, error: "Could not update enquiry status." };

  await logAuditEvent({
    actorId: admin.user.id,
    action: "enquiry.status_updated",
    resourceType: "enquiry",
    resourceId: id,
    metadata: { status },
  });

  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function deleteEnquiry(id) {
  const admin = await requirePermission(PERMISSIONS.MANAGE_ENQUIRIES);
  if (!isValidUuid(id)) {
    return { ok: false, error: "Invalid enquiry ID." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").delete().eq("id", id);

  if (error) return { ok: false, error: "Could not delete enquiry." };

  await logAuditEvent({
    actorId: admin.user.id,
    action: "enquiry.deleted",
    resourceType: "enquiry",
    resourceId: id,
  });

  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}
