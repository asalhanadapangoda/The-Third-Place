import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { getPageContent } from "@/lib/utils/data";
import { getOptimizedImageUrl } from "@/lib/cloudinary/url";

export const metadata = {
  title: "Our Story",
  description:
    "Discover the third-place philosophy behind The Third Place at TRACE Expert City, Colombo 10—Not Home. Not Work. Just Right.",
};

export default async function StoryPage() {
  const story = await getPageContent("story");

  return (
    <>
      <section className="py-16 sm:py-24 bg-cream border-b border-brown/12">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-6">
              <SectionHeading
                eyebrow="Our Story"
                title={story.title}
                description={story.subtitle}
              />
              <p className="font-sans text-base leading-relaxed text-brown/80">
                {story.body}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button href="/menu" variant="primary">
                  Explore Menu
                </Button>
                <Button href="/space" variant="outline">
                  Discover Our Space
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-brown/12 shadow-[var(--shadow-elevated)]">
                <Image
                  src={getOptimizedImageUrl(
                    story.hero_image_url ||
                      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80",
                    { width: 1200 }
                  )}
                  alt="Specialty coffee preparation at The Third Place Colombo"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-surface border-b border-brown/12">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                num: "01",
                label: "First Place",
                title: "Home",
                text: "Your private sanctuary for rest, family, and daily routines.",
              },
              {
                num: "02",
                label: "Second Place",
                title: "Work",
                text: "Where ambition, deadlines, and structured productivity live.",
              },
              {
                num: "03",
                label: "The Third Place",
                title: "Just Right",
                text: "Our warm community space at TRACE Expert City—built for coffee, creativity, relaxation, and real human connection.",
              },
            ].map((item, idx) => (
              <div
                key={item.num}
                className={`rounded-3xl p-8 border ${
                  idx === 2
                    ? "bg-primary text-cream border-primary"
                    : "bg-cream text-brown border-brown/12"
                }`}
              >
                <span
                  className={`font-sans text-xs font-semibold uppercase tracking-[0.2em] ${
                    idx === 2 ? "text-cream/75" : "text-terracotta"
                  }`}
                >
                  {item.num} · {item.label}
                </span>
                <h2 className="font-display text-4xl font-semibold mt-3">
                  {item.title}
                </h2>
                <p
                  className={`font-sans text-sm leading-relaxed mt-3 ${
                    idx === 2 ? "text-cream/85" : "text-brown/75"
                  }`}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
