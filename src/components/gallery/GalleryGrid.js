"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import { getOptimizedImageUrl } from "@/lib/cloudinary/url";

const CATEGORIES = [
  "All",
  "Coffee",
  "Food",
  "Interior",
  "Community",
  "Events",
  "Lifestyle",
];

const PAGE_SIZE = 9;

export default function GalleryGrid({ images = [] }) {
  const [category, setCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState(null);

  const filtered =
    category === "All"
      ? images
      : images.filter((img) => img.category === category);

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  function handleCategoryChange(cat) {
    setCategory(cat);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat)}
            className={`rounded-full px-4 py-2 font-sans text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              category === cat
                ? "bg-primary text-cream"
                : "bg-surface text-brown/80 border border-brown/15 hover:border-primary/40 hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="rounded-3xl bg-surface border border-brown/12 p-12 text-center">
          <p className="font-display text-3xl text-brown">
            No photographs in this category yet.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setLightbox(img)}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-brown/12 bg-surface text-left cursor-pointer"
              >
                <Image
                  src={getOptimizedImageUrl(img.image_url, {
                    width: 800,
                    height: 600,
                  })}
                  alt={img.alt_text || img.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brown/80 via-brown/25 to-transparent p-5 text-cream opacity-95 group-hover:opacity-100 transition-opacity">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-cream/80">
                    {img.category}
                  </span>
                  <p className="font-display text-2xl font-semibold leading-tight">
                    {img.title}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              >
                Load More Photographs
              </Button>
            </div>
          )}
        </>
      )}

      {/* Accessible Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-brown/90 p-4 sm:p-8 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-cream border border-brown/20 shadow-2xl"
          >
            <button
              type="button"
              aria-label="Close photograph"
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-cream/90 text-brown hover:bg-primary hover:text-cream transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative aspect-[16/10] w-full bg-brown/10">
              <Image
                src={getOptimizedImageUrl(lightbox.image_url, { width: 1600 })}
                alt={lightbox.alt_text || lightbox.title}
                fill
                sizes="90vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 flex items-center justify-between gap-4">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.18em] text-terracotta">
                  {lightbox.category}
                </p>
                <p className="font-display text-2xl font-semibold text-brown mt-0.5">
                  {lightbox.title}
                </p>
              </div>
              <p className="font-sans text-xs text-brown/65 hidden sm:block">
                {lightbox.alt_text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
