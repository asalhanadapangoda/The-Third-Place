"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/supabase/admin";
import { deleteCloudinaryImage } from "@/lib/cloudinary/config";
import { eventSchema, slugify } from "@/lib/utils/validation";
import { isValidUuid, PERMISSIONS } from "@/lib/security/permissions";
import { logAuditEvent } from "@/lib/security/audit";

export async function saveEvent(payload) {
  const admin = await requirePermission(PERMISSIONS.MANAGE_EVENTS);
  const parsed = eventSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid event data." };
  }

  const data = parsed.data;
  const supabase = await createClient();
  const record = {
    title: data.title,
    slug: slugify(data.title) + (data.id ? "" : `-${Date.now().toString().slice(-4)}`),
    summary: data.summary || null,
    description: data.description,
    category: data.category,
    event_date: data.event_date,
    end_date: data.end_date || null,
    start_time: data.start_time,
    end_time: data.end_time || null,
    location: data.location,
    poster_url: data.poster_url || null,
    poster_public_id: data.poster_public_id || null,
    registration_url: data.registration_url || null,
    capacity_label: data.capacity_label || null,
    status: data.status,
    is_published:
      data.status === "published" || data.status === "completed"
        ? true
        : data.is_published && data.status !== "draft",
    is_featured: data.is_featured,
  };

  let error;
  let resourceId = data.id || null;
  if (data.id) {
    delete record.slug;
    ({ error } = await supabase.from("events").update(record).eq("id", data.id));
  } else {
    const res = await supabase.from("events").insert(record).select("id").single();
    error = res.error;
    resourceId = res.data?.id || null;
  }

  if (error) return { ok: false, error: "Could not save event." };

  await logAuditEvent({
    actorId: admin.user.id,
    action: data.id ? "event.updated" : "event.created",
    resourceType: "event",
    resourceId,
    metadata: { title: data.title, status: data.status },
  });

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function toggleEventPublished(id, isPublished) {
  const admin = await requirePermission(PERMISSIONS.MANAGE_EVENTS);
  if (!isValidUuid(id)) {
    return { ok: false, error: "Invalid event ID." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("events")
    .update({
      is_published: Boolean(isPublished),
      status: isPublished ? "published" : "draft",
    })
    .eq("id", id);

  if (error) return { ok: false, error: "Could not update event visibility." };

  await logAuditEvent({
    actorId: admin.user.id,
    action: isPublished ? "event.published" : "event.unpublished",
    resourceType: "event",
    resourceId: id,
  });

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function toggleEventFeatured(id, isFeatured) {
  const admin = await requirePermission(PERMISSIONS.MANAGE_EVENTS);
  if (!isValidUuid(id)) {
    return { ok: false, error: "Invalid event ID." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("events")
    .update({ is_featured: Boolean(isFeatured) })
    .eq("id", id);

  if (error) return { ok: false, error: "Could not update event featured state." };

  await logAuditEvent({
    actorId: admin.user.id,
    action: "event.featured_toggled",
    resourceType: "event",
    resourceId: id,
    metadata: { is_featured: Boolean(isFeatured) },
  });

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/admin/content");
  return { ok: true };
}

export async function deleteEvent(id, posterPublicId) {
  const admin = await requirePermission(PERMISSIONS.MANAGE_EVENTS);
  if (!isValidUuid(id)) {
    return { ok: false, error: "Invalid event ID." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) return { ok: false, error: "Could not delete event." };
  if (posterPublicId) {
    await deleteCloudinaryImage(posterPublicId).catch(() => {});
  }

  await logAuditEvent({
    actorId: admin.user.id,
    action: "event.deleted",
    resourceType: "event",
    resourceId: id,
  });

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}
