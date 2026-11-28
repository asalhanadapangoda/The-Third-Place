import { MapPin, Clock, Phone, MessageCircle, ExternalLink } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/forms/ContactForm";
import { FadeIn } from "@/components/ui/MotionPrimitives";

export default function ContactSection({ settings }) {
  const phone = settings?.phone || "077 220 1989";
  const whatsapp = settings?.whatsapp_number || "94772201989";
  const address = settings?.address || "TRACE Expert City, Colombo 10, Sri Lanka";
  const hours = settings?.opening_hours || [];
  const mapUrl =
    settings?.google_maps_embed_url ||
    "https://www.google.com/maps?q=TRACE+Expert+City+Colombo+10+Sri+Lanka&output=embed";

  return (
    <section className="py-20 lg:py-28 bg-cream">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Verified Location & Direct Contact */}
          <FadeIn className="lg:col-span-5 space-y-8">
            <SectionHeading
              eyebrow="Location & Contact"
              title="Find us at TRACE Expert City."
              description="Stop by for your morning flat white, reserve a table for your book club, or reach out about hosting a community event."
            />

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </span>
                <div className="font-sans text-sm">
                  <p className="font-semibold text-brown">Address</p>
                  <p className="text-brown/75 mt-0.5">{address}</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=TRACE+Expert+City+Colombo+10+Sri+Lanka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary mt-1.5 hover:underline"
                  >
                    Get Directions on Google Maps
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
                  <Clock className="h-5 w-5" />
                </span>
                <div className="font-sans text-sm">
                  <p className="font-semibold text-brown">Opening Hours</p>
                  <div className="text-brown/75 mt-0.5 space-y-0.5">
                    {hours.length > 0 ? (
                      hours.map((row) => (
                        <p key={row.days}>
                          <span className="font-medium text-brown">{row.days}:</span>{" "}
                          {row.time}
                        </p>
                      ))
                    ) : (
                      <p>
                        Contact us on{" "}
                        <a
                          href={`tel:+${whatsapp}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {phone}
                        </a>{" "}
                        or WhatsApp for current hours.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={`tel:+${whatsapp}`}
                  className="inline-flex items-center gap-2 rounded-full border border-brown/25 bg-surface px-5 py-2.5 font-sans text-sm font-medium text-brown hover:border-primary hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  {phone}
                </a>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-sans text-sm font-medium text-cream hover:bg-primary-hover transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="overflow-hidden rounded-2xl border border-brown/15 bg-surface h-56">
              <iframe
                title="The Third Place at TRACE Expert City, Colombo 10"
                src={mapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
          </FadeIn>

          {/* Validated Contact Form */}
          <FadeIn delay={0.1} className="lg:col-span-7">
            <div className="rounded-3xl bg-surface border border-brown/12 p-7 sm:p-10 shadow-[var(--shadow-soft)]">
              <div className="mb-6">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                  Send a Note
                </p>
                <h3 className="font-display text-3xl font-semibold text-brown mt-1">
                  We’d love to hear from you.
                </h3>
              </div>
              <ContactForm />
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
