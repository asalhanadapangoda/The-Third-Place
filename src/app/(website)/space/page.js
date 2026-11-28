import Image from "next/image";
import { Wifi, Users, BookOpen, Coffee } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/forms/ContactForm";
import { getPageContent } from "@/lib/utils/data";
import { getOptimizedImageUrl } from "@/lib/cloudinary/url";

export const metadata = {
  title: "Our Space",
  description:
    "Explore the café environment at The Third Place, TRACE Expert City, Colombo 10—work-friendly tables, reading corners, community gathering areas, and space bookings.",
};

const SPACE_AREAS = [
  {
    icon: Coffee,
    title: "The Espresso Bar & Lounge",
    description:
      "Warm timber counters, botanical greenery, and relaxed seating ideal for casual coffee catch-ups.",
  },
  {
    icon: Wifi,
    title: "Work-Friendly Corners",
    description:
      "Reliable Wi-Fi, accessible power outlets, and comfortable seating for remote workers and TRACE Expert City teams.",
  },
  {
    icon: BookOpen,
    title: "Quiet Reading & Focus Nooks",
    description:
      "Soft natural light and cozy armchairs crafted for solo reading, journaling, or quiet reflection.",
  },
  {
    icon: Users,
    title: "Community Gathering Tables",
    description:
      "Spacious solid-wood tables ready for book clubs, workshops, board game evenings, and creative meetups.",
  },
];

export default async function SpacePage() {
  const space = await getPageContent("space");

  return (
    <>
      <section className="py-16 sm:py-24 bg-cream border-b border-brown/12">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-6">
              <SectionHeading
                eyebrow="Our Space — TRACE Expert City"
                title={space.title}
                description={space.subtitle}
              />
              <p className="font-sans text-base leading-relaxed text-brown/80">
                {space.body}
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-brown/12 shadow-[var(--shadow-elevated)]">
                <Image
                  src={getOptimizedImageUrl(
                    space.hero_image_url ||
                      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1400&q=80",
                    { width: 1200 }
                  )}
                  alt="Warm botanical interior of The Third Place café at TRACE Expert City"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SPACE_AREAS.map((area) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.title}
                  className="rounded-2xl bg-surface border border-brown/12 p-6 space-y-3"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="font-display text-2xl font-semibold text-brown">
                    {area.title}
                  </h2>
                  <p className="font-sans text-sm leading-relaxed text-brown/75">
                    {area.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-20 bg-surface">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Space Booking Enquiry"
              title="Host your meetup, workshop, or group gathering."
              description="Tell us your preferred date, group size, and vision—our team at TRACE Expert City will help arrange seating and refreshments."
              align="center"
              className="mb-10"
            />
            <div className="rounded-3xl bg-cream border border-brown/12 p-7 sm:p-10 shadow-[var(--shadow-soft)]">
              <ContactForm defaultTopic="Space Booking" showBookingFields />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
