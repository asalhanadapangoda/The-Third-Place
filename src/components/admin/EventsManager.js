"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/admin/ImageUploader";
import { deleteEvent, saveEvent, toggleEventPublished } from "@/actions/events";

const EMPTY_EVENT = {
  id: "",
  title: "",
  summary: "",
  description: "",
  category: "Community",
  event_date: "",
  end_date: "",
  start_time: "6:00 PM",
  end_time: "8:30 PM",
  location: "The Third Place, TRACE Expert City, Colombo 10",
  poster_url: "",
  poster_public_id: "",
  registration_url: "",
  capacity_label: "",
  status: "published",
  is_published: true,
  is_featured: false,
};

export default function EventsManager({ events = [] }) {
  const [form, setForm] = useState(EMPTY_EVENT);
  const [statusMsg, setStatusMsg] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatusMsg("");
    const res = await saveEvent(form);
    setSaving(false);
    if (res.ok) {
      setStatusMsg(form.id ? "Event updated." : "Event created.");
      setForm(EMPTY_EVENT);
    } else {
      setStatusMsg(res.error || "Could not save event.");
    }
  }

  return (
    <div className="space-y-10">
      {statusMsg && (
        <div className="rounded-xl bg-primary/10 border border-primary/25 px-4 py-3 font-sans text-sm text-primary">
          {statusMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-surface border border-brown/12 p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-brown">
            {form.id ? "Edit Event" : "Create New Event"}
          </h2>
          {form.id && (
            <button
              type="button"
              onClick={() => setForm(EMPTY_EVENT)}
              className="font-sans text-xs text-terracotta underline cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
              Event Title *
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
              Category
            </label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Workshop, Board Games, Reading Club..."
              className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
              Start Date *
            </label>
            <input
              type="date"
              required
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
              End Date (optional)
            </label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
              Start Time *
            </label>
            <input
              required
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
              End Time
            </label>
            <input
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
              Location
            </label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
              Registration URL (optional)
            </label>
            <input
              type="url"
              value={form.registration_url}
              onChange={(e) =>
                setForm({ ...form, registration_url: e.target.value })
              }
              placeholder="https://wa.me/94772201989"
              className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
            Short Summary
          </label>
          <input
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-brown/75 mb-1.5">
            Full Description *
          </label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-xl border border-brown/20 bg-cream px-3.5 py-2.5 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) =>
                setForm({ ...form, is_published: e.target.checked })
              }
            />
            Published
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

        <ImageUploader
          folder="events"
          label="Event Poster (Cloudinary)"
          value={form.poster_url}
          onUpload={({ url, publicId }) =>
            setForm({ ...form, poster_url: url, poster_public_id: publicId })
          }
          onClear={() =>
            setForm({ ...form, poster_url: "", poster_public_id: "" })
          }
        />

        <Button type="submit" variant="primary" disabled={saving}>
          <Plus className="h-4 w-4" />
          {saving ? "Saving..." : form.id ? "Update Event" : "Create Event"}
        </Button>
      </form>

      <div className="rounded-2xl bg-surface border border-brown/12 overflow-hidden">
        <div className="p-5 border-b border-brown/12">
          <h2 className="font-display text-2xl font-semibold text-brown">
            All Events ({events.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-cream/80 text-xs uppercase tracking-wider text-brown/70">
              <tr>
                <th className="px-5 py-3">Event</th>
                <th className="px-5 py-3">Date &amp; Time</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brown/10">
              {events.map((evt) => (
                <tr key={evt.id}>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-brown">{evt.title}</p>
                    <p className="text-xs text-brown/60">{evt.category}</p>
                  </td>
                  <td className="px-5 py-3.5 text-brown/75">
                    {evt.event_date} · {evt.start_time}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() =>
                        toggleEventPublished(evt.id, !evt.is_published)
                      }
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs cursor-pointer ${
                        evt.is_published
                          ? "bg-primary/10 text-primary"
                          : "bg-terracotta/15 text-terracotta"
                      }`}
                    >
                      {evt.is_published ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                      {evt.is_published ? "Published" : "Draft"} ({evt.status})
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          id: evt.id,
                          title: evt.title,
                          summary: evt.summary || "",
                          description: evt.description || "",
                          category: evt.category || "Community",
                          event_date: evt.event_date || "",
                          end_date: evt.end_date || "",
                          start_time: evt.start_time || "",
                          end_time: evt.end_time || "",
                          location: evt.location || "",
                          poster_url: evt.poster_url || "",
                          poster_public_id: evt.poster_public_id || "",
                          registration_url: evt.registration_url || "",
                          capacity_label: evt.capacity_label || "",
                          status: evt.status || "upcoming",
                          is_published: Boolean(evt.is_published),
                          is_featured: Boolean(evt.is_featured),
                        })
                      }
                      className="inline-flex p-1.5 rounded-lg text-primary hover:bg-primary/10 cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteEvent(evt.id, evt.poster_public_id)}
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
    </div>
  );
}
