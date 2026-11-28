import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { FadeIn, StaggerGrid, StaggerItem } from "@/components/ui/MotionPrimitives";
import { getOptimizedImageUrl } from "@/lib/cloudinary/url";

function formatEventDate(dateStr) {
  try {
    return format(parseISO(dateStr), "EEE, MMM dd, yyyy");
  } catch {
    return dateStr;
  }
}

export default function UpcomingEventsSection({ events = [] }) {
  const activeEvents = events.filter((e) =>
    ["upcoming", "published"].includes(e.status)
  );
  const featured = activeEvents.filter((e) => e.is_featured);
  const upcoming = (featured.length > 0 ? featured : activeEvents).slice(0, 3);

  return (
    <section className="py-20 lg:py-28 bg-cream border-b border-brown/12">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <FadeIn>
            <SectionHeading
              eyebrow="Join In — Events"
              title="Upcoming gatherings at TRACE Expert City."
              description="From tabletop game socials and silent reading clubs to pour-over coffee workshops—pull up a chair and be part of the community."
            />
          </FadeIn>
          <FadeIn delay={0.08}>
            <Button href="/events" variant="outline">
              View All Events
              <ArrowRight className="h-4 w-4" />
            </Button>
          </FadeIn>
        </div>

        {upcoming.length === 0 ? (
          <div className="rounded-3xl bg-surface border border-brown/12 p-10 text-center">
            <p className="font-display text-3xl text-brown">
              New events are brewing soon.
            </p>
            <p className="font-sans text-sm text-brown/70 mt-2">
              Want to host a community gathering or workshop at The Third Place?
            </p>
            <div className="mt-5">
              <Button href="/contact" variant="primary" size="sm">
                Enquire About Hosting
              </Button>
            </div>
          </div>
        ) : (
          <StaggerGrid className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {upcoming.map((event) => (
              <StaggerItem key={event.id}>
                <article className="group h-full rounded-2xl bg-surface border border-brown/12 overflow-hidden flex flex-col hover:border-primary/40 hover:shadow-[var(--shadow-soft)] transition-all duration-200">
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
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 font-sans text-[11px] font-medium text-cream">
                      {event.category}
                    </span>
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 font-sans text-xs text-terracotta font-medium mb-2.5">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatEventDate(event.event_date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {event.start_time}
                        </span>
                      </div>

                      <Link href={`/events/${event.slug}`}>
                        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-brown group-hover:text-primary transition-colors leading-tight">
                          {event.title}
                        </h3>
                      </Link>

                      <p className="font-sans text-sm leading-relaxed text-brown/75 mt-2.5 line-clamp-3">
                        {event.summary || event.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-brown/12 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 font-sans text-xs text-brown/70 truncate">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        TRACE Expert City
                      </span>
                      <Button
                        href={`/events/${event.slug}`}
                        variant="outline"
                        size="sm"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </Container>
    </section>
  );
}
