"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { format, parseISO } from "date-fns";
import Button from "@/components/ui/Button";
import { getOptimizedImageUrl } from "@/lib/cloudinary/url";

function formatEventDate(dateStr) {
  try {
    return format(parseISO(dateStr), "EEE, MMM dd, yyyy");
  } catch {
    return dateStr;
  }
}

export default function EventsExplorer({ events = [] }) {
  const [filter, setFilter] = useState("upcoming");

  const filtered = events.filter((evt) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return ["upcoming", "published"].includes(evt.status);
    if (filter === "past") return ["past", "completed"].includes(evt.status);
    return evt.status === filter;
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2.5">
        {[
          { id: "upcoming", label: "Upcoming Events" },
          { id: "past", label: "Previous Events" },
          { id: "all", label: "All Gatherings" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`rounded-full px-5 py-2.5 font-sans text-sm font-medium transition-colors cursor-pointer ${
              filter === tab.id
                ? "bg-primary text-cream"
                : "bg-surface text-brown/80 border border-brown/15 hover:border-primary/40 hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-surface border border-brown/12 p-12 text-center">
          <p className="font-display text-3xl text-brown">
            No {filter === "all" ? "" : filter} events right now.
          </p>
          <p className="font-sans text-sm text-brown/70 mt-2">
            Check back soon or reach out to host a community gathering with us.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <article
              key={event.id}
              className="group rounded-2xl bg-surface border border-brown/12 overflow-hidden flex flex-col hover:border-primary/40 hover:shadow-[var(--shadow-soft)] transition-all duration-200"
            >
              <Link
                href={`/events/${event.slug}`}
                className="relative aspect-[16/10] w-full overflow-hidden bg-surface-strong block"
              >
                {event.poster_url && (
                  <Image
                    src={getOptimizedImageUrl(event.poster_url, {
                      width: 800,
                      height: 500,
                    })}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute top-3.5 left-3.5 flex gap-2">
                  <span className="rounded-full bg-primary px-3 py-1 font-sans text-[11px] font-medium text-cream">
                    {event.category}
                  </span>
                  {event.status === "past" && (
                    <span className="rounded-full bg-brown/90 px-3 py-1 font-sans text-[11px] font-medium text-cream">
                      Past
                    </span>
                  )}
                </div>
              </Link>

              <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                <div>
                  <div className="flex flex-wrap gap-3 font-sans text-xs font-medium text-terracotta mb-2.5">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatEventDate(event.event_date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {event.start_time}
                      {event.end_time ? ` – ${event.end_time}` : ""}
                    </span>
                  </div>

                  <Link href={`/events/${event.slug}`}>
                    <h2 className="font-display text-3xl font-semibold text-brown group-hover:text-primary transition-colors leading-tight">
                      {event.title}
                    </h2>
                  </Link>

                  <p className="font-sans text-sm leading-relaxed text-brown/75 mt-2.5">
                    {event.summary || event.description}
                  </p>

                  <p className="inline-flex items-center gap-1.5 font-sans text-xs text-brown/65 mt-4">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    {event.location}
                  </p>
                </div>

                <div className="pt-4 border-t border-brown/12 flex flex-wrap items-center justify-between gap-3">
                  <Button href={`/events/${event.slug}`} variant="outline" size="sm">
                    Event Details
                  </Button>
                  {event.status === "upcoming" && event.registration_url && (
                    <a
                      href={event.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-sans text-xs font-medium text-cream hover:bg-primary-hover transition-colors"
                    >
                      Register
                      <ExternalLink className="h-3 w-3" />
                    </a>
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
