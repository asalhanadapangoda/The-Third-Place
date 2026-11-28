import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { FadeIn, StaggerGrid, StaggerItem } from "@/components/ui/MotionPrimitives";
import { getOptimizedImageUrl } from "@/lib/cloudinary/url";

export default function SpaceGallerySection({ images = [] }) {
  const previewImages = images.slice(0, 6);

  return (
    <section className="py-20 lg:py-28 bg-surface border-b border-brown/12">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <FadeIn>
            <SectionHeading
              eyebrow="Space & Gallery"
              title="Moments inside The Third Place."
              description="Urban botanical calm, natural timber, morning light, and the unmistakable warmth of Colombo’s favorite gathering spot."
            />
          </FadeIn>
          <FadeIn delay={0.08} className="flex flex-wrap gap-3">
            <Button href="/space" variant="outline">
              Discover Our Space
            </Button>
            <Button href="/gallery" variant="primary">
              Full Gallery
              <ArrowRight className="h-4 w-4" />
            </Button>
          </FadeIn>
        </div>

        <StaggerGrid className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {previewImages.map((img, idx) => (
            <StaggerItem
              key={img.id}
              className={idx === 0 ? "sm:col-span-2 lg:col-span-2" : ""}
            >
              <figure className="group relative overflow-hidden rounded-3xl border border-brown/12 bg-cream h-72 sm:h-80">
                <Image
                  src={getOptimizedImageUrl(img.image_url, {
                    width: idx === 0 ? 1200 : 800,
                  })}
                  alt={img.alt_text || img.title}
                  fill
                  sizes={
                    idx === 0
                      ? "(max-width: 1024px) 100vw, 66vw"
                      : "(max-width: 1024px) 50vw, 33vw"
                  }
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brown/80 via-brown/35 to-transparent p-6 text-cream">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-cream/80">
                    {img.category}
                  </span>
                  <p className="font-display text-2xl font-semibold leading-tight mt-0.5">
                    {img.title}
                  </p>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Container>
    </section>
  );
}
