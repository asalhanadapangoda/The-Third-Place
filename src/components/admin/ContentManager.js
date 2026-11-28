"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/admin/ImageUploader";
import { savePageContent } from "@/actions/content";
import { toggleMenuItemField } from "@/actions/menu";
import { toggleEventFeatured } from "@/actions/events";

const SLUGS = [
  { slug: "home", label: "Homepage Hero & Promo", folder: "cafe-interior" },
  { slug: "story", label: "Our Story Page", folder: "branding" },
  { slug: "space", label: "Our Space Page", folder: "cafe-interior" },
  { slug: "community", label: "Community Section", folder: "community" },
];

export default function ContentManager({ pages = {}, menuItems = [], events = [] }) {
  const [selectedSlug, setSelectedSlug] = useState("home");

  function buildFormState(slug) {
    const p = pages[slug] || {};
    return {
      slug,
      title: p.title || "",
      subtitle: p.subtitle || "",
      body: p.body || "",
      promo_banner: p.content?.promoBanner || "",
      hero_image_url: p.hero_image_url || "",
      hero_image_public_id: p.hero_image_public_id || "",
    };
  }

  const [form, setForm] = useState(() => buildFormState("home"));
  const [statusMsg, setStatusMsg] = useState("");
  const [saving, setSaving] = useState(false);

  function selectPage(slug) {
    setSelectedSlug(slug);
    setStatusMsg("");
    setForm(buildFormState(slug));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatusMsg("");
    const res = await savePageContent({ ...form, slug: selectedSlug });
    setSaving(false);
    setStatusMsg(res.ok ? "Page content updated." : res.error || "Save failed.");
  }

  const activeMeta = SLUGS.find((s) => s.slug === selectedSlug) || SLUGS[0];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2">
        {SLUGS.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => selectPage(item.slug)}
            className={`rounded-full px-4 py-2 font-sans text-xs sm:text-sm font-medium cursor-pointer ${
              selectedSlug === item.slug
                ? "bg-primary text-cream"
                : "bg-surface text-brown border border-brown/15"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {statusMsg && (
        <div className="rounded-xl bg-primary/10 border border-primary/25 px-4 py-3 font-sans text-sm text-primary">
          {statusMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-surface border border-brown/12 p-6 space-y-5 max-w-3xl"
      >
        <h2 className="font-display text-2xl font-semibold text-brown">
          Edit {activeMeta.label}
        </h2>

        {selectedSlug === "home" && (
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
              Promotional Eyebrow / Banner
            </label>
            <input
              value={form.promo_banner}
              onChange={(e) => setForm({ ...form, promo_banner: e.target.value })}
              placeholder="TRACE Expert City · Colombo 10"
              className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
            />
          </div>
        )}

        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
            Hero / Section Heading *
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
            Subtitle
          </label>
          <input
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
            Body Description
          </label>
          <textarea
            rows={4}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
          />
        </div>

        <ImageUploader
          folder={activeMeta.folder}
          label="Hero / Section Photograph"
          value={form.hero_image_url}
          onUpload={({ url, publicId }) =>
            setForm({
              ...form,
              hero_image_url: url,
              hero_image_public_id: publicId,
            })
          }
          onClear={() =>
            setForm({ ...form, hero_image_url: "", hero_image_public_id: "" })
          }
        />

        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving..." : "Save Content"}
        </Button>
      </form>

      {/* Featured Products & Featured Events Quick Selectors for Homepage */}
      {selectedSlug === "home" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-surface border border-brown/12 p-6 space-y-4">
            <h3 className="font-display text-2xl font-semibold text-brown">
              Featured Homepage Products
            </h3>
            <div className="divide-y divide-brown/10 max-h-72 overflow-y-auto">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="py-2.5 flex items-center justify-between gap-3"
                >
                  <span className="font-sans text-sm text-brown">{item.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      toggleMenuItemField(item.id, "is_featured", !item.is_featured)
                    }
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium cursor-pointer ${
                      item.is_featured
                        ? "bg-terracotta text-cream"
                        : "bg-cream border border-brown/15 text-brown/70"
                    }`}
                  >
                    <Star className="h-3 w-3" />
                    {item.is_featured ? "Featured" : "Feature"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-surface border border-brown/12 p-6 space-y-4">
            <h3 className="font-display text-2xl font-semibold text-brown">
              Featured Homepage Events
            </h3>
            <div className="divide-y divide-brown/10 max-h-72 overflow-y-auto">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="py-2.5 flex items-center justify-between gap-3"
                >
                  <span className="font-sans text-sm text-brown">{evt.title}</span>
                  <button
                    type="button"
                    onClick={() =>
                      toggleEventFeatured(evt.id, !evt.is_featured)
                    }
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium cursor-pointer ${
                      evt.is_featured
                        ? "bg-primary text-cream"
                        : "bg-cream border border-brown/15 text-brown/70"
                    }`}
                  >
                    <Star className="h-3 w-3" />
                    {evt.is_featured ? "Featured" : "Feature"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
