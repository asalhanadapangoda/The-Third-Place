import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { FadeIn, StaggerGrid, StaggerItem } from "@/components/ui/MotionPrimitives";
import { formatLKR } from "@/lib/utils/validation";
import { getOptimizedImageUrl } from "@/lib/cloudinary/url";

export default function SipMenuSection({ items = [] }) {
  const featured = items.filter((i) => i.is_featured).slice(0, 6);
  const displayItems = featured.length > 0 ? featured : items.slice(0, 6);

  return (
    <section className="py-20 lg:py-28 bg-cream border-b border-brown/12">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <FadeIn>
            <SectionHeading
              eyebrow="Sip — Featured Menu"
              title="Crafted pours, Ceylon teas & fresh bakes."
              description="Brewed to order with care. Explore our hot and iced coffees, artisanal teas, and all-day kitchen bakes—all priced transparently in LKR."
            />
          </FadeIn>
          <FadeIn delay={0.08}>
            <Button href="/menu" variant="primary">
              Explore Full Menu
              <ArrowRight className="h-4 w-4" />
            </Button>
          </FadeIn>
        </div>

        <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item) => (
            <StaggerItem key={item.id}>
              <article className="group h-full rounded-2xl bg-surface border border-brown/12 overflow-hidden flex flex-col hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-soft)] transition-all duration-200">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-strong">
                  {item.image_url && (
                    <Image
                      src={getOptimizedImageUrl(item.image_url, { width: 720, height: 540 })}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {item.tag && (
                    <span className="absolute top-4 left-4 rounded-full bg-cream/95 px-3 py-1 font-sans text-[11px] font-medium text-terracotta shadow-sm">
                      {item.tag}
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-1 flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-2xl font-semibold text-brown leading-snug">
                        {item.name}
                      </h3>
                      <span className="font-sans text-sm font-semibold text-primary shrink-0 pt-1">
                        {formatLKR(item.price_lkr)}
                      </span>
                    </div>
                    {item.category_name && (
                      <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-terracotta mt-1">
                        {item.category_name}
                      </p>
                    )}
                    {item.description && (
                      <p className="font-sans text-sm leading-relaxed text-brown/75 mt-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Container>
    </section>
  );
}
