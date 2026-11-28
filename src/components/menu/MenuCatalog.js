"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { formatLKR } from "@/lib/utils/validation";
import { getOptimizedImageUrl } from "@/lib/cloudinary/url";

export default function MenuCatalog({ categories = [], items = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" ||
        item.category_id === selectedCategory ||
        item.category_slug === selectedCategory;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q) ||
        (item.category_name || "").toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [items, selectedCategory, query]);

  return (
    <div className="space-y-10">
      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label="Menu Categories"
          className="flex flex-wrap gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-4 py-2 font-sans text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              selectedCategory === "all"
                ? "bg-primary text-cream"
                : "bg-surface text-brown/80 border border-brown/15 hover:border-primary/40 hover:text-primary"
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-4 py-2 font-sans text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  active
                    ? "bg-primary text-cream"
                    : "bg-surface text-brown/80 border border-brown/15 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brown/45" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search coffee, tea, bakes..."
            aria-label="Search menu items"
            className="w-full rounded-full border border-brown/20 bg-surface pl-10 pr-4 py-2.5 font-sans text-sm text-brown placeholder:text-brown/45 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Results Grid */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl bg-surface border border-brown/12 p-12 text-center">
          <p className="font-display text-3xl text-brown">No menu items found</p>
          <p className="font-sans text-sm text-brown/70 mt-2">
            Try choosing another category or clearing your search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group rounded-2xl bg-surface border border-brown/12 overflow-hidden flex flex-col hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-soft)] transition-all duration-200"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-strong">
                {item.image_url && (
                  <Image
                    src={getOptimizedImageUrl(item.image_url, {
                      width: 720,
                      height: 540,
                    })}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
                  {item.tag && (
                    <span className="rounded-full bg-cream/95 px-3 py-1 font-sans text-[11px] font-medium text-terracotta">
                      {item.tag}
                    </span>
                  )}
                  {item.is_featured && (
                    <span className="rounded-full bg-primary/95 px-3 py-1 font-sans text-[11px] font-medium text-cream">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-2xl font-semibold text-brown leading-snug">
                      {item.name}
                    </h2>
                    <span className="font-sans text-sm font-semibold text-primary shrink-0 pt-1">
                      {formatLKR(item.price_lkr)}
                    </span>
                  </div>
                  <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-terracotta mt-1">
                    {item.category_name}
                  </p>
                  {item.description && (
                    <p className="font-sans text-sm leading-relaxed text-brown/75 mt-3">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
