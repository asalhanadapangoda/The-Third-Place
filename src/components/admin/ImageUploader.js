"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2, X } from "lucide-react";

export default function ImageUploader({
  folder = "gallery",
  value = "",
  onUpload,
  onClear,
  label = "Upload Image (Cloudinary)",
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed.");
      }
      onUpload?.({ url: data.url, publicId: data.publicId });
    } catch (err) {
      setError(err.message || "Could not upload image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-2.5">
      <label className="block font-sans text-xs font-medium uppercase tracking-[0.14em] text-brown/80">
        {label}
      </label>

      {value ? (
        <div className="relative aspect-[16/9] w-full max-w-sm overflow-hidden rounded-xl border border-brown/15 bg-cream">
          <Image src={value} alt="Uploaded preview" fill className="object-cover" />
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Remove image"
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-brown/85 text-cream hover:bg-terracotta cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 rounded-full border border-brown/25 bg-cream px-4 py-2 font-sans text-xs font-medium text-brown hover:border-primary hover:text-primary transition-colors cursor-pointer">
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          {uploading ? "Uploading..." : value ? "Replace Image" : "Choose Image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <span className="font-sans text-[11px] text-brown/60">
          Folder: <code>the-third-place/{folder}</code> · Max 5MB (JPG, PNG, WebP, AVIF)
        </span>
      </div>

      {error && <p className="font-sans text-xs text-terracotta">{error}</p>}
    </div>
  );
}
