"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Star, CheckCircle2, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  deleteMenuCategory,
  deleteMenuItem,
  saveMenuCategory,
  saveMenuItem,
  toggleMenuItemField,
} from "@/actions/menu";
import { formatLKR } from "@/lib/utils/validation";

const EMPTY_ITEM = {
  id: "",
  category_id: "",
  name: "",
  description: "",
  price_lkr: 950,
  image_url: "",
  image_public_id: "",
  tag: "",
  is_available: true,
  is_featured: false,
  display_order: 0,
};

export default function MenuManager({ categories = [], items = [] }) {
  const [form, setForm] = useState({
    ...EMPTY_ITEM,
    category_id: categories[0]?.id || "",
  });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSaveItem(e) {
    e.preventDefault();
    setSaving(true);
    setStatusMsg("");
    const res = await saveMenuItem(form);
    setSaving(false);
    if (res.ok) {
      setStatusMsg(form.id ? "Menu item updated." : "Menu item added.");
      setForm({ ...EMPTY_ITEM, category_id: categories[0]?.id || "" });
    } else {
      setStatusMsg(res.error || "Could not save item.");
    }
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const res = await saveMenuCategory({
      name: newCategoryName.trim(),
      display_order: categories.length + 1,
      is_active: true,
    });
    if (res.ok) {
      setNewCategoryName("");
      setStatusMsg("Category added.");
    } else {
      setStatusMsg(res.error);
    }
  }

  return (
    <div className="space-y-10">
      {statusMsg && (
        <div className="rounded-xl bg-primary/10 border border-primary/25 px-4 py-3 font-sans text-sm text-primary">
          {statusMsg}
        </div>
      )}

      {/* Item Form */}
      <form
        onSubmit={handleSaveItem}
        className="rounded-2xl bg-surface border border-brown/12 p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-brown">
            {form.id ? "Edit Menu Item" : "Add Menu Item"}
          </h2>
          {form.id && (
            <button
              type="button"
              onClick={() =>
                setForm({ ...EMPTY_ITEM, category_id: categories[0]?.id || "" })
              }
              className="font-sans text-xs text-terracotta underline cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
              Product Name *
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Signature Flat White"
              className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
              Category *
            </label>
            <select
              required
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
              Price (LKR) *
            </label>
            <input
              type="number"
              min={0}
              required
              value={form.price_lkr}
              onChange={(e) => setForm({ ...form, price_lkr: e.target.value })}
              className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
                Tag (optional)
              </label>
              <input
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                placeholder="House Favorite, Seasonal, Vegan..."
                className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-6 pt-1">
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_available}
                  onChange={(e) =>
                    setForm({ ...form, is_available: e.target.checked })
                  }
                />
                Available
              </label>
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) =>
                    setForm({ ...form, is_featured: e.target.checked })
                  }
                />
                Featured on Homepage
              </label>
            </div>
          </div>
        </div>

        <ImageUploader
          folder="coffee"
          value={form.image_url}
          onUpload={({ url, publicId }) =>
            setForm({ ...form, image_url: url, image_public_id: publicId })
          }
          onClear={() => setForm({ ...form, image_url: "", image_public_id: "" })}
        />

        <Button type="submit" variant="primary" disabled={saving}>
          <Plus className="h-4 w-4" />
          {saving ? "Saving..." : form.id ? "Update Item" : "Add Menu Item"}
        </Button>
      </form>

      {/* Items List */}
      <div className="rounded-2xl bg-surface border border-brown/12 overflow-hidden">
        <div className="p-5 border-b border-brown/12">
          <h2 className="font-display text-2xl font-semibold text-brown">
            Menu Items ({items.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-cream/80 text-xs uppercase tracking-wider text-brown/70">
              <tr>
                <th className="px-5 py-3">Item</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brown/10">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-3.5 font-medium text-brown">{item.name}</td>
                  <td className="px-5 py-3.5 text-brown/75">{item.category_name}</td>
                  <td className="px-5 py-3.5 font-medium text-primary">
                    {formatLKR(item.price_lkr)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          toggleMenuItemField(item.id, "is_available", !item.is_available)
                        }
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs cursor-pointer ${
                          item.is_available
                            ? "bg-primary/10 text-primary"
                            : "bg-brown/10 text-brown/60"
                        }`}
                      >
                        {item.is_available ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {item.is_available ? "Available" : "Hidden"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toggleMenuItemField(item.id, "is_featured", !item.is_featured)
                        }
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs cursor-pointer ${
                          item.is_featured
                            ? "bg-terracotta/15 text-terracotta"
                            : "bg-brown/5 text-brown/50"
                        }`}
                      >
                        <Star className="h-3 w-3" />
                        Featured
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          id: item.id,
                          category_id: item.category_id,
                          name: item.name,
                          description: item.description || "",
                          price_lkr: item.price_lkr,
                          image_url: item.image_url || "",
                          image_public_id: item.image_public_id || "",
                          tag: item.tag || "",
                          is_available: item.is_available,
                          is_featured: item.is_featured,
                          display_order: item.display_order || 0,
                        })
                      }
                      aria-label={`Edit ${item.name}`}
                      className="inline-flex p-1.5 rounded-lg text-primary hover:bg-primary/10 cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMenuItem(item.id, item.image_public_id)}
                      aria-label={`Delete ${item.name}`}
                      className="inline-flex p-1.5 rounded-lg text-terracotta hover:bg-terracotta/10 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Management */}
      <div className="rounded-2xl bg-surface border border-brown/12 p-6 space-y-4">
        <h2 className="font-display text-2xl font-semibold text-brown">
          Menu Categories
        </h2>
        <form onSubmit={handleAddCategory} className="flex flex-wrap gap-3">
          <input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name..."
            className="flex-1 min-w-[200px] rounded-xl border border-brown/20 bg-cream px-3.5 py-2 text-sm"
          />
          <Button type="submit" variant="outline" size="sm">
            Add Category
          </Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-2 rounded-full bg-cream border border-brown/15 px-3.5 py-1.5 text-xs font-medium text-brown"
            >
              {cat.name}
              <button
                type="button"
                aria-label={`Delete ${cat.name}`}
                onClick={() => deleteMenuCategory(cat.id)}
                className="text-terracotta hover:text-brown cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
