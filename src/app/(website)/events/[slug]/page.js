import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, MapPin, ExternalLink, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import Container from "@/components/ui/Container";
import ContactForm from "@/components/forms/ContactForm";
import { getEventBySlug } from "@/lib/utils/data";
import { getOptimizedImageUrl } from "@/lib/cloudinary/url";

function formatEventDate(dateStr) {
  try {
    return format(parseISO(dateStr), "EEEE, MMMM dd, yyyy");
  } catch {
    return dateStr;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.title,
    description: event.summary || event.description,
  };
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <section className="py-14 sm:py-20 bg-cream">
      <Container>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 font-sans text-sm font-medium text-primary hover:underline mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Events
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-primary px-3.5 py-1 font-sans text-xs font-medium text-cream">
                  {event.category}
                </span>
                {event.capacity_label && (
                  <span className="rounded-full border border-terracotta/30 bg-terracotta/10 px-3.5 py-1 font-sans text-xs font-medium text-terracotta">
                    {event.capacity_label}
                  </span>
                )}
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.06] text-brown">
                {event.title}
              </h1>
            </div>

            {event.poster_url && (
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-brown/12 bg-surface">
                <Image
                  src={getOptimizedImageUrl(event.poster_url, { width: 1200 })}
                  alt={event.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl bg-surface border border-brown/12 p-5 font-sans text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-terracotta shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-brown/60">Date</p>
                  <p className="font-medium text-brown">{formatEventDate(event.event_date)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-brown/60">Time</p>
                  <p className="font-medium text-brown">
                    {event.start_time}
                    {event.end_time ? ` – ${event.end_time}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-brown/60">Location</p>
                  <p className="font-medium text-brown">{event.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 font-sans text-base leading-relaxed text-brown/80">
              {event.summary && (
                <p className="text-lg font-medium text-brown">{event.summary}</p>
              )}
              <p className="whitespace-pre-line">{event.description}</p>
            </div>

            {event.status === "upcoming" && event.registration_url && (
              <div className="pt-2">
                <a
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-sans text-sm font-medium text-cream hover:bg-primary-hover transition-colors"
                >
                  <Users className="h-4 w-4" />
                  Register for this Event
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-3xl bg-surface border border-brown/12 p-7 shadow-[var(--shadow-soft)]">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                Event Enquiry
              </p>
              <h2 className="font-display text-3xl font-semibold text-brown mt-1 mb-5">
                Questions about this event?
              </h2>
              <ContactForm defaultTopic="Event Registration" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
