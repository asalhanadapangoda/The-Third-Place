import Link from "next/link";
import {
  Coffee,
  MessageCircle,
  Dices,
  BookOpen,
  CalendarHeart,
  ArrowRight,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { FadeIn, StaggerGrid, StaggerItem } from "@/components/ui/MotionPrimitives";

const PILLARS = [
  {
    id: "sip",
    title: "Sip",
    tagline: "Specialty Coffee & Ceylon Teas",
    description:
      "Hand-pulled espresso, V60 pour-overs, Colombo iced classics, and warm morning bakes.",
    href: "/menu",
    Icon: Coffee,
  },
  {
    id: "chat",
    title: "Chat",
    tagline: "Real Community & Connection",
    description:
      "Tables designed for catching up with friends, networking, and unhurried conversations.",
    href: "/story",
    Icon: MessageCircle,
  },
  {
    id: "play",
    title: "Play",
    tagline: "Board & Card Games",
    description:
      "Unplug over tabletop classics and modern strategy games with friends or new faces.",
    href: "/play-read",
    Icon: Dices,
  },
  {
    id: "read",
    title: "Read",
    tagline: "Books & Quiet Corners",
    description:
      "Settle into sunlit armchairs with a novel, journal, or magazine from our curated shelves.",
    href: "/play-read",
    Icon: BookOpen,
  },
  {
    id: "join",
    title: "Join In",
    tagline: "Colombo Events & Workshops",
    description:
      "Silent reading clubs, coffee workshops, tabletop socials, and acoustic evenings.",
    href: "/events",
    Icon: CalendarHeart,
  },
];

export default function BrandIntroSection({ page }) {
  return (
    <section className="py-20 lg:py-28 bg-surface border-b border-brown/12">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end mb-14">
          <FadeIn className="lg:col-span-7">
            <SectionHeading
              eyebrow="The Third Place Concept"
              title="First place is home. Second is work. This is your third."
              description={
                page?.body ||
                "A welcoming space beyond home and work at TRACE Expert City, Colombo 10—where specialty coffee meets calm focus, playful afternoons, and genuine neighborhood belonging."
              }
            />
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-5 lg:flex lg:justify-end">
            <Button href="/story" variant="outline">
              Read Our Story
              <ArrowRight className="h-4 w-4" />
            </Button>
          </FadeIn>
        </div>

        <StaggerGrid className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.Icon;
            return (
              <StaggerItem key={pillar.id}>
                <Link
                  href={pillar.href}
                  className="group h-full rounded-2xl bg-cream border border-brown/12 p-6 transition-all duration-200 hover:border-primary/45 hover:shadow-[var(--shadow-soft)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-cream transition-colors">
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <span className="font-sans text-xs font-medium text-terracotta">
                        0{idx + 1}
                      </span>
                    </div>
                    <h3 className="font-display text-3xl font-semibold text-brown group-hover:text-primary transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mt-1.5">
                      {pillar.tagline}
                    </p>
                    <p className="font-sans text-sm leading-relaxed text-brown/75 mt-3">
                      {pillar.description}
                    </p>
                  </div>

                  <span className="mt-5 inline-flex items-center gap-1.5 font-sans text-xs font-medium text-terracotta group-hover:translate-x-0.5 transition-transform">
                    Discover
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </Container>
    </section>
  );
}
