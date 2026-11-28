import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  topic: z.string().trim().min(2).max(80),
  message: z
    .string()
    .trim()
    .min(10, "Please share a few more details (at least 10 characters).")
    .max(2000),
  event_date: z.string().trim().max(40).optional().or(z.literal("")),
  guest_count: z.string().trim().max(40).optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")), // Honeypot spam trap
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid admin email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const menuItemSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  category_id: z.string().uuid("Please select a category."),
  name: z.string().trim().min(2, "Product name is required.").max(140),
  description: z.string().trim().max(600).optional().or(z.literal("")),
  price_lkr: z.coerce.number().int().min(0, "Price must be 0 or greater."),
  image_url: z.string().trim().url().optional().or(z.literal("")),
  image_public_id: z.string().trim().optional().or(z.literal("")),
  tag: z.string().trim().max(40).optional().or(z.literal("")),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  display_order: z.coerce.number().int().default(0),
});

export const menuCategorySchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: z.string().trim().min(2, "Category name is required.").max(80),
  description: z.string().trim().max(240).optional().or(z.literal("")),
  display_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const eventSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(3, "Event title is required.").max(160),
  summary: z.string().trim().max(300).optional().or(z.literal("")),
  description: z.string().trim().min(10, "Please add an event description.").max(4000),
  category: z.string().trim().min(2).max(60).default("Community"),
  event_date: z.string().trim().min(8, "Please select a start date."),
  end_date: z.string().trim().optional().or(z.literal("")),
  start_time: z.string().trim().min(2, "Start time is required.").max(40),
  end_time: z.string().trim().max(40).optional().or(z.literal("")),
  location: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .default("The Third Place, TRACE Expert City, Colombo 10"),
  poster_url: z.string().trim().url().optional().or(z.literal("")),
  poster_public_id: z.string().trim().optional().or(z.literal("")),
  registration_url: z.string().trim().url("Must be a valid URL.").optional().or(z.literal("")),
  capacity_label: z.string().trim().max(60).optional().or(z.literal("")),
  status: z.enum(["draft", "published", "completed", "cancelled"]).default("published"),
  is_published: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

export const gallerySchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Image title is required.").max(140),
  alt_text: z.string().trim().min(4, "Alt text is required for accessibility.").max(240),
  category: z.enum(["Coffee", "Food", "Interior", "Community", "Events", "Lifestyle"]),
  image_url: z.string().trim().url("Valid image URL is required."),
  image_public_id: z.string().trim().optional().or(z.literal("")),
  display_order: z.coerce.number().int().default(0),
  is_published: z.boolean().default(true),
});

export const pageContentSchema = z.object({
  slug: z.enum(["home", "story", "space", "community"]),
  title: z.string().trim().min(2).max(200),
  subtitle: z.string().trim().max(400).optional().or(z.literal("")),
  body: z.string().trim().max(6000).optional().or(z.literal("")),
  promo_banner: z.string().trim().max(180).optional().or(z.literal("")),
  hero_image_url: z.string().trim().url().optional().or(z.literal("")),
  hero_image_public_id: z.string().trim().optional().or(z.literal("")),
});

export const siteSettingsSchema = z.object({
  site_name: z.string().trim().min(2).max(120),
  tagline: z.string().trim().min(2).max(180),
  phone: z.string().trim().min(6).max(40),
  whatsapp_number: z.string().trim().min(6).max(30),
  email: z.string().trim().email().optional().or(z.literal("")),
  address: z.string().trim().min(5).max(240),
  google_maps_embed_url: z.string().trim().url().optional().or(z.literal("")),
  opening_hours_json: z.string().optional(),
  instagram_url: z.string().trim().url().optional().or(z.literal("")),
  facebook_url: z.string().trim().url().optional().or(z.literal("")),
  tiktok_url: z.string().trim().url().optional().or(z.literal("")),
  seo_title: z.string().trim().max(180).optional().or(z.literal("")),
  seo_description: z.string().trim().max(320).optional().or(z.literal("")),
});

export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatLKR(amount) {
  const num = Number(amount || 0);
  return `LKR ${num.toLocaleString("en-LK")}`;
}
