"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Edit2, Eye, EyeOff, Upload, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  deleteGalleryImage,
  saveGalleryImage,
  toggleGalleryPublished,
} from "@/actions/gallery";

const CATEGORIES = ["Coffee", "Food", "Interior", "Community", "Events", "Lifestyle"];

const EMPTY = {
  id: "",
  title: "",
  alt_text: "",
  category: "Coffee",
  image_url: "",
  image_public_id: "",
  display_order: 0,
  is_published: true,
};

export default function GalleryManager({ images = [] }) {
  const [form, setForm] = useState(EMPTY);
  const [bulkCategory, setBulkCategory] = useState("Coffee");
  const [bulkUploading, setBulkUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatusMsg("");
    const res = await saveGalleryImage(form);
    setSaving(false);
    if (res.ok) {
      setStatusMsg(form.id ? "Photograph updated." : "Photograph added to gallery.");
      setForm(EMPTY);
    } else {
      setStatusMsg(res.error || "Could not save gallery image.");
    }
  }

  async function handleBulkUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBulkUploading(true);
    setStatusMsg("");

    let uploadedCount = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "gallery");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (res.ok && data.url) {
          const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
          await saveGalleryImage({
            title: cleanName || `${bulkCategory} Photo ${i + 1}`,
            alt_text: `${cleanName || bulkCategory} at The Third Place Colombo`,
            category: bulkCategory,
            image_url: data.url,
            image_public_id: data.publicId || "",
            display_order: images.length + i + 1,
            is_published: true,
          });
          uploadedCount++;
        }
      } catch {
        // continue remaining files
      }
    }

    setBulkUploading(false);
    e.target.value = "";
    setStatusMsg(`Uploaded ${uploadedCount} of ${files.length} photographs to Cloudinary.`);
  }

  return (
    <div className="space-y-10">
      {statusMsg && (
        <div className="rounded-xl bg-primary/10 border border-primary/25 px-4 py-3 font-sans text-sm text-primary">
          {statusMsg}
        </div>
      )}

      {/* Multi-Photograph Bulk Upload */}
      <div className="rounded-2xl bg-surface border border-brown/12 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-brown">
            Bulk Upload Multiple Photographs
          </h2>
          <p className="font-sans text-xs text-brown/70 mt-1">
            Select multiple photos at once to upload directly to Cloudinary and publish into the chosen category.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Bulk upload category"
            value={bulkCategory}
            onChange={(e) => setBulkCategory(e.target.value)}
            className="rounded-full border border-brown/20 bg-cream px-4 py-2 text-xs font-medium text-brown"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-sans text-xs font-medium text-cream hover:bg-primary-hover transition-colors cursor-pointer">
            {bulkUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {bulkUploading ? "Uploading..." : "Select Multiple Photos"}
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleBulkUpload}
              disabled={bulkUploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Single Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-surface border border-brown/12 p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-brown">
            {form.id ? "Edit Gallery Photograph" : "Add Single Photograph"}
          </h2>
          {form.id && (
            <button
              type="button"
              onClick={() => setForm(EMPTY)}
              className="font-sans text-xs text-terracotta underline cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
              Title *
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
              Alt Text (SEO &amp; Accessibility) *
            </label>
            <input
              required
              value={form.alt_text}
              onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
              className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
              Category *
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
              Display Order
            </label>
            <input
              type="number"
              value={form.display_order}
              onChange={(e) =>
                setForm({ ...form, display_order: e.target.value })
              }
              className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
          />
          Published on Public Gallery
        </label>

        <ImageUploader
          folder="gallery"
          value={form.image_url}
          onUpload={({ url, publicId }) =>
            setForm({ ...form, image_url: url, image_public_id: publicId })
          }
          onClear={() => setForm({ ...form, image_url: "", image_public_id: "" })}
        />

        <Button type="submit" variant="primary" disabled={saving || !form.image_url}>
          <Plus className="h-4 w-4" />
          {saving ? "Saving..." : form.id ? "Update Photograph" : "Add Photograph"}
        </Button>
      </form>

      {/* Gallery Items */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img) => (
          <div
            key={img.id}
            className="rounded-2xl bg-surface border border-brown/12 overflow-hidden flex flex-col"
          >
            <div className="relative aspect-[4/3] w-full bg-cream">
              <Image
                src={img.image_url}
                alt={img.alt_text || img.title}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => toggleGalleryPublished(img.id, !img.is_published)}
                className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-3 py-1 font-sans text-[11px] font-medium cursor-pointer ${
                  img.is_published
                    ? "bg-primary text-cream"
                    : "bg-brown/85 text-cream"
                }`}
              >
                {img.is_published ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3" />
                )}
                {img.is_published ? "Published" : "Unpublished"}
              </button>
            </div>
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-sans text-[11px] uppercase tracking-wider text-terracotta">
                  {img.category} · Order {img.display_order}
                </p>
                <p className="font-display text-xl font-semibold text-brown truncate">
                  {img.title}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      id: img.id,
                      title: img.title,
                      alt_text: img.alt_text,
                      category: img.category,
                      image_url: img.image_url,
                      image_public_id: img.image_public_id || "",
                      display_order: img.display_order || 0,
                      is_published: Boolean(img.is_published),
                    })
                  }
                  className="p-1.5 rounded-lg text-primary hover:bg-primary/10 cursor-pointer"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteGalleryImage(img.id, img.image_public_id)}
                  className="p-1.5 rounded-lg text-terracotta hover:bg-terracotta/10 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
