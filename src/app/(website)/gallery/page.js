import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { getGalleryImages } from "@/lib/utils/data";

export const metadata = {
  title: "Gallery",
  description:
    "Browse photographs of specialty coffee, fresh bakes, our botanical interior, community moments, and events at The Third Place, Colombo 10.",
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <section className="py-16 sm:py-24 bg-cream">
      <Container>
        <SectionHeading
          eyebrow="Gallery"
          title="Life inside The Third Place."
          description="Filter moments across coffee, food, our botanical interior, community tables, and Colombo gatherings."
          className="mb-12"
        />
        <GalleryGrid images={images} />
      </Container>
    </section>
  );
}
