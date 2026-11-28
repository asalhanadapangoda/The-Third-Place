"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/supabase/admin";
import { deleteCloudinaryImage } from "@/lib/cloudinary/config";
import { gallerySchema } from "@/lib/utils/validation";
import { isValidUuid, PERMISSIONS } from "@/lib/security/permissions";
import { logAuditEvent } from "@/lib/security/audit";

export async function saveGalleryImage(payload) {
  const admin = await requirePermission(PERMISSIONS.MANAGE_GALLERY);
  const parsed = gallerySchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid gallery item." };
  }

  const data = parsed.data;
  const supabase = await createClient();
  const record = {
    title: data.title,
    alt_text: data.alt_text,
    category: data.category,
    image_url: data.image_url,
    image_public_id: data.image_public_id || null,
    display_order: data.display_order,
    is_published: data.is_published,
  };

  const { error } = data.id
    ? await supabase.from("gallery").update(record).eq("id", data.id)
    : await supabase.from("gallery").insert(record);

  if (error) return { ok: false, error: "Could not save gallery photograph." };

  await logAuditEvent({
    actorId: admin.user.id,
    action: data.id ? "gallery.updated" : "gallery.created",
    resourceType: "gallery",
    resourceId: data.id || data.image_public_id || data.title,
    metadata: { category: data.category },
  });

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function toggleGalleryPublished(id, isPublished) {
  const admin = await requirePermission(PERMISSIONS.MANAGE_GALLERY);
  if (!isValidUuid(id)) {
    return { ok: false, error: "Invalid gallery image ID." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery")
    .update({ is_published: Boolean(isPublished) })
    .eq("id", id);

  if (error) return { ok: false, error: "Could not update image visibility." };

  await logAuditEvent({
    actorId: admin.user.id,
    action: isPublished ? "gallery.published" : "gallery.unpublished",
    resourceType: "gallery",
    resourceId: id,
  });

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { ok: true };
}

export async function deleteGalleryImage(id, imagePublicId) {
  const admin = await requirePermission(PERMISSIONS.MANAGE_GALLERY);
  if (!isValidUuid(id)) {
    return { ok: false, error: "Invalid gallery image ID." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("gallery").delete().eq("id", id);

  if (error) return { ok: false, error: "Could not delete gallery photograph." };
  if (imagePublicId) {
    await deleteCloudinaryImage(imagePublicId).catch(() => {});
  }

  await logAuditEvent({
    actorId: admin.user.id,
    action: "gallery.deleted",
    resourceType: "gallery",
    resourceId: id,
  });

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}
