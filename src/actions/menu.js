"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/supabase/admin";
import { deleteCloudinaryImage } from "@/lib/cloudinary/config";
import { menuCategorySchema, menuItemSchema, slugify } from "@/lib/utils/validation";
import { isValidUuid, PERMISSIONS } from "@/lib/security/permissions";
import { logAuditEvent } from "@/lib/security/audit";

export async function saveMenuItem(payload) {
  const admin = await requirePermission(PERMISSIONS.MANAGE_MENU);

  const parsed = menuItemSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid menu item data." };
  }

  const data = parsed.data;
  const supabase = await createClient();
  const record = {
    category_id: data.category_id,
    name: data.name,
    slug: slugify(data.name) + (data.id ? "" : `-${Date.now().toString().slice(-4)}`),
    description: data.description || null,
    price_lkr: data.price_lkr,
    image_url: data.image_url || null,
    image_public_id: data.image_public_id || null,
    tag: data.tag || null,
    is_available: data.is_available,
    is_featured: data.is_featured,
    display_order: data.display_order,
  };

  let error;
  let resourceId = data.id || null;
  if (data.id) {
    delete record.slug;
    ({ error } = await supabase.from("menu_items").update(record).eq("id", data.id));
  } else {
    const res = await supabase.from("menu_items").insert(record).select("id").single();
    error = res.error;
    resourceId = res.data?.id || null;
  }

  if (error) return { ok: false, error: "Could not save menu item." };

  await logAuditEvent({
    actorId: admin.user.id,
    action: data.id ? "menu_item.updated" : "menu_item.created",
    resourceType: "menu_item",
    resourceId,
    metadata: { name: data.name, price_lkr: data.price_lkr },
  });

  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function toggleMenuItemField(id, field, value) {
  const admin = await requirePermission(PERMISSIONS.MANAGE_MENU);
  if (!isValidUuid(id) || !["is_available", "is_featured"].includes(field)) {
    return { ok: false, error: "Invalid request parameters." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("menu_items")
    .update({ [field]: Boolean(value) })
    .eq("id", id);

  if (error) return { ok: false, error: "Could not update menu item." };

  await logAuditEvent({
    actorId: admin.user.id,
    action: `menu_item.${field}_toggled`,
    resourceType: "menu_item",
    resourceId: id,
    metadata: { [field]: Boolean(value) },
  });

  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  return { ok: true };
}

export async function deleteMenuItem(id, imagePublicId) {
  const admin = await requirePermission(PERMISSIONS.MANAGE_MENU);
  if (!isValidUuid(id)) {
    return { ok: false, error: "Invalid menu item ID." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (error) return { ok: false, error: "Could not delete menu item." };
  if (imagePublicId) {
    await deleteCloudinaryImage(imagePublicId).catch(() => {});
  }

  await logAuditEvent({
    actorId: admin.user.id,
    action: "menu_item.deleted",
    resourceType: "menu_item",
    resourceId: id,
  });

  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function saveMenuCategory(payload) {
  const admin = await requirePermission(PERMISSIONS.MANAGE_MENU);
  const parsed = menuCategorySchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid category data." };
  }

  const data = parsed.data;
  const supabase = await createClient();
  const record = {
    name: data.name,
    slug: slugify(data.name),
    description: data.description || null,
    display_order: data.display_order,
    is_active: data.is_active,
  };

  const { error } = data.id
    ? await supabase.from("menu_categories").update(record).eq("id", data.id)
    : await supabase.from("menu_categories").insert(record);

  if (error) return { ok: false, error: "Could not save menu category." };

  await logAuditEvent({
    actorId: admin.user.id,
    action: data.id ? "menu_category.updated" : "menu_category.created",
    resourceType: "menu_category",
    resourceId: data.id || record.slug,
    metadata: { name: data.name },
  });

  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  return { ok: true };
}

export async function deleteMenuCategory(id) {
  const admin = await requirePermission(PERMISSIONS.MANAGE_MENU);
  if (!isValidUuid(id)) {
    return { ok: false, error: "Invalid category ID." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("menu_categories").delete().eq("id", id);
  if (error) return { ok: false, error: "Could not delete menu category." };

  await logAuditEvent({
    actorId: admin.user.id,
    action: "menu_category.deleted",
    resourceType: "menu_category",
    resourceId: id,
  });

  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  return { ok: true };
}
