"use client";

import { Trash2, Mail, Phone, Calendar, Users } from "lucide-react";
import { deleteEnquiry, updateEnquiryStatus } from "@/actions/enquiries";

export default function EnquiriesManager({ enquiries = [] }) {
  if (!enquiries.length) {
    return (
      <div className="rounded-2xl bg-surface border border-brown/12 p-12 text-center">
        <p className="font-display text-3xl text-brown">No enquiries yet</p>
        <p className="font-sans text-sm text-brown/70 mt-2">
          Customer messages and space booking requests will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {enquiries.map((enq) => (
        <article
          key={enq.id}
          className="rounded-2xl bg-surface border border-brown/12 p-6 space-y-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-display text-2xl font-semibold text-brown">
                  {enq.name}
                </h2>
                <span className="rounded-full bg-terracotta/12 px-3 py-0.5 font-sans text-xs font-medium text-terracotta">
                  {enq.topic}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-4 font-sans text-xs text-brown/75">
                <a
                  href={`mailto:${enq.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-primary"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {enq.email}
                </a>
                {enq.phone && (
                  <a
                    href={`tel:${enq.phone}`}
                    className="inline-flex items-center gap-1.5 hover:text-primary"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {enq.phone}
                  </a>
                )}
                {enq.event_date && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {enq.event_date}
                  </span>
                )}
                {enq.guest_count && (
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    {enq.guest_count}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                aria-label="Enquiry status"
                value={enq.status}
                onChange={(e) => updateEnquiryStatus(enq.id, e.target.value)}
                className="rounded-full border border-brown/20 bg-cream px-3 py-1.5 font-sans text-xs font-medium text-brown cursor-pointer"
              >
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <button
                type="button"
                aria-label="Delete enquiry"
                onClick={() => deleteEnquiry(enq.id)}
                className="p-2 rounded-lg text-terracotta hover:bg-terracotta/10 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="font-sans text-sm leading-relaxed text-brown/85 whitespace-pre-line border-t border-brown/10 pt-4">
            {enq.message}
          </p>
        </article>
      ))}
    </div>
  );
}
