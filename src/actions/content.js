"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/supabase/admin";
import { pageContentSchema, siteSettingsSchema } from "@/lib/utils/validation";
import { PERMISSIONS } from "@/lib/security/permissions";
import { logAuditEvent } from "@/lib/security/audit";

export async function savePageContent(payload) {
  const admin = await requirePermission(PERMISSIONS.MANAGE_CONTENT);
  const parsed = pageContentSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid page content." };
  }

  const data = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("pages").upsert(
    {
      slug: data.slug,
      title: data.title,
      subtitle: data.subtitle || null,
      body: data.body || null,
      hero_image_url: data.hero_image_url || null,
      hero_image_public_id: data.hero_image_public_id || null,
      content: data.promo_banner ? { promoBanner: data.promo_banner } : {},
      is_published: true,
    },
    { onConflict: "slug" }
  );

  if (error) return { ok: false, error: "Could not save page content." };

  await logAuditEvent({
    actorId: admin.user.id,
    action: "page.updated",
    resourceType: "page",
    resourceId: data.slug,
  });

  revalidatePath("/");
  revalidatePath("/story");
  revalidatePath("/space");
  revalidatePath("/admin/content");
  return { ok: true };
}

export async function saveSiteSettings(payload) {
  const admin = await requirePermission(PERMISSIONS.MANAGE_SETTINGS);
  const parsed = siteSettingsSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid settings." };
  }

  const data = parsed.data;
  let openingHours = [];

  if (data.opening_hours_json) {
    try {
      const parsedHours = JSON.parse(data.opening_hours_json);
      if (Array.isArray(parsedHours)) openingHours = parsedHours;
    } catch {
      return { ok: false, error: "Opening hours must be a valid JSON array." };
    }
  }

  const socialLinks = {};
  if (data.instagram_url) socialLinks.instagram = data.instagram_url;
  if (data.facebook_url) socialLinks.facebook = data.facebook_url;
  if (data.tiktok_url) socialLinks.tiktok = data.tiktok_url;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .single();

  const record = {
    site_name: data.site_name,
    tagline: data.tagline,
    phone: data.phone,
    whatsapp_number: data.whatsapp_number,
    email: data.email || null,
    address: data.address,
    google_maps_embed_url: data.google_maps_embed_url || null,
    opening_hours: openingHours,
    social_links: socialLinks,
    seo_title: data.seo_title || null,
    seo_description: data.seo_description || null,
  };

  const { error } = existing?.id
    ? await supabase.from("site_settings").update(record).eq("id", existing.id)
    : await supabase.from("site_settings").insert(record);

  if (error) return { ok: false, error: "Could not save website settings." };

  await logAuditEvent({
    actorId: admin.user.id,
    action: "settings.updated",
    resourceType: "site_settings",
    resourceId: existing?.id || "singleton",
  });

  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
  return { ok: true };
}
