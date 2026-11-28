import Image from "next/image";
import { ArrowRight, MapPin, Clock, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { FadeIn, ImageReveal } from "@/components/ui/MotionPrimitives";
import { getOptimizedImageUrl } from "@/lib/cloudinary/url";

export default function HeroSection({ page, settings }) {
  const heroTitle = page?.title || "Not Home. Not Work. Just Right.";
  const promoBanner =
    page?.content?.promoBanner || "TRACE Expert City · Colombo 10";
  const heroSubtitle =
    page?.subtitle ||
    "A warm specialty coffee shop and community space at TRACE Expert City, Colombo 10.";
  const heroImage = getOptimizedImageUrl(
    page?.hero_image_url ||
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80",
    { width: 1400 }
  );
  const address = settings?.address || "TRACE Expert City, Colombo 10, Sri Lanka";
  const firstHours = settings?.opening_hours?.[0];

  return (
    <section className="relative overflow-hidden bg-cream bg-warm-grain border-b border-brown/12">
      <Container className="py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Editorial Copy */}
          <div className="lg:col-span-6 space-y-7">
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2 rounded-full border border-terracotta/30 bg-surface px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-terracotta" />
                <span className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-terracotta">
                  {promoBanner}
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.03] text-brown">
                {heroTitle === "Not Home. Not Work. Just Right." ? (
                  <>
                    Not Home. <span className="block">Not Work.</span>
                    <span className="italic text-primary">Just Right.</span>
                  </>
                ) : (
                  heroTitle
                )}
              </h1>
            </FadeIn>

            <FadeIn delay={0.14}>
              <p className="font-sans text-base sm:text-lg leading-relaxed text-brown/75 max-w-xl">
                {heroSubtitle} Come for specialty coffee and Ceylon brews—stay
                to relax, focus, read, play board games, meet friends, and join
                a welcoming Colombo community.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Button href="/menu" variant="primary" size="lg">
                  Explore Menu
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/space" variant="outline" size="lg">
                  Discover Our Space
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.26}>
              <div className="pt-6 border-t border-brown/12 flex flex-wrap gap-x-7 gap-y-2.5 font-sans text-xs text-brown/75">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-terracotta shrink-0" />
                  {address}
                </span>
                {firstHours && (
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    {firstHours.days}: {firstHours.time}
                  </span>
                )}
              </div>
            </FadeIn>
          </div>

          {/* Photography-First Hero Composition */}
          <div className="lg:col-span-6">
            <ImageReveal delay={0.12}>
              <div className="relative">
                <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-brown/12 shadow-[var(--shadow-elevated)] bg-primary/10">
                  <Image
                    src={heroImage}
                    alt={`${heroTitle} — The Third Place coffee shop at TRACE Expert City, Colombo`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown/55 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-cream">
                    <div>
                      <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-cream/80">
                        Colombo’s Urban Botanical Café
                      </p>
                      <p className="font-display text-2xl sm:text-3xl italic leading-tight mt-1">
                        Sip · Chat · Play · Read · Join In
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating editorial badge */}
                <div className="hidden sm:flex absolute -bottom-5 -left-6 rounded-2xl bg-primary text-cream px-5 py-4 shadow-[var(--shadow-soft)] border border-cream/15 items-center gap-4">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-cream/75">
                      Call or WhatsApp
                    </p>
                    <a
                      href={`tel:+${settings?.whatsapp_number || "94772201989"}`}
                      className="font-display text-2xl font-semibold text-cream hover:underline"
                    >
                      {settings?.phone || "077 220 1989"}
                    </a>
                  </div>
                </div>
              </div>
            </ImageReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
