import Image from "next/image";
import { Users, Coffee, Handshake, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { FadeIn, ImageReveal } from "@/components/ui/MotionPrimitives";
import { getOptimizedImageUrl } from "@/lib/cloudinary/url";

const COMMUNITY_POINTS = [
  {
    icon: Coffee,
    title: "Meeting Friends",
    text: "Unhurried catch-ups around warm timber tables without loud distractions.",
  },
  {
    icon: Handshake,
    title: "Networking & Collaboration",
    text: "Located inside TRACE Expert City—where founders, creatives, and students cross paths naturally.",
  },
  {
    icon: Users,
    title: "Community Activities",
    text: "Weekly clubs, workshops, and social nights designed to make Colombo feel smaller and warmer.",
  },
  {
    icon: Sparkles,
    title: "Belonging Without Pressure",
    text: "Come solo with a book or arrive with your whole crew—everyone has a seat here.",
  },
];

export default function ChatCommunitySection({ page }) {
  const imageUrl = getOptimizedImageUrl(
    page?.hero_image_url ||
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=80",
    { width: 1200 }
  );

  return (
    <section className="py-20 lg:py-28 bg-primary text-cream relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full border border-cream/10"
      />
      <Container className="relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6 space-y-8">
            <FadeIn>
              <SectionHeading
                eyebrow="Chat — Community & Lifestyle"
                title={page?.title || "Chat, Connect & Collaborate."}
                description={
                  page?.body ||
                  "Great cafés are the heartbeat of a city. At The Third Place, conversations flow naturally—from casual coffee meetups and creative brainstorms to neighborhood friendships."
                }
                light
              />
            </FadeIn>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {COMMUNITY_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <div
                    key={point.title}
                    className="rounded-2xl bg-cream/8 border border-cream/15 p-5 space-y-2"
                  >
                    <Icon className="h-5 w-5 text-terracotta" />
                    <h3 className="font-display text-2xl font-semibold text-cream">
                      {point.title}
                    </h3>
                    <p className="font-sans text-xs leading-relaxed text-cream/80">
                      {point.text}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-1 flex flex-wrap gap-3">
              <Button href="/events" variant="terracotta">
                Join an Event
              </Button>
              <Button href="/space" variant="outlineLight">
                Book Community Space
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <ImageReveal>
              <div className="relative aspect-[4/3] lg:aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-cream/20 shadow-[var(--shadow-elevated)]">
                <Image
                  src={imageUrl}
                  alt="People conversing and collaborating over coffee at The Third Place"
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>
            </ImageReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
