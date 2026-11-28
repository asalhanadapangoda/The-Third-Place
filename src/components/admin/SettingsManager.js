"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { saveSiteSettings } from "@/actions/content";

export default function SettingsManager({ settings }) {
  const [form, setForm] = useState({
    site_name: settings?.site_name || "The Third Place",
    tagline: settings?.tagline || "Not Home. Not Work. Just Right.",
    phone: settings?.phone || "077 220 1989",
    whatsapp_number: settings?.whatsapp_number || "94772201989",
    email: settings?.email || "",
    address: settings?.address || "TRACE Expert City, Colombo 10, Sri Lanka",
    google_maps_embed_url: settings?.google_maps_embed_url || "",
    opening_hours_json: JSON.stringify(settings?.opening_hours || [], null, 2),
    instagram_url: settings?.social_links?.instagram || "",
    facebook_url: settings?.social_links?.facebook || "",
    tiktok_url: settings?.social_links?.tiktok || "",
    seo_title: settings?.seo_title || "",
    seo_description: settings?.seo_description || "",
  });

  const [statusMsg, setStatusMsg] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatusMsg("");
    const res = await saveSiteSettings(form);
    setSaving(false);
    setStatusMsg(res.ok ? "Website settings saved." : res.error || "Save failed.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-surface border border-brown/12 p-6 sm:p-8 space-y-6 max-w-3xl"
    >
      {statusMsg && (
        <div className="rounded-xl bg-primary/10 border border-primary/25 px-4 py-3 font-sans text-sm text-primary">
          {statusMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
            Site Name
          </label>
          <input
            required
            value={form.site_name}
            onChange={(e) => setForm({ ...form, site_name: e.target.value })}
            className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
            Tagline
          </label>
          <input
            required
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
            Phone Number
          </label>
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
            WhatsApp Number (international digits, e.g. 94772201989)
          </label>
          <input
            required
            value={form.whatsapp_number}
            onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
            className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
            Email (optional)
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
            Address
          </label>
          <input
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
          Opening Hours (JSON Array)
        </label>
        <textarea
          rows={4}
          value={form.opening_hours_json}
          onChange={(e) =>
            setForm({ ...form, opening_hours_json: e.target.value })
          }
          className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 font-mono text-xs"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
            Instagram URL
          </label>
          <input
            type="url"
            value={form.instagram_url}
            onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
            placeholder="https://instagram.com/..."
            className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
            Facebook URL
          </label>
          <input
            type="url"
            value={form.facebook_url}
            onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
            placeholder="https://facebook.com/..."
            className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
            TikTok URL
          </label>
          <input
            type="url"
            value={form.tiktok_url}
            onChange={(e) => setForm({ ...form, tiktok_url: e.target.value })}
            placeholder="https://tiktok.com/..."
            className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="space-y-4 pt-2 border-t border-brown/12">
        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
            SEO Title
          </label>
          <input
            value={form.seo_title}
            onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
            className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
            SEO Meta Description
          </label>
          <textarea
            rows={3}
            value={form.seo_description}
            onChange={(e) =>
              setForm({ ...form, seo_description: e.target.value })
            }
            className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
          />
        </div>
      </div>

      <Button type="submit" variant="primary" disabled={saving}>
        {saving ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
